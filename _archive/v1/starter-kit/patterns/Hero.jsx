import React from 'react';
import { Button } from '../components/Button.jsx';

export function Hero({
  eyebrow,
  title,
  description,
  primaryAction = 'Start',
  secondaryAction,
  media,
}) {
  return (
    <section className="cds-hero">
      <div className="cds-hero__copy">
        {eyebrow && <p className="cds-label">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="cds-hero__actions">
          <Button>{primaryAction}</Button>
          {secondaryAction && <Button variant="link">{secondaryAction}</Button>}
        </div>
      </div>
      {media && <div className="cds-hero__media">{media}</div>}
    </section>
  );
}

export const heroStyles = `
.cds-hero { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr); gap: var(--cds-space-12); align-items: center; min-height: 680px; padding: var(--cds-space-16) 0; }
.cds-hero h1 { margin: var(--cds-space-4) 0 0; font: 500 88px/0.95 var(--cds-font-display); letter-spacing: 0; }
.cds-hero p { max-width: 62ch; color: var(--cds-text-muted); font-size: 18px; line-height: 1.65; }
.cds-hero__actions { display: flex; flex-wrap: wrap; gap: var(--cds-space-4); margin-top: var(--cds-space-8); }
.cds-hero__media { min-height: 420px; border: 1px solid var(--cds-border); border-radius: var(--cds-radius-lg); background: var(--cds-surface); box-shadow: var(--cds-shadow-panel); overflow: hidden; }
@media (max-width: 900px) {
  .cds-hero { grid-template-columns: 1fr; min-height: auto; padding: var(--cds-space-12) 0; }
  .cds-hero h1 { font-size: 52px; }
  .cds-hero__media { min-height: 280px; }
}
`;
