export function Botao(props) {
  const {
    label = 'Action',
    href,
    variant = 'primary',
    disabled = false,
    onClick,
  } = props || {};

  const className = `cdp-botao cdp-botao--${variant}`;
  const shared = {
    className,
    'aria-disabled': disabled ? 'true' : undefined,
    onClick: disabled ? undefined : onClick,
  };

  if (href && !disabled) {
    return (
      <a href={href} {...shared}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} {...shared}>
      {label}
    </button>
  );
}
