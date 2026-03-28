'use client';

import {
  Body1,
  Body1Strong,
  Card,
  CardHeader,
  Caption1,
  Spinner,
  Title3,
} from '@fluentui/react-components';
import { useGraphData } from '@/quickstart/hooks/useGraphData';
import { msGraphEndpoints } from '@/quickstart/providers/msgraph/msGraphEndpoints';

type OrganizationResponse = {
  value: Array<{
    id: string;
    displayName?: string;
    tenantType?: string;
    city?: string;
    country?: string;
    createdDateTime?: string;
    verifiedDomains?: Array<{ name: string }>;
  }>;
};

export default function OrganizationPage() {
  const { data, error, isLoading } = useGraphData<OrganizationResponse>(
    msGraphEndpoints.organization,
  );

  const awaitingData = !error && !data;

  if (isLoading || awaitingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spinner label='Loading organization...' />
      </div>
    );
  }

  if (error) {
    return (
      <Card appearance='outline'>
        <CardHeader
          header={<Title3>Unable to load organization</Title3>}
          description='Confirm the signed-in account has the Organization.Read.All permission.'
        />
        <Body1>{error instanceof Error ? error.message : String(error)}</Body1>
      </Card>
    );
  }

  if (!data || !data.value || data.value.length === 0) {
    return (
      <Card appearance='outline'>
        <CardHeader
          header={<Title3>No organization metadata returned</Title3>}
          description='Try signing in with a tenant administrator.'
        />
      </Card>
    );
  }

  const organization = data.value[0];

  return (
    <Card>
      <CardHeader
        header={<Title3>{organization.displayName}</Title3>}
        description={`Tenant ID: ${organization.id}`}
      />
      <Body1Strong>Tenant type</Body1Strong>
      <Body1>{organization.tenantType ?? 'Unknown'}</Body1>

      <Body1Strong style={{ marginTop: '12px' }}>Location</Body1Strong>
      <Body1>
        {[organization.city, organization.country].filter(Boolean).join(', ') ||
          'Not set'}
      </Body1>

      <Body1Strong style={{ marginTop: '12px' }}>Primary domain</Body1Strong>
      <Body1>
        {organization.verifiedDomains && organization.verifiedDomains.length > 0
          ? organization.verifiedDomains[0].name
          : 'Not available'}
      </Body1>

      <Caption1 style={{ display: 'block', marginTop: '16px' }}>
        Source: Microsoft Graph /organization
      </Caption1>
    </Card>
  );
}
