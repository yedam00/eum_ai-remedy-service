import {
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Buttons variant API (3:2929)
 * ======================================== */

/** Figma Variant=`Default` | `Outlined` */
export type ButtonVariant = "default" | "outlined";

/** Figma State=`Default` | `Inactive` */
export type ButtonState = "default" | "inactive";

/**
 * Figma Button Size=`sm` | `md` | `lg`
 * 크기별 패딩/높이와 타이포그래피 세트가 함께 적용됨
 * - sm → body02.md (16 / 500 / 26), pad 12, min-height 50
 * - md → body01.md (18 / 500 / 26), pad 16, min-height 58
 * - lg → body01.lg (18 / 600 / 26), pad 20, min-height 66
 */
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant;
  state?: ButtonState;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** 버튼 라벨. `children`이 있으면 children 우선 */
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/* ========================================
 * Class maps
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: styles.variantDefault,
  outlined: styles.variantOutlined,
};

/* ========================================
 * Component
 * ======================================== */

export function Button({
  variant = "default",
  state = "default",
  size = "md",
  leftIcon,
  rightIcon,
  label,
  children,
  className,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const isInactive = state === "inactive" || Boolean(disabled);
  const content = children ?? label;

  return (
    <button
      type={type}
      disabled={isInactive || disabled}
      className={cx(
        styles.button,
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        isInactive && styles.stateInactive,
        className
      )}
      {...rest}
    >
      {leftIcon ? (
        <span className={styles.iconSlot} aria-hidden>
          {leftIcon}
        </span>
      ) : null}
      {content != null && content !== "" ? (
        <span className={styles.label}>{content}</span>
      ) : null}
      {rightIcon ? (
        <span className={styles.iconSlot} aria-hidden>
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
}

export default Button;
