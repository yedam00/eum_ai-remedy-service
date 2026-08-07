import { type HTMLAttributes } from "react";
import Image from "next/image";
import { ArrowUndoUpRight } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma speech-bubble variant API (3:3287)
 * ======================================== */

/** Figma varient=`AI` | `User` */
export type SpeechBubbleVariant = "ai" | "user";

export type SpeechBubbleProps = {
  /** Figma varient — `ai` | `user` */
  variant?: SpeechBubbleVariant;
  /** Figma Has Image — true일 경우 이미지 프레임 영역 포함 */
  hasImage?: boolean;
  /** AI 질문 텍스트 (Figma Label) */
  label: string;
  /** 사용자 답변 텍스트 (Figma User-Label) */
  userLabel: string;
  /** hasImage가 true일 때 노출할 이미지 경로 */
  imageUrl?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/* ========================================
 * Constants
 * ======================================== */

const USER_IMAGE_SLOT_COUNT = 6;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Sub-parts
 * ======================================== */

function AiBubble({
  label,
  hasImage,
  imageUrl,
}: {
  label: string;
  hasImage: boolean;
  imageUrl?: string;
}) {
  return (
    <div
      className={cx(styles.aiBubble, hasImage && styles.aiBubbleWithImage)}
    >
      {hasImage ? (
        <div className={styles.aiImageWrap}>
          {imageUrl ? (
            <Image
              className={styles.aiImage}
              src={imageUrl}
              alt=""
              width={305}
              height={250}
            />
          ) : null}
        </div>
      ) : null}
      <p className={styles.aiLabel}>{label}</p>
    </div>
  );
}

function UserBubbleRow({ userLabel }: { userLabel: string }) {
  return (
    <div className={styles.userRow}>
      <span className={styles.userIconSlot} aria-hidden>
        <ArrowUndoUpRight />
      </span>
      <div className={styles.userBubble}>
        <p className={styles.userLabel}>{userLabel}</p>
      </div>
    </div>
  );
}

function UserImageGrid({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className={styles.userImageGrid}>
      {Array.from({ length: USER_IMAGE_SLOT_COUNT }, (_, index) => (
        <div key={index} className={styles.userImageSlot}>
          {imageUrl ? (
            <Image
              className={styles.userImage}
              src={imageUrl}
              alt=""
              width={96}
              height={96}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ========================================
 * Component — Figma speech-bubble · 3:3287
 * ======================================== */

export function SpeechBubble({
  variant = "ai",
  hasImage = false,
  label,
  userLabel,
  imageUrl,
  className,
  ...rest
}: SpeechBubbleProps) {
  const isAi = variant === "ai";

  return (
    <div
      className={cx(
        styles.root,
        isAi ? styles.variantAi : styles.variantUser,
        hasImage && styles.hasImage,
        className
      )}
      data-variant={variant}
      data-has-image={hasImage ? "true" : "false"}
      {...rest}
    >
      {isAi ? (
        <AiBubble label={label} hasImage={hasImage} imageUrl={imageUrl} />
      ) : (
        <>
          <div className={styles.userBubbleWrap}>
            <UserBubbleRow userLabel={userLabel} />
          </div>
          {hasImage ? <UserImageGrid imageUrl={imageUrl} /> : null}
        </>
      )}
    </div>
  );
}

export default SpeechBubble;
