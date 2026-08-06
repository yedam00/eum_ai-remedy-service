"use client";

import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useState,
} from "react";
import { Search } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma SearchBar variant API (3:3561)
 * ======================================== */

/** Figma State=`Default` | `Active` */
export type SearchBarState = "default" | "active";

export type SearchBarProps = {
  state?: SearchBarState;
  /** 기본값: "아픈 곳을 입력하세요" */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "placeholder" | "onChange"
>;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const STATE_CLASS: Record<SearchBarState, string> = {
  default: styles.stateDefault,
  active: styles.stateActive,
};

const DEFAULT_PLACEHOLDER = "아픈 곳을 입력하세요";

function resolveState(
  controlled: SearchBarState | undefined,
  hasValue: boolean
): SearchBarState {
  if (controlled !== undefined) return controlled;
  return hasValue ? "active" : "default";
}

/* ========================================
 * Component
 * ======================================== */

export function SearchBar({
  state: controlledState,
  placeholder = DEFAULT_PLACEHOLDER,
  value: controlledValue,
  defaultValue = "",
  onChange,
  className,
  disabled,
  ...rest
}: SearchBarProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const value = isControlled ? controlledValue : uncontrolledValue;
  const hasValue = value.trim().length > 0;
  const visualState = resolveState(controlledState, hasValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div
      className={cx(
        styles.root,
        STATE_CLASS[visualState],
        disabled && styles.disabled,
        className
      )}
    >
      <span className={styles.iconSlot} aria-hidden>
        <Search size={24} color="currentColor" />
      </span>

      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
    </div>
  );
}

export default SearchBar;
