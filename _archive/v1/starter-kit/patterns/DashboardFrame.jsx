import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card.jsx';
import { SectionHeader } from '../components/SectionHeader.jsx';

export function DashboardFrame({
  eyebrow = 'Overview',
  title = 'Dashboard',
  kpis = [],
  children,
}) {
  return (
    <section className="cds-dashboard-frame">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="cds-dashboard-frame__kpis">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <p className="cds-label">{kpi.label}</p>
              <CardTitle>{kpi.value}</CardTitle>
            </CardHeader>
            {kpi.detail && <CardContent>{kpi.detail}</CardContent>}
          </Card>
        ))}
      </div>
      <div className="cds-dashboard-frame__body">{children}</div>
    </section>
  );
}

export const dashboardFrameStyles = `
.cds-dashboard-frame { display: grid; gap: var(--cds-space-8); }
.cds-dashboard-frame__kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--cds-space-4); }
.cds-dashboard-frame__body { display: grid; gap: var(--cds-space-4); }
@media (max-width: 1100px) { .cds-dashboard-frame__kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .cds-dashboard-frame__kpis { grid-template-columns: 1fr; } }
`;
