import {
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma VoiceIndicator variant API (3:3398)
 * ======================================== */

/** Figma State=`default` | `listening` | `success` */
export type VoiceIndicatorState = "default" | "listening" | "success";

export type VoiceIndicatorProps = {
  state?: VoiceIndicatorState;
  /**
   * 소리 크기 (0 ~ 100).
   * 막대 3개의 개별 높이·애니메이션 속도·증폭 폭을 CSS 변수로 제어한다.
   * `0`이면 피그마 default와 동일한 정지된 짧은 막대 상태를 유지한다.
   */
  audioLevel?: number;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** 막대 기본 높이(px) — Figma default short bar */
const BAR_MIN = 8;
/** 막대 최대 높이(px) — Figma listening full bar */
const BAR_MAX = 24;

/**
 * audioLevel(0~100) → 세 막대의 개별 높이(px).
 * 서로 다른 비율로 반응해 equalizer 느낌을 만든다.
 */
const heightsFromLevel = (level: number): [number, number, number] => {
  if (level <= 0) return [BAR_MIN, BAR_MIN, BAR_MIN];
  const t = level / 100;
  const span = BAR_MAX - BAR_MIN;
  return [
    BAR_MIN + span * t * 0.72,
    BAR_MIN + span * t * 1,
    BAR_MIN + span * t * 0.86,
  ];
};

/**
 * audioLevel ↑ → duration ↓ (더 빠른 진동)
 * 1.2s (조용) ~ 0.35s (최대)
 */
const durationFromLevel = (level: number): number => {
  if (level <= 0) return 1.2;
  return 1.2 - (level / 100) * 0.85;
};

/**
 * audioLevel ↑ → scale 증폭 ↑
 * 1 (조용) ~ 1.35 (최대)
 */
const scaleFromLevel = (level: number): number => {
  if (level <= 0) return 1;
  return 1 + (level / 100) * 0.35;
};

/* ========================================
 * Sub-parts
 * ======================================== */

function Bars() {
  return (
    <div className={styles.bars} aria-hidden>
      <span className={cx(styles.bar, styles.bar1)} />
      <span className={cx(styles.bar, styles.bar2)} />
      <span className={cx(styles.bar, styles.bar3)} />
    </div>
  );
}

/** Figma Interface / Check_Big — two-tone stroke (nodes 3:3416) */
function CheckIcon() {
  return (
    <span className={styles.check} aria-hidden>
      <svg
        className={styles.checkSvg}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={styles.checkShort}
          d="M7.5 20.5L15.5 28"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={styles.checkLong}
          d="M15.5 28L32.5 12"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* ========================================
 * Component
 * ======================================== */

export function VoiceIndicator({
  state = "default",
  audioLevel = 0,
  className,
  style,
  ...rest
}: VoiceIndicatorProps) {
  const level = clamp(audioLevel, 0, 100);
  const isSuccess = state === "success";
  const isListening = state === "listening";
  const isAnimating = isListening && level > 0;
  const [h1, h2, h3] = heightsFromLevel(
    isSuccess ? 0 : isListening ? level : 0
  );

  const cssVars: CSSProperties = {
    ["--bar-height-1" as string]: `${h1}px`,
    ["--bar-height-2" as string]: `${h2}px`,
    ["--bar-height-3" as string]: `${h3}px`,
    ["--anim-duration" as string]: `${durationFromLevel(level)}s`,
    ["--anim-scale" as string]: String(scaleFromLevel(level)),
  };

  return (
    <div
      role="status"
      aria-label={
        isSuccess
          ? "음성 인식 성공"
          : isListening
            ? "듣는 중"
            : "음성 대기"
      }
      className={cx(
        styles.root,
        isAnimating ? styles.animating : styles.idle,
        className
      )}
      style={{ ...cssVars, ...style }}
      {...rest}
    >
      {isSuccess ? <CheckIcon /> : <Bars />}
    </div>
  );
}

export default VoiceIndicator;
