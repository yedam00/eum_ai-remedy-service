"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { Button } from "@/commons/components/button";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Modal variant API (2105:5538)
 * ======================================== */

/** Figma Variant=`info` | `danger` */
export type ModalVariant = "info" | "danger";

/** Figma Actions=`dual` (2 buttons) */
export type ModalActions = "dual";

export type ModalProps = {
  /**
   * Figma Modal `variant`
   * - info: 기본 정보 모달
   * - danger: 경고/삭제 확인 모달
   * @default "info"
   */
  variant?: ModalVariant;
  /**
   * Actions type: dual (2 buttons)
   * @default "dual"
   */
  actions?: ModalActions;
  /**
   * Modal title (Figma Label)
   * @default "제목"
   */
  title?: string;
  /** Modal content body text */
  content?: ReactNode;
  /**
   * Primary button label (오른쪽 버튼)
   * @default "계속 작성"
   */
  primaryLabel?: string;
  /**
   * Secondary button label (왼쪽 버튼)
   * @default "나가기"
   */
  secondaryLabel?: string;
  /** Primary button click handler */
  onPrimary?: () => void;
  /** Secondary button click handler */
  onSecondary?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "title">;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Component — Figma Modal · 2105:5538
 * ======================================== */

export function Modal({
  variant = "info",
  actions = "dual",
  title = "제목",
  content,
  primaryLabel = "계속 작성",
  secondaryLabel = "나가기",
  onPrimary,
  onSecondary,
  className,
  ...rest
}: ModalProps) {
  return (
    <div
      className={cx(styles.modal, className)}
      data-variant={variant}
      {...rest}
    >
      <div className={styles.title}>{title}</div>

      {content && <div className={styles.content}>{content}</div>}

      {actions === "dual" && (
        <div className={styles.actions}>
          <Button
            variant="outlined"
            size="md"
            onClick={onSecondary}
            className={styles.buttonSecondary}
          >
            {secondaryLabel}
          </Button>
          <Button
            variant="default"
            size="md"
            onClick={onPrimary}
            className={styles.buttonPrimary}
          >
            {primaryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Modal;
