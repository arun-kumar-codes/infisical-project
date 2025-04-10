/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ForbiddenError } from "@casl/ability";
import axios from "axios";
import jwt from "jsonwebtoken";

import { IdentityAuthMethod } from "@app/db/schemas";
import { TLicenseServiceFactory } from "@app/ee/services/license/license-service";
import { OrgPermissionIdentityActions, OrgPermissionSubjects } from "@app/ee/services/permission/org-permission";
import {
  constructPermissionErrorMessage,
  validatePrivilegeChangeOperation
} from "@app/ee/services/permission/permission-fns";
import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { getConfig } from "@app/lib/config/env";
import { BadRequestError, NotFoundError, PermissionBoundaryError, UnauthorizedError } from "@app/lib/errors";
import { extractIPDetails, isValidIpOrCidr } from "@app/lib/ip";

import { ActorType, AuthTokenType } from "../auth/auth-type";
import { TIdentityOrgDALFactory } from "../identity/identity-org-dal";
import { TIdentityAccessTokenDALFactory } from "../identity-access-token/identity-access-token-dal";
import { TIdentityAccessTokenJwtPayload } from "../identity-access-token/identity-access-token-types";
import { validateIdentityUpdateForSuperAdminPrivileges } from "../super-admin/super-admin-fns";
import { TIdentityAwsAuthDALFactory } from "./identity-aws-auth-dal";
import { extractPrincipalArn } from "./identity-aws-auth-fns";
import {
  TAttachAwsAuthDTO,
  TAwsGetCallerIdentityHeaders,
  TGetAwsAuthDTO,
  TGetCallerIdentityResponse,
  TLoginAwsAuthDTO,
  TRevokeAwsAuthDTO,
  TUpdateAwsAuthDTO
} from "./identity-aws-auth-types";

type TIdentityAwsAuthServiceFactoryDep = {
  identityAccessTokenDAL: Pick<TIdentityAccessTokenDALFactory, "create" | "delete">;
  identityAwsAuthDAL: Pick<TIdentityAwsAuthDALFactory, "findOne" | "transaction" | "create" | "updateById" | "delete">;
  identityOrgMembershipDAL: Pick<TIdentityOrgDALFactory, "findOne">;
  licenseService: Pick<TLicenseServiceFactory, "getPlan">;
  permissionService: Pick<TPermissionServiceFactory, "getOrgPermission">;
};

export type TIdentityAwsAuthServiceFactory = ReturnType<typeof identityAwsAuthServiceFactory>;

const awsRegionFromHeader = (authorizationHeader: string): string | null => {
  // https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-auth-using-authorization-header.html
  // The Authorization header takes the following form.
  //  Authorization: AWS4-HMAC-SHA256
  //	Credential=AKIAIOSFODNN7EXAMPLE/20230719/us-east-1/sts/aws4_request,
  // 	SignedHeaders=content-length;content-type;host;x-amz-date,
  //	Signature=fe5f80f77d5fa3beca038a248ff027d0445342fe2855ddc963176630326f1024
  //
  // The credential is in the form of "<your-access-key-id>/<date>/<aws-region>/<aws-service>/aws4_request"
  try {
    const fields = authorizationHeader.split(" ");
    for (const field of fields) {
      if (field.startsWith("Credential=")) {
        const parts = field.split("/");
        if (parts.length >= 3) {
          return parts[2];
        }
      }
    }
  } catch {
    return null;
  }
  return null;
};

export const identityAwsAuthServiceFactory = ({
  identityAccessTokenDAL,
  identityAwsAuthDAL,
  identityOrgMembershipDAL,
  licenseService,
  permissionService
}: TIdentityAwsAuthServiceFactoryDep) => {
  const login = async ({ identityId, iamHttpRequestMethod, iamRequestBody, iamRequestHeaders }: TLoginAwsAuthDTO) => {
    const identityAwsAuth = await identityAwsAuthDAL.findOne({ identityId });
    if (!identityAwsAuth) {
      throw new NotFoundError({ message: "AWS auth method not found for identity, did you configure AWS auth?" });
    }

    const identityMembershipOrg = await identityOrgMembershipDAL.findOne({ identityId: identityAwsAuth.identityId });

    const headers: TAwsGetCallerIdentityHeaders = JSON.parse(Buffer.from(iamRequestHeaders, "base64").toString());
    const body: string = Buffer.from(iamRequestBody, "base64").toString();

    const region = headers.Authorization ? awsRegionFromHeader(headers.Authorization) : null;
    const url = region ? `https://sts.${region}.amazonaws.com` : identityAwsAuth.stsEndpoint;

    const {
      data: {
        GetCallerIdentityResponse: {
          GetCallerIdentityResult: { Account, Arn }
        }
      }
    }: { data: TGetCallerIdentityResponse } = await axios({
      method: iamHttpRequestMethod,
      url,
      headers,
      data: body
    });

    if (identityAwsAuth.allowedAccountIds) {
      // validate if Account is in the list of allowed Account IDs

      const isAccountAllowed = identityAwsAuth.allowedAccountIds
        .split(",")
        .map((accountId) => accountId.trim())
        .some((accountId) => accountId === Account);

      if (!isAccountAllowed)
        throw new UnauthorizedError({
          message: "Access denied: AWS account ID not allowed."
        });
    }

    if (identityAwsAuth.allowedPrincipalArns) {
      // validate if Arn is in the list of allowed Principal ARNs

      const isArnAllowed = identityAwsAuth.allowedPrincipalArns
        .split(",")
        .map((principalArn) => principalArn.trim())
        .some((principalArn) => {
          // convert wildcard ARN to a regular expression: "arn:aws:iam::123456789012:*" -> "^arn:aws:iam::123456789012:.*$"
          // considers exact matches + wildcard matches
          // heavily validated in router
          const regex = new RegExp(`^${principalArn.replaceAll("*", ".*")}$`);
          return regex.test(extractPrincipalArn(Arn));
        });

      if (!isArnAllowed)
        throw new UnauthorizedError({
          message: "Access denied: AWS principal ARN not allowed."
        });
    }

    const identityAccessToken = await identityAwsAuthDAL.transaction(async (tx) => {
      const newToken = await identityAccessTokenDAL.create(
        {
          identityId: identityAwsAuth.identityId,
          isAccessTokenRevoked: false,
          accessTokenTTL: identityAwsAuth.accessTokenTTL,
          accessTokenMaxTTL: identityAwsAuth.accessTokenMaxTTL,
          accessTokenNumUses: 0,
          accessTokenNumUsesLimit: identityAwsAuth.accessTokenNumUsesLimit,
          authMethod: IdentityAuthMethod.AWS_AUTH
        },
        tx
      );
      return newToken;
    });

    const appCfg = getConfig();
    const accessToken = jwt.sign(
      {
        identityId: identityAwsAuth.identityId,
        identityAccessTokenId: identityAccessToken.id,
        authTokenType: AuthTokenType.IDENTITY_ACCESS_TOKEN
      } as TIdentityAccessTokenJwtPayload,
      appCfg.AUTH_SECRET,
      // akhilmhdh: for non-expiry tokens you should not even set the value, including undefined. Even for undefined jsonwebtoken throws error
      Number(identityAccessToken.accessTokenTTL) === 0
        ? undefined
        : {
            expiresIn: Number(identityAccessToken.accessTokenTTL)
          }
    );

    return { accessToken, identityAwsAuth, identityAccessToken, identityMembershipOrg };
  };

  const attachAwsAuth = async ({
    identityId,
    stsEndpoint,
    allowedPrincipalArns,
    allowedAccountIds,
    accessTokenTTL,
    accessTokenMaxTTL,
    accessTokenNumUsesLimit,
    accessTokenTrustedIps,
    actorId,
    actorAuthMethod,
    actor,
    actorOrgId,
    isActorSuperAdmin
  }: TAttachAwsAuthDTO) => {
    await validateIdentityUpdateForSuperAdminPrivileges(identityId, isActorSuperAdmin);

    const identityMembershipOrg = await identityOrgMembershipDAL.findOne({ identityId });
    if (!identityMembershipOrg) throw new NotFoundError({ message: `Failed to find identity with ID ${identityId}` });

    if (identityMembershipOrg.identity.authMethods.includes(IdentityAuthMethod.AWS_AUTH)) {
      throw new BadRequestError({
        message: "Failed to add AWS Auth to already configured identity"
      });
    }

    if (accessTokenMaxTTL > 0 && accessTokenTTL > accessTokenMaxTTL) {
      throw new BadRequestError({ message: "Access token TTL cannot be greater than max TTL" });
    }

    const { permission } = await permissionService.getOrgPermission(
      actor,
      actorId,
      identityMembershipOrg.orgId,
      actorAuthMethod,
      actorOrgId
    );
    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionIdentityActions.Create, OrgPermissionSubjects.Identity);

    const plan = await licenseService.getPlan(identityMembershipOrg.orgId);
    const reformattedAccessTokenTrustedIps = accessTokenTrustedIps.map((accessTokenTrustedIp) => {
      if (
        !plan.ipAllowlisting &&
        accessTokenTrustedIp.ipAddress !== "0.0.0.0/0" &&
        accessTokenTrustedIp.ipAddress !== "::/0"
      )
        throw new BadRequestError({
          message:
            "Failed to add IP access range to access token due to plan restriction. Upgrade plan to add IP access range."
        });
      if (!isValidIpOrCidr(accessTokenTrustedIp.ipAddress))
        throw new BadRequestError({
          message: "The IP is not a valid IPv4, IPv6, or CIDR block"
        });
      return extractIPDetails(accessTokenTrustedIp.ipAddress);
    });

    const identityAwsAuth = await identityAwsAuthDAL.transaction(async (tx) => {
      const doc = await identityAwsAuthDAL.create(
        {
          identityId: identityMembershipOrg.identityId,
          type: "iam",
          stsEndpoint,
          allowedPrincipalArns,
          allowedAccountIds,
          accessTokenMaxTTL,
          accessTokenTTL,
          accessTokenNumUsesLimit,
          accessTokenTrustedIps: JSON.stringify(reformattedAccessTokenTrustedIps)
        },
        tx
      );
      return doc;
    });
    return { ...identityAwsAuth, orgId: identityMembershipOrg.orgId };
  };

  const updateAwsAuth = async ({
    identityId,
    stsEndpoint,
    allowedPrincipalArns,
    allowedAccountIds,
    accessTokenTTL,
    accessTokenMaxTTL,
    accessTokenNumUsesLimit,
    accessTokenTrustedIps,
    actorId,
    actorAuthMethod,
    actor,
    actorOrgId
  }: TUpdateAwsAuthDTO) => {
    const identityMembershipOrg = await identityOrgMembershipDAL.findOne({ identityId });
    if (!identityMembershipOrg) throw new NotFoundError({ message: `Failed to find identity with ID ${identityId}` });

    if (!identityMembershipOrg.identity.authMethods.includes(IdentityAuthMethod.AWS_AUTH)) {
      throw new NotFoundError({
        message: "The identity does not have AWS Auth attached"
      });
    }

    const identityAwsAuth = await identityAwsAuthDAL.findOne({ identityId });

    if (
      (accessTokenMaxTTL || identityAwsAuth.accessTokenMaxTTL) > 0 &&
      (accessTokenTTL || identityAwsAuth.accessTokenMaxTTL) > (accessTokenMaxTTL || identityAwsAuth.accessTokenMaxTTL)
    ) {
      throw new BadRequestError({ message: "Access token TTL cannot be greater than max TTL" });
    }

    const { permission } = await permissionService.getOrgPermission(
      actor,
      actorId,
      identityMembershipOrg.orgId,
      actorAuthMethod,
      actorOrgId
    );
    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionIdentityActions.Edit, OrgPermissionSubjects.Identity);

    const plan = await licenseService.getPlan(identityMembershipOrg.orgId);
    const reformattedAccessTokenTrustedIps = accessTokenTrustedIps?.map((accessTokenTrustedIp) => {
      if (
        !plan.ipAllowlisting &&
        accessTokenTrustedIp.ipAddress !== "0.0.0.0/0" &&
        accessTokenTrustedIp.ipAddress !== "::/0"
      )
        throw new BadRequestError({
          message:
            "Failed to add IP access range to access token due to plan restriction. Upgrade plan to add IP access range."
        });
      if (!isValidIpOrCidr(accessTokenTrustedIp.ipAddress))
        throw new BadRequestError({
          message: "The IP is not a valid IPv4, IPv6, or CIDR block"
        });
      return extractIPDetails(accessTokenTrustedIp.ipAddress);
    });

    const updatedAwsAuth = await identityAwsAuthDAL.updateById(identityAwsAuth.id, {
      stsEndpoint,
      allowedPrincipalArns,
      allowedAccountIds,
      accessTokenMaxTTL,
      accessTokenTTL,
      accessTokenNumUsesLimit,
      accessTokenTrustedIps: reformattedAccessTokenTrustedIps
        ? JSON.stringify(reformattedAccessTokenTrustedIps)
        : undefined
    });

    return { ...updatedAwsAuth, orgId: identityMembershipOrg.orgId };
  };

  const getAwsAuth = async ({ identityId, actorId, actor, actorAuthMethod, actorOrgId }: TGetAwsAuthDTO) => {
    const identityMembershipOrg = await identityOrgMembershipDAL.findOne({ identityId });
    if (!identityMembershipOrg) throw new NotFoundError({ message: `Failed to find identity with ID ${identityId}` });

    if (!identityMembershipOrg.identity.authMethods.includes(IdentityAuthMethod.AWS_AUTH)) {
      throw new BadRequestError({
        message: "The identity does not have AWS Auth attached"
      });
    }

    const awsIdentityAuth = await identityAwsAuthDAL.findOne({ identityId });

    const { permission } = await permissionService.getOrgPermission(
      actor,
      actorId,
      identityMembershipOrg.orgId,
      actorAuthMethod,
      actorOrgId
    );
    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionIdentityActions.Read, OrgPermissionSubjects.Identity);
    return { ...awsIdentityAuth, orgId: identityMembershipOrg.orgId };
  };

  const revokeIdentityAwsAuth = async ({
    identityId,
    actorId,
    actor,
    actorAuthMethod,
    actorOrgId
  }: TRevokeAwsAuthDTO) => {
    const identityMembershipOrg = await identityOrgMembershipDAL.findOne({ identityId });
    if (!identityMembershipOrg) throw new NotFoundError({ message: `Failed to find identity with ID ${identityId}` });
    if (!identityMembershipOrg.identity.authMethods.includes(IdentityAuthMethod.AWS_AUTH)) {
      throw new BadRequestError({
        message: "The identity does not have aws auth"
      });
    }
    const { permission, membership } = await permissionService.getOrgPermission(
      actor,
      actorId,
      identityMembershipOrg.orgId,
      actorAuthMethod,
      actorOrgId
    );
    ForbiddenError.from(permission).throwUnlessCan(OrgPermissionIdentityActions.Edit, OrgPermissionSubjects.Identity);

    const { permission: rolePermission } = await permissionService.getOrgPermission(
      ActorType.IDENTITY,
      identityMembershipOrg.identityId,
      identityMembershipOrg.orgId,
      actorAuthMethod,
      actorOrgId
    );

    const permissionBoundary = validatePrivilegeChangeOperation(
      membership.shouldUseNewPrivilegeSystem,
      OrgPermissionIdentityActions.RevokeAuth,
      OrgPermissionSubjects.Identity,
      permission,
      rolePermission
    );

    if (!permissionBoundary.isValid)
      throw new PermissionBoundaryError({
        message: constructPermissionErrorMessage(
          "Failed to revoke aws auth of identity with more privileged role",
          membership.shouldUseNewPrivilegeSystem,
          OrgPermissionIdentityActions.RevokeAuth,
          OrgPermissionSubjects.Identity
        ),
        details: { missingPermissions: permissionBoundary.missingPermissions }
      });

    const revokedIdentityAwsAuth = await identityAwsAuthDAL.transaction(async (tx) => {
      const deletedAwsAuth = await identityAwsAuthDAL.delete({ identityId }, tx);
      await identityAccessTokenDAL.delete({ identityId, authMethod: IdentityAuthMethod.AWS_AUTH }, tx);

      return { ...deletedAwsAuth?.[0], orgId: identityMembershipOrg.orgId };
    });
    return revokedIdentityAwsAuth;
  };

  return {
    login,
    attachAwsAuth,
    updateAwsAuth,
    getAwsAuth,
    revokeIdentityAwsAuth
  };
};
