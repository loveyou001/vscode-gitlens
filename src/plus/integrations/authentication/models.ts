import type { AuthenticationSession } from 'vscode';
import { configuration } from '../../../system/configuration';
import type { IntegrationId } from '../providers/models';
import { HostingIntegrationId, IssueIntegrationId, SelfHostedIntegrationId } from '../providers/models';

export interface ProviderAuthenticationSession extends AuthenticationSession {
	readonly expiresAt?: Date;
}

export interface CloudIntegrationAuthenticationSession {
	type: CloudIntegrationAuthType;
	accessToken: string;
	domain: string;
	expiresIn: number;
	scopes: string;
}

export interface CloudIntegrationAuthorization {
	url: string;
}

export interface CloudIntegrationConnection {
	type: CloudIntegrationAuthType;
	provider: CloudIntegrationType;
	domain: string;
}

export type CloudIntegrationType = 'jira' | 'trello' | 'gitlab' | 'github' | 'bitbucket' | 'azure';

export type CloudIntegrationAuthType = 'oauth' | 'pat';

export const CloudIntegrationAuthenticationUriPathPrefix = 'did-authenticate-cloud-integration';

const supportedCloudIntegrationIds = [IssueIntegrationId.Jira];
const supportedCloudIntegrationIdsExperimental = [IssueIntegrationId.Jira, HostingIntegrationId.GitHub];

export type SupportedCloudIntegrationIds = (typeof supportedCloudIntegrationIdsExperimental)[number];

export function isSupportedCloudIntegrationId(id: string): id is SupportedCloudIntegrationIds {
	const ids = configuration.get('experimental.cloudIntegrations.github.enabled', undefined, false)
		? supportedCloudIntegrationIdsExperimental
		: supportedCloudIntegrationIds;
	return ids.includes(id as SupportedCloudIntegrationIds);
}

export function* iterateSupportedCloudIntegrationIds() {
	const ids = configuration.get('experimental.cloudIntegrations.github.enabled', undefined, false)
		? supportedCloudIntegrationIdsExperimental
		: supportedCloudIntegrationIds;
	for (const id of ids) {
		yield id;
	}
}

export const toIntegrationId: { [key in CloudIntegrationType]: IntegrationId } = {
	jira: IssueIntegrationId.Jira,
	trello: IssueIntegrationId.Trello,
	gitlab: HostingIntegrationId.GitLab,
	github: HostingIntegrationId.GitHub,
	bitbucket: HostingIntegrationId.Bitbucket,
	azure: HostingIntegrationId.AzureDevOps,
};

export const toCloudIntegrationType: { [key in IntegrationId]: CloudIntegrationType | undefined } = {
	[IssueIntegrationId.Jira]: 'jira',
	[IssueIntegrationId.Trello]: 'trello',
	[HostingIntegrationId.GitLab]: 'gitlab',
	[HostingIntegrationId.GitHub]: 'github',
	[HostingIntegrationId.Bitbucket]: 'bitbucket',
	[HostingIntegrationId.AzureDevOps]: 'azure',
	[SelfHostedIntegrationId.GitHubEnterprise]: undefined,
	[SelfHostedIntegrationId.GitLabSelfHosted]: undefined,
};
