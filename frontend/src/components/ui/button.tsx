import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";
import s from "./button.module.scss";
import { Link, type LinkProps } from "react-router-dom";

type ButtonVariants = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  children?: ReactNode;
  as?: "button" | "span";
}

export const Button: FC<ButtonProps> = ({
  variant,
  className,
  children = "Button",
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        s.base,
        variant && s[variant],
        className,
        disabled && s.disabled
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// LinkButton component
interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariants;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isActive?: boolean;
}

export const LinkButton = ({
  variant,
  children = "Link",
  className,
  to = "/",
  replace,
  disabled,
  style,
  isActive,
  ...rest
}: LinkButtonProps) => {
  const classes = classNames(
    s.base,
    variant && s[variant],
    isActive && s.active,
    className,
    disabled && s.disabled
  );

  return (
    <Link
      to={to}
      style={style}
      replace={replace}
      aria-disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </Link>
  );
};
