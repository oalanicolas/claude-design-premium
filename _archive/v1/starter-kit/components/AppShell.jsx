import React from 'react';

export function AppShell({
  brand = 'Product',
  navItems = [],
  active,
  topbar,
  children,
  className = '',
}) {
  return (
    <div className={`cds-app-shell ${className}`.trim()}>
      <aside className="cds-app-shell__side">
        <div className="cds-app-shell__brand">{brand}</div>
        <nav aria-label="App navigation">
          {navItems.map((item) => (
            <a
              key={item.href || item.label}
              href={item.href}
              data-active={active === item.label ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="cds-app-shell__main">
        {topbar && <div className="cds-app-shell__topbar">{topbar}</div>}
        <div className="cds-app-shell__content">{children}</div>
      </main>
    </div>
  );
}

export const appShellStyles = `
.cds-app-shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; background: var(--cds-bg); color: var(--cds-text); }
.cds-app-shell__side { border-right: 1px solid var(--cds-border); background: var(--cds-surface); padding: var(--cds-space-6); }
.cds-app-shell__brand { font-weight: 800; margin-bottom: var(--cds-space-8); }
.cds-app-shell__side nav { display: grid; gap: var(--cds-space-1); }
.cds-app-shell__side a { display: flex; align-items: center; min-height: 40px; padding: 0 var(--cds-space-3); border-radius: var(--cds-radius-sm); color: var(--cds-text-muted); text-decoration: none; }
.cds-app-shell__side a[data-active="true"], .cds-app-shell__side a:hover { background: rgba(255, 255, 255, 0.06); color: var(--cds-text); }
.cds-app-shell__main { min-width: 0; }
.cds-app-shell__topbar { min-height: 68px; border-bottom: 1px solid var(--cds-border); display: flex; align-items: center; padding: 0 var(--cds-space-8); }
.cds-app-shell__content { padding: var(--cds-space-8); }
@media (max-width: 860px) {
  .cds-app-shell { grid-template-columns: 1fr; }
  .cds-app-shell__side { position: static; border-right: 0; border-bottom: 1px solid var(--cds-border); }
  .cds-app-shell__side nav { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
  .cds-app-shell__content { padding: var(--cds-space-5); }
}
`;
