import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import Image from "next/image";
import { CloseLG } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma media-upload variant API (3:3269)
 * ======================================== */

/** Figma varient=`empty` | `uploaded` */
export type MediaUploadVariant = "empty" | "uploaded";

export type MediaUploadProps = {
  /**
   * 업로드된 이미지 URL.
   * 값이 있으면 `uploaded`, 없으면 `empty`로 자동 전환.
   */
  imageUrl?: string;
  /** 업로드 이미지 대체 텍스트 */
  alt?: string;
  /** uploaded 상태의 삭제(X) 버튼 클릭 */
  onRemove?: () => void;
  /** empty 상태의 플레이스홀더 클릭 (업로드 유도) */
  onEmptyClick?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

function resolveVariant(imageUrl?: string): MediaUploadVariant {
  return imageUrl ? "uploaded" : "empty";
}

/* ========================================
 * Sub-parts
 * ======================================== */

function EmptyPlaceholder({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className={styles.placeholder}
      onClick={onClick}
      aria-label="미디어 업로드"
    >
      <span className={styles.plus} aria-hidden>
        +
      </span>
    </button>
  );
}

function UploadedMedia({
  imageUrl,
  alt,
  onRemove,
}: {
  imageUrl: string;
  alt: string;
  onRemove?: () => void;
}) {
  const handleRemove: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (
    event
  ) => {
    event.stopPropagation();
    onRemove?.();
  };

  return (
    <>
      <div className={styles.closeRow}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleRemove}
          aria-label="미디어 삭제"
        >
          <span className={styles.closeIcon} aria-hidden>
            <CloseLG size={12} color="currentColor" />
          </span>
        </button>
      </div>
      <div className={styles.media}>
        <Image
          className={styles.image}
          src={imageUrl}
          alt={alt}
          width={96}
          height={96}
        />
      </div>
    </>
  );
}

/* ========================================
 * Component — Figma media-upload · 3:3269
 * ======================================== */

export function MediaUpload({
  imageUrl,
  alt = "",
  onRemove,
  onEmptyClick,
  className,
  ...rest
}: MediaUploadProps) {
  const variant = resolveVariant(imageUrl);
  const isUploaded = variant === "uploaded";

  return (
    <div
      className={cx(
        styles.root,
        isUploaded ? styles.variantUploaded : styles.variantEmpty,
        className
      )}
      data-variant={variant}
      {...rest}
    >
      {isUploaded && imageUrl ? (
        <UploadedMedia
          imageUrl={imageUrl}
          alt={alt}
          onRemove={onRemove}
        />
      ) : (
        <EmptyPlaceholder onClick={onEmptyClick} />
      )}
    </div>
  );
}

export default MediaUpload;
