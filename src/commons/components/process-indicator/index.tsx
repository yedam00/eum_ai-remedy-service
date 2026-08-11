import { type HTMLAttributes } from "react";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma process-indicator variant API (2003:2779)
 * ======================================== */

/** Figma value=`1` | `2` | `3` */
export type ProcessIndicatorValue = 1 | 2 | 3 | "1" | "2" | "3";

export type ProcessIndicatorProps = {
  /** 현재 활성화된 온보딩 단계 (1, 2, 3) */
  value?: ProcessIndicatorValue;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/* ========================================
 * Constants
 * ======================================== */

const TOTAL_STEPS = 3 as const;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const toStep = (value: ProcessIndicatorValue): number => {
  const n = typeof value === "string" ? Number(value) : value;
  if (n === 1 || n === 2 || n === 3) return n;
  return 1;
};

/* ========================================
 * Sub-parts
 * ======================================== */

function Dot({ active }: { active: boolean }) {
  return (
    <span
      className={cx(styles.dot, active ? styles.dotActive : styles.dotInactive)}
      aria-hidden
    />
  );
}

/* ========================================
 * Component
 * ======================================== */

export function ProcessIndicator({
  value = 1,
  className,
  ...rest
}: ProcessIndicatorProps) {
  const step = toStep(value);

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-valuenow={step}
      aria-label={`온보딩 단계 ${step} / ${TOTAL_STEPS}`}
      className={cx(styles.root, className)}
      {...rest}
    >
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <Dot key={i} active={i + 1 === step} />
      ))}
    </div>
  );
}

export default ProcessIndicator;
