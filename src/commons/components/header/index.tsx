import { type HTMLAttributes } from "react";
import Image from "next/image";
import { Arrow } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Header (4087:749)
 * ======================================== */

/** Figma Current variant `state` */
export type HeaderState = "home" | "chat";

export type HeaderProps = {
  /**
   * Figma Header `state` variant
   * - home: Logo
   * - chat: Arrow + title
   */
  state?: HeaderState;
  /**
   * `state="chat"`일 때 좌측 타이틀 텍스트
   * Figma Label 속성 매핑 · 기본값: "홈"
   */
  title?: string;
  /** 뒤로가기(Arrow) 클릭 핸들러 */
  onBack?: () => void;
  /** @deprecated `onBack`을 사용하세요 */
  onBackClick?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "title" | "children">;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Sub-parts
 * ======================================== */

function HomeLeading() {
  return (
    <div className={styles.leading}>
      <Image
        src="/images/Logo.png"
        alt="로고"
        width={48}
        height={32}
        className={styles.logo}
        priority
      />
    </div>
  );
}

function ChatLeading({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
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
  );
}

/* ========================================
 * Component — Figma Header · 4087:749
 * ======================================== */

export function Header({
  state = "home",
  title = "홈",
  onBack,
  onBackClick,
  className,
  ...rest
}: HeaderProps) {
  const isChat = state === "chat";
  const handleBack = onBack ?? onBackClick;

  return (
    <header
      className={cx(
        styles.header,
        isChat ? styles.stateChat : styles.stateHome,
        className,
      )}
      {...rest}
    >
      {isChat ? (
        <ChatLeading title={title} onBack={handleBack} />
      ) : (
        <HomeLeading />
      )}
    </header>
  );
}

export default Header;
