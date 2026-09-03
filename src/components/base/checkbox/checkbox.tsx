"use client";

import type { ReactNode, Ref } from "react";
import { Checkbox as AriaCheckbox, type CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import { cx } from "@/lib/utils/cx";

export interface CheckboxBaseProps {
    size?: "sm" | "md";
    className?: string;
    isFocusVisible?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
    isIndeterminate?: boolean;
}

export const CheckboxBase = ({ className, isSelected, isDisabled, isIndeterminate, size = "sm", isFocusVisible = false }: CheckboxBaseProps) => {
    return (
        <div
            className={cx(
                "relative flex size-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded bg-white dark:bg-neutral-900 ring-1 ring-neutral-300 dark:ring-neutral-700 ring-inset transition-all",
                size === "md" && "size-5 rounded-md",
                (isSelected || isIndeterminate) && "!bg-neutral-900 dark:!bg-white !ring-neutral-900 dark:!ring-white",
                isDisabled && "cursor-not-allowed opacity-50",
                isFocusVisible && "outline-2 outline-offset-2 outline-neutral-400",
                className,
            )}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 14 14"
                fill="none"
                className={cx(
                    "pointer-events-none absolute h-3 w-2.5 text-white dark:text-neutral-900 opacity-0 transition-opacity",
                    size === "md" && "size-3.5",
                    isIndeterminate && "opacity-100",
                )}
            >
                <path d="M2.91675 7H11.0834" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <svg
                aria-hidden="true"
                viewBox="0 0 14 14"
                fill="none"
                className={cx(
                    "pointer-events-none absolute size-3 text-white dark:text-neutral-900 opacity-0 transition-opacity",
                    size === "md" && "size-3.5",
                    isSelected && !isIndeterminate && "opacity-100",
                )}
            >
                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
};
CheckboxBase.displayName = "CheckboxBase";

interface CheckboxProps extends AriaCheckboxProps {
    ref?: Ref<HTMLLabelElement>;
    size?: "sm" | "md";
    label?: ReactNode;
    hint?: ReactNode;
}

export const Checkbox = ({ label, hint, size = "sm", className, ...ariaCheckboxProps }: CheckboxProps) => {
    const sizes = {
        sm: {
            root: "gap-2.5",
            textWrapper: "",
            label: "text-xs font-sans",
            hint: "text-xs",
        },
        md: {
            root: "gap-3",
            textWrapper: "gap-0.5",
            label: "text-sm font-sans",
            hint: "text-xs",
        },
    };

    return (
        <AriaCheckbox
            {...ariaCheckboxProps}
            className={(state) =>
                cx(
                    "relative flex items-center cursor-pointer select-none",
                    state.isDisabled && "cursor-not-allowed",
                    sizes[size].root,
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {({ isSelected, isIndeterminate, isDisabled, isFocusVisible }) => (
                <>
                    <CheckboxBase
                        size={size}
                        isSelected={isSelected}
                        isIndeterminate={isIndeterminate}
                        isDisabled={isDisabled}
                        isFocusVisible={isFocusVisible}
                    />
                    {(label || hint) && (
                        <div className={cx("inline-flex flex-col min-w-0 flex-1", sizes[size].textWrapper)}>
                            {label && (
                                <span className={cx(
                                    "select-none transition-colors truncate",
                                    isSelected ? "font-semibold text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-400",
                                    sizes[size].label
                                )}>
                                    {label}
                                </span>
                            )}
                            {hint && (
                                <span className={cx("text-neutral-400 text-xs", sizes[size].hint)} onClick={(event) => event.stopPropagation()}>
                                    {hint}
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
        </AriaCheckbox>
    );
};
Checkbox.displayName = "Checkbox";
