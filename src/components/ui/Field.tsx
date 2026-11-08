import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  asGroup?: boolean;
  children: React.ReactNode | ((props: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }) => React.ReactNode);
}

export function Field({
  id: customId,
  label,
  required,
  hint,
  error,
  className,
  asGroup = false,
  children,
}: FieldProps) {
  const generatedId = React.useId();
  const id = customId || generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const isInvalid = !!error;

  const childProps = {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": isInvalid,
  };

  return (
    <div
      role={asGroup ? "group" : undefined}
      aria-labelledby={asGroup && label ? `${id}-label` : undefined}
      className={cn("flex flex-col gap-1.5 w-full text-left", className)}
    >
      {label &&
        (asGroup ? (
          <span
            id={`${id}-label`}
            className="text-sm font-medium text-foreground flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
            </span>
          </span>
        ) : (
          <label
            htmlFor={id}
            className="text-sm font-medium text-foreground flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        ))}

      {typeof children === "function"
        ? children(childProps)
        : React.isValidElement(children)
        ? asGroup
          ? children
          : React.cloneElement(children as React.ReactElement<Record<string, unknown>>, childProps)
        : children}

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted text-pretty">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-danger text-pretty flex items-center gap-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}
