import { type HTMLAttributes } from "react";
import Image from "next/image";
import { Arrow } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Header (4087:749)
 * state=home · state=chat
 * ======================================== */

/** Figma Current variant `state` */
export type HeaderState = "home" | "chat";

export type HeaderProps = {
  /**
   * Figma Header `state` variant
   * - home: 로고만 표출
   * - chat: 뒤로가기 + 타이틀 표출
   * @default "home"
   */
  state?: HeaderState;
  /**
   * `state="chat"`일 때 좌측 타이틀 텍스트
   * Figma Label 속성 매핑 · 기본값: "홈"
   */
  title?: string;
  /** 뒤로가기(Arrow) 클릭 핸들러 (`state="chat"`) */
  onBack?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "title" | "children">;

/* ========================================
 * Constants
 * ======================================== */

const LOGO_SRC = "/images/Logo.png";
const LOGO_WIDTH = 48;
const LOGO_HEIGHT = 32;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Component — Figma Header · 4087:749
 * ======================================== */

export function Header({
  state = "home",
  title = "홈",
  onBack,
  className,
  ...rest
}: HeaderProps) {
  const isChat = state === "chat";

  return (
    <header
      className={cx(
        styles.header,
        isChat ? styles.stateChat : styles.stateHome,
        className
      )}
      {...rest}
    >
      {isChat ? (
        <div className={styles.leading}>
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            aria-label="뒤로 가기"
          >
            <Arrow />
          </button>
          <span className={styles.title}>{title}</span>
        </div>
      ) : (
        <div className={styles.logoWrap}>
          <Image
            src={LOGO_SRC}
            alt="로고"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            className={styles.logo}
            priority
          />
        </div>
      )}
    </header>
  );
}

export default Header;
