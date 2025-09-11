import s from "./form-input.module.scss";
import type { CSSProperties } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import classNames from "classnames";
import {
  Input,
  Select,
  type InputProps,
  type InputTypes,
  type SelectProps,
} from "./input";

// Common props for all FormInput variants
type FormInputCommonProps<T extends FieldValues> = {
  id: Path<T>;
  form: UseFormReturn<T>;
  formInputStyle?: CSSProperties;
  formInputClassName?: string;
  showError?: boolean;
};

// Variants and its types
type FormInputVariantProps =
  | ({ variant?: "input" } & InputProps)
  | ({ variant: "select" } & SelectProps);

// Final combined props for the FormInput component
export type FormInputProps<T extends FieldValues> = FormInputCommonProps<T> &
  FormInputVariantProps;

export const FormInput = <T extends FieldValues>({
  form,
  id,
  variant = "input",
  label,
  formInputStyle,
  formInputClassName,
  showError = true,
  ...props
}: FormInputProps<T>) => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = form;
  const errorMessage = errors[id]?.message as string;

  // Specifically for input we have to add value type for rhf
  const getRegisterOptions = (
    variant: "input" | "select" | "textarea" | "custom-select" | "otp-inputs",
    type?: InputTypes
  ) => {
    if (variant !== "input") return {};

    switch (type) {
      case "number":
        return { valueAsNumber: true };
      case "date":
        return { valueAsDate: true };
      default:
        return {};
    }
  };

  const registeredProps = register(
    id,
    getRegisterOptions(variant, (props as InputProps).type)
  );

  const renderVariant = () => {
    switch (variant) {
      case "select":
        return (
          <Select
            label={label}
            {...registeredProps}
            {...(props as SelectProps)}
          />
        );
      case "input":
      default:
        return (
          <Input
            label={label}
            valueWatch={form.watch(id)} ///for internal use in input
            {...registeredProps}
            {...(props as InputProps)}
          />
        );
    }
  };

  return (
    <div
      style={formInputStyle}
      className={classNames(s.wrapper, formInputClassName)}
    >
      {renderVariant()}
      {errorMessage && showError && isSubmitted && (
        <p className={s.error}>{errorMessage}</p>
      )}
    </div>
  );
};
