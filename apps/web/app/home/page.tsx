import { PageBody, PageHeader } from '@kit/ui/page';

import { DashboardDemo } from '~/home/_components/dashboard-demo';

export default function HomePage() {
  return (
    <>
      <PageHeader description={'Analytics, branding, and control over every link.'} />

      <PageBody>
        <DashboardDemo />
      </PageBody>
    </>
  );
}
