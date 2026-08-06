import {
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import Image from "next/image";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma image-card variant API (3:3245)
 * ======================================== */

/** Figma State=`Default` | `active` */
export type ImageCardState = "default" | "active";

/** public/images/level1.png ~ level5.png */
export type ImageCardLevel = 1 | 2 | 3 | 4 | 5;

export type ImageCardProps = {
  state?: ImageCardState;
  /**
   * 레벨 이미지 (`/images/level{n}.png`).
   * `imageSrc`가 있으면 `imageSrc`를 우선 사용.
   */
  level?: ImageCardLevel;
  /** 카드 상단 이미지 경로. 동적 데이터로 직접 전달 가능 */
  imageSrc?: string;
  /** 이미지 대체 텍스트 */
  alt?: string;
  /** 카드 하단 라벨 */
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/* ========================================
 * Constants
 * ======================================== */

const LEVEL_IMAGE_SRC: Record<ImageCardLevel, string> = {
  1: "/images/level1.png",
  2: "/images/level2.png",
  3: "/images/level3.png",
  4: "/images/level4.png",
  5: "/images/level5.png",
};

const DEFAULT_LABEL = "조금 아프다";

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const STATE_CLASS: Record<ImageCardState, string> = {
  default: styles.stateDefault,
  active: styles.stateActive,
};

/* ========================================
 * Component — Figma image-card · 3:3245
 * ======================================== */

export function ImageCard({
  state = "default",
  level = 1,
  imageSrc,
  alt = "",
  label,
  children,
  className,
  type = "button",
  disabled,
  ...rest
}: ImageCardProps) {
  const src = imageSrc ?? LEVEL_IMAGE_SRC[level];
  const content = children ?? label ?? DEFAULT_LABEL;
  const isActive = state === "active";

  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={isActive}
      className={cx(styles.card, STATE_CLASS[state], className)}
      {...rest}
    >
      <span className={styles.content}>
        <span className={styles.imageWrap}>
          <Image
            className={styles.image}
            src={src}
            alt={alt}
            width={82}
            height={82}
          />
        </span>
        <span className={styles.label}>{content}</span>
      </span>
    </button>
  );
}

export default ImageCard;
