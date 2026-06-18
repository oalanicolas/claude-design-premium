import React from 'react';

export function Card({ className = '', children, ...props }) {
  return <section className={`cds-card ${className}`.trim()} {...props}>{children}</section>;
}

export function CardHeader({ className = '', children, ...props }) {
  return <div className={`cds-card__header ${className}`.trim()} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }) {
  return <h3 className={`cds-card__title ${className}`.trim()} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }) {
  return <p className={`cds-card__description ${className}`.trim()} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }) {
  return <div className={`cds-card__content ${className}`.trim()} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }) {
  return <div className={`cds-card__footer ${className}`.trim()} {...props}>{children}</div>;
}

export const cardStyles = `
.cds-card { border: 1px solid var(--cds-border); border-radius: var(--cds-radius-md); background: var(--cds-surface); color: var(--cds-text); }
.cds-card__header { display: grid; gap: var(--cds-space-2); padding: var(--cds-space-6); }
.cds-card__title { margin: 0; font: 500 22px/1.15 var(--cds-font-display); }
.cds-card__description { margin: 0; color: var(--cds-text-muted); line-height: 1.5; }
.cds-card__content { padding: 0 var(--cds-space-6) var(--cds-space-6); }
.cds-card__footer { display: flex; align-items: center; gap: var(--cds-space-3); padding: 0 var(--cds-space-6) var(--cds-space-6); }
`;
