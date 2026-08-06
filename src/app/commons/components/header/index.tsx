import { type HTMLAttributes } from "react";
import { Arrow } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Header (3:3439)
 * ======================================== */

export type HeaderProps = {
  /**
   * 헤더 좌측 타이틀 텍스트
   * Figma Label 속성 매핑 · 기본값: "홈"
   */
  title?: string;
  /** 뒤로가기(Arrow) 클릭 핸들러 */
  onBackClick?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "title" | "children">;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Component — Figma Header · 3:3439
 * ======================================== */

export function Header({
  title = "홈",
  onBackClick,
  className,
  ...rest
}: HeaderProps) {
  return (
    <header className={cx(styles.header, className)} {...rest}>
      <div className={styles.leading}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackClick}
          aria-label="뒤로 가기"
        >
          <Arrow size={24} color="var(--color-icon-primary)" />
        </button>
        <span className={styles.title}>{title}</span>
      </div>
    </header>
  );
}

export default Header;
