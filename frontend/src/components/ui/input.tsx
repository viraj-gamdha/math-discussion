import classNames from "classnames";
import s from "./input.module.scss";
import { Eye, EyeOff, Search, X } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";

// Base props for underlying input related components
export interface BaseComponentProps {
  label?: string;
  style?: CSSProperties;
  className?: string;
}

// Input Component
export type InputTypes =
  | "text"
  | "password"
  | "search"
  | "email"
  | "date"
  | "number"
  | "checkbox";
export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "form"
> &
  BaseComponentProps & {
    type?: InputTypes;
    onClear?: () => void;
    valueWatch?: string | number;
  };

export const Input = ({
  type = "text",
  label,
  style,
  value,
  valueWatch,
  onClear,
  onChange,
  className,
  ...props
}: InputProps) => {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPassword = type === "password";
  const isSearch = type === "search";
  const inputType = isPassword && visible ? "text" : type;

  const hasValue = valueWatch != null && String(valueWatch).length > 0;
  const showToggle = isPassword && hasValue;
  const showClear = isSearch && hasValue;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      // Create a synthetic event for react-hook-form to register the change
      const event = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    inputRef.current?.focus();
  };

  return (
    <div className={classNames(s.container, className)} style={style}>
      {label && (
        <label className={s.label} htmlFor={props.name}>
          {label}
        </label>
      )}
      <div className={s.wrapper}>
        {isSearch && <Search className={s.search_icon} size={16} />}
        <input
          id={props.name}
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={onChange}
          style={
            isPassword
              ? { paddingRight: "3rem" }
              : isSearch
              ? { paddingLeft: "2.25rem" }
              : {}
          }
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            className={s.password_eye}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {showClear && (
          <button type="button" className={s.clear_icon} onClick={handleClear}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// Select Component
export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "form"
> &
  BaseComponentProps & {
    placeholder?: string;
    options: { value: string; label: string }[];
  };

export const Select = ({
  label,
  options,
  style,
  placeholder,
  className,
  ...props
}: SelectProps) => {
  return (
    <div className={classNames(s.container, className)} style={style}>
      {label && (
        <label className={s.label} htmlFor={props.name}>
          {label}
        </label>
      )}
      <div className={s.wrapper}>
        <select id={props.name} {...props}>
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};