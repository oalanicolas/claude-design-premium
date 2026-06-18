import React from 'react';

export function SectionHeader({
  eyebrow,
  title,
  action,
  className = '',
}) {
  return (
    <div className={`cds-section-header ${className}`.trim()}>
      <div>
        {eyebrow && <p className="cds-label">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      <div className="cds-section-header__rule" />
      {action && <div className="cds-section-header__action">{action}</div>}
    </div>
  );
}

export const sectionHeaderStyles = `
.cds-section-header { display: grid; grid-template-columns: auto 1fr auto; align-items: end; gap: var(--cds-space-4); margin-bottom: var(--cds-space-6); }
.cds-section-header h2 { margin: var(--cds-space-2) 0 0; font: 500 44px/1.02 var(--cds-font-display); letter-spacing: 0; }
.cds-section-header__rule { height: 1px; background: linear-gradient(to right, var(--cds-border), transparent); transform: translateY(-10px); }
.cds-section-header__action { transform: translateY(-4px); }
@media (max-width: 720px) {
  .cds-section-header { grid-template-columns: 1fr; align-items: start; }
  .cds-section-header h2 { font-size: 32px; }
  .cds-section-header__rule { transform: none; }
  .cds-section-header__action { transform: none; }
}
`;
