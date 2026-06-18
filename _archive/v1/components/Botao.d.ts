type BotaoVariant = 'primary' | 'secondary' | 'ghost';

interface BotaoProps {
  label?: string;
  href?: string;
  variant?: BotaoVariant;
  disabled?: boolean;
  onClick?: () => void;
}

declare function Botao(props: BotaoProps): JSX.Element;
