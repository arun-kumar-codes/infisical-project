import { request } from "@app/lib/config/request";
import { removeTrailingSlash } from "@app/lib/fn";
import { OrgServiceActor } from "@app/lib/types";
import { TAppConnectionDALFactory } from "@app/services/app-connection/app-connection-dal";
import { AppConnection } from "@app/services/app-connection/app-connection-enums";
import { getDatabricksConnectionAccessToken } from "@app/services/app-connection/databricks/databricks-connection-fns";
import {
  TDatabricksConnection,
  TDatabricksListSecretScopesResponse
} from "@app/services/app-connection/databricks/databricks-connection-types";
import { TKmsServiceFactory } from "@app/services/kms/kms-service";

type TGetAppConnectionFunc = (
  app: AppConnection,
  connectionId: string,
  actor: OrgServiceActor
) => Promise<TDatabricksConnection>;

const listDatabricksSecretScopes = async (
  appConnection: TDatabricksConnection,
  appConnectionDAL: Pick<TAppConnectionDALFactory, "updateById">,
  kmsService: Pick<TKmsServiceFactory, "createCipherPairWithDataKey">
) => {
  const {
    credentials: { workspaceUrl }
  } = appConnection;

  const accessToken = await getDatabricksConnectionAccessToken(appConnection, appConnectionDAL, kmsService);

  const { data } = await request.get<TDatabricksListSecretScopesResponse>(
    `${removeTrailingSlash(workspaceUrl)}/api/2.0/secrets/scopes/list`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Encoding": "application/json"
      }
    }
  );

  // not present in response if no scopes exists
  return data.scopes ?? [];
};

export const databricksConnectionService = (
  getAppConnection: TGetAppConnectionFunc,
  appConnectionDAL: Pick<TAppConnectionDALFactory, "updateById">,
  kmsService: Pick<TKmsServiceFactory, "createCipherPairWithDataKey">
) => {
  const listSecretScopes = async (connectionId: string, actor: OrgServiceActor) => {
    const appConnection = await getAppConnection(AppConnection.Databricks, connectionId, actor);

    const secretScopes = await listDatabricksSecretScopes(appConnection, appConnectionDAL, kmsService);

    return secretScopes;
  };

  return {
    listSecretScopes
  };
};
