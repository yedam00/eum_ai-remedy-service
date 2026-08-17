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
  /**
   * hasImage가 true일 때 노출할 단일 이미지 경로.
   * `imageUrls`가 있으면 `imageUrls`를 우선 사용.
   */
  imageUrl?: string;
  /** hasImage가 true일 때 노출할 이미지 URL 배열 (슬롯별 독립 바인딩) */
  imageUrls?: string[];
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

const resolveUserImageUrls = (
  imageUrls?: string[],
  imageUrl?: string
): string[] => {
  const fromList = (imageUrls?.filter((url): url is string => Boolean(url)) ?? []).slice(
    0,
    USER_IMAGE_SLOT_COUNT
  );
  if (fromList.length > 0) return fromList;
  return imageUrl ? [imageUrl] : [];
};

const isBlobOrDataUrl = (src: string) =>
  src.startsWith("blob:") || src.startsWith("data:");

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
              unoptimized={isBlobOrDataUrl(imageUrl)}
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

function UserImageGrid({
  imageUrls,
  imageUrl,
}: {
  imageUrls?: string[];
  imageUrl?: string;
}) {
  const urls = resolveUserImageUrls(imageUrls, imageUrl);

  return (
    <div
      className={cx(
        styles.userImageGrid,
        urls.length <= 3 && styles.userImageGridEnd
      )}
      data-testid="user-image-grid"
      data-image-count={String(urls.length)}
    >
      {urls.map((url, index) => (
        <div
          key={index}
          className={styles.userImageSlot}
          data-testid="user-image-slot"
          data-filled="true"
        >
          <Image
            className={styles.userImage}
            src={url}
            alt=""
            width={96}
            height={96}
            unoptimized={isBlobOrDataUrl(url)}
          />
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
  imageUrls,
  className,
  ...rest
}: SpeechBubbleProps) {
  const isAi = variant === "ai";
  const filledCount =
    imageUrls?.filter(Boolean).length || (imageUrl ? 1 : 0);

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
      data-image-count={hasImage ? String(filledCount) : "0"}
      {...rest}
    >
      {isAi ? (
        <AiBubble label={label} hasImage={hasImage} imageUrl={imageUrl} />
      ) : hasImage ? (
        <UserImageGrid imageUrls={imageUrls} imageUrl={imageUrl} />
      ) : (
        <div className={styles.userBubbleWrap}>
          <UserBubbleRow userLabel={userLabel} />
        </div>
      )}
    </div>
  );
}

export default SpeechBubble;
