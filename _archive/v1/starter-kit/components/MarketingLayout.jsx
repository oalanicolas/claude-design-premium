import React from 'react';
import { MarketingNav } from './MarketingNav.jsx';

export function MarketingLayout({
  brand,
  links,
  cta,
  children,
  footer,
  className = '',
}) {
  return (
    <div className={`cds-root ${className}`.trim()} id="top">
      <div className="cds-container">
        <MarketingNav brand={brand} links={links} cta={cta} />
      </div>
      <main>{children}</main>
      {footer && <footer className="cds-marketing-layout__footer cds-container">{footer}</footer>}
    </div>
  );
}

export const marketingLayoutStyles = `
.cds-marketing-layout__footer { border-top: 1px solid var(--cds-border); padding: var(--cds-space-8) 0; color: var(--cds-text-muted); }
`;
