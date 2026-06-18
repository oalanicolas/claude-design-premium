import React from 'react';
import { Button } from './Button.jsx';

export function MarketingNav({
  brand = 'Brand',
  links = [],
  cta = 'Get started',
  className = '',
}) {
  return (
    <header className={`cds-marketing-nav ${className}`.trim()}>
      <a className="cds-marketing-nav__brand" href="#top">{brand}</a>
      <nav aria-label="Primary navigation">
        {links.map((link) => (
          <a key={link.href || link.label} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <Button size="sm">{cta}</Button>
    </header>
  );
}

export const marketingNavStyles = `
.cds-marketing-nav { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--cds-space-6); min-height: 72px; }
.cds-marketing-nav__brand { color: var(--cds-text); font-weight: 800; text-decoration: none; letter-spacing: 0; }
.cds-marketing-nav nav { display: flex; justify-content: center; gap: var(--cds-space-5); }
.cds-marketing-nav nav a { color: var(--cds-text-muted); text-decoration: none; font-size: 14px; }
.cds-marketing-nav nav a:hover { color: var(--cds-text); }
@media (max-width: 760px) {
  .cds-marketing-nav { grid-template-columns: 1fr auto; }
  .cds-marketing-nav nav { display: none; }
}
`;
