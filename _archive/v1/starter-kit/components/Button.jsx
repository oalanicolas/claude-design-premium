import React from 'react';

const variants = {
  primary: 'cds-btn cds-btn--primary',
  secondary: 'cds-btn cds-btn--secondary',
  ghost: 'cds-btn cds-btn--ghost',
  link: 'cds-btn cds-btn--link',
  danger: 'cds-btn cds-btn--danger',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`${variants[variant] || variants.primary} cds-btn--${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export const buttonStyles = `
.cds-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--cds-space-2);
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: var(--cds-radius-sm);
  padding: 0 var(--cds-space-5);
  font: 700 12px/1 var(--cds-font-sans);
  letter-spacing: 0;
  text-transform: uppercase;
  cursor: pointer;
  transition: background var(--cds-transition), border-color var(--cds-transition), color var(--cds-transition);
}
.cds-btn:focus-visible { outline: 2px solid var(--cds-primary); outline-offset: 3px; }
.cds-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.cds-btn--primary { background: var(--cds-primary); color: var(--cds-primary-contrast); }
.cds-btn--secondary { background: var(--cds-surface-raised); border-color: var(--cds-border); color: var(--cds-text); }
.cds-btn--ghost { background: transparent; color: var(--cds-text-muted); }
.cds-btn--danger { background: transparent; border-color: color-mix(in srgb, var(--cds-danger), transparent 55%); color: var(--cds-danger); }
.cds-btn--link { min-height: auto; padding: 0; background: transparent; color: var(--cds-primary); text-transform: none; letter-spacing: 0; font-family: var(--cds-font-display); font-size: 16px; font-weight: 400; }
.cds-btn--sm { min-height: 36px; padding-inline: var(--cds-space-4); font-size: 11px; }
.cds-btn--lg { min-height: 52px; padding-inline: var(--cds-space-8); }
.cds-btn--icon { width: 44px; padding-inline: 0; }
`;
