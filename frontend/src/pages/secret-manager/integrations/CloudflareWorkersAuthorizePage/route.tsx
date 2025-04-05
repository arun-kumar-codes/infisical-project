import { createFileRoute, linkOptions } from "@tanstack/react-router";

import { IntegrationsListPageTabs } from "@app/types/integrations";

import { CloudflareWorkersAuthorizePage } from "./CloudflareWorkersAuthorizePage";

export const Route = createFileRoute(
  "/_authenticate/_inject-org-details/_org-layout/secret-manager/$projectId/_secret-manager-layout/integrations/cloudflare-workers/authorize"
)({
  component: CloudflareWorkersAuthorizePage,
  beforeLoad: ({ context, params }) => {
    return {
      breadcrumbs: [
        ...context.breadcrumbs,
        {
          label: "Integrations",
          link: linkOptions({
            to: "/secret-manager/$projectId/integrations",
            params,
            search: {
              selectedTab: IntegrationsListPageTabs.NativeIntegrations
            }
          })
        },
        {
          label: "Cloudflare Workers"
        }
      ]
    };
  }
});
