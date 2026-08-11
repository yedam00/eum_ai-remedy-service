import {
  type ButtonHTMLAttributes,
} from "react";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma checkbox variant API (3:3258)
 * ======================================== */

/** Figma State=`default` | `selected` */
export type CheckboxState = "default" | "selected";

export type CheckboxProps = {
  state?: CheckboxState;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/**
 * Figma Subtract boolean — checkmark cut out of brand fill.
 * Path sized for 24×24 viewBox to match Rectangle 38.
 */
function CheckMark() {
  return (
    <svg
      className={styles.checkSvg}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        className={styles.checkPath}
        d="M6.5 12.5L10.5 16.5L17.5 8.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ========================================
 * Component
 * ======================================== */

export function Checkbox({
  state = "default",
  className,
  type = "button",
  disabled,
  ...rest
}: CheckboxProps) {
  const isSelected = state === "selected";

  return (
    <button
      type={type}
      role="checkbox"
      aria-checked={isSelected}
      disabled={disabled}
      className={cx(
        styles.checkbox,
        isSelected ? styles.stateSelected : styles.stateDefault,
        className
      )}
      {...rest}
    >
      {isSelected ? <CheckMark /> : null}
    </button>
  );
}

export default Checkbox;
