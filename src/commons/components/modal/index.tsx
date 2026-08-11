"use client";

import { type ReactNode } from "react";
import { Button } from "@/commons/components/button";
import styles from "./styles.module.css";

/* ========================================
 * Modal UI Component
 * Figma: 2105:5538 (variant: info/danger, actions: dual)
 * ======================================== */

/** Modal variant: info | danger */
export type ModalVariant = "info" | "danger";

/** Modal actions: dual (2 buttons) */
export type ModalActions = "dual";

export type ModalProps = {
  /**
   * Modal variant
   * - info: 기본 정보 모달
   * - danger: 경고/삭제 확인 모달
   */
  variant?: ModalVariant;
  
  /**
   * Actions type: dual (2 buttons)
   */
  actions?: ModalActions;
  
  /**
   * Modal title
   */
  title?: string;
  
  /**
   * Modal content (body)
   */
  content?: ReactNode;
  
  /**
   * Primary button label (오른쪽)
   */
  primaryLabel?: string;
  
  /**
   * Secondary button label (왼쪽)
   */
  secondaryLabel?: string;
  
  /**
   * Primary button click handler
   */
  onPrimary?: () => void;
  
  /**
   * Secondary button click handler
   */
  onSecondary?: () => void;
};

/* ========================================
 * Component
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
}: ModalProps) {
  return (
    <div className={styles.modal} data-variant={variant}>
      {/* Title */}
      <div className={styles.title}>
        {title}
      </div>
      
      {/* Content */}
      {content && (
        <div className={styles.content}>
          {content}
        </div>
      )}
      
      {/* Actions - Dual */}
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
