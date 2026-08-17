import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { CloseLG } from "../icons";
import {
  VoiceIndicator,
  type VoiceIndicatorState,
} from "../voiceindicator";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma VoiceInputSheet · 3:3424
 * ======================================== */

export type VoiceInputSheetProps = {
  /**
   * 가이드 문구(Description 1~3) 영역 표시 여부.
   * 기본값: true
   */
  descriptions?: boolean;
  /**
   * 모달 상단 타이틀 (피그마 'Titel' 매핑).
   * 기본값: "어디가 불편하신가요?"
   * success 시 인식된 문장으로 교체해 사용할 수 있다.
   */
  title?: string;
  /**
   * 가이드 문구 목록 (Description 1~3).
   * 미전달 시 피그마 기본 문구를 사용한다.
   */
  descriptionItems?: string[];
  /**
   * VoiceIndicator state — `default` | `listening` | `success`
   * `success`일 때 내부 <VoiceIndicator state="success" /> 로 그대로 전달된다.
   */
  state?: VoiceIndicatorState;
  /**
   * VoiceIndicator audioLevel (0 ~ 100).
   * `listening` 상태에서 막대 애니메이션에 사용.
   */
  audioLevel?: number;
  /** 닫기(Close_LG) 버튼 클릭 */
  onClose?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "title" | "children">;

/* ========================================
 * Constants — Figma default copy
 * ======================================== */

const DEFAULT_TITLE = "어디가 불편하신가요?";

const DEFAULT_DESCRIPTIONS = [
  "“배가 쑤시듯이 아파요”",
  "“배가 쑤시듯이 아파요”",
  "“배가 쑤시듯이 아파요”",
] as const;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Sub-parts
 * ======================================== */

function CloseButton({ onClick }: { onClick?: () => void }) {
  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (
    event
  ) => {
    event.stopPropagation();
    onClick?.();
  };

  return (
    <button
      type="button"
      className={styles.closeButton}
      onClick={handleClick}
      aria-label="닫기"
    >
      <span className={styles.closeIcon} aria-hidden>
        <CloseLG />
      </span>
    </button>
  );
}

function DescriptionList({ items }: { items: string[] }) {
  return (
    <div className={styles.descriptions}>
      {items.map((item, index) => (
        <p key={`${item}-${index}`} className={styles.description}>
          {item}
        </p>
      ))}
    </div>
  );
}

/**
 * 피그마 VoiceIndicator 인스턴스(72×72) 영역.
 * 최신 공통 컴포넌트 `src/commons/components/voiceindicator` 를 재사용한다.
 * VoiceInputSheet.state === "success" → <VoiceIndicator state="success" />
 */
function IndicatorArea({
  state,
  audioLevel,
}: {
  state: VoiceIndicatorState;
  audioLevel?: number;
}) {
  return (
    <div className={styles.indicator}>
      <VoiceIndicator state={state} audioLevel={audioLevel} />
    </div>
  );
}

/* ========================================
 * Component — Figma VoiceInputSheet · 3:3424
 * ======================================== */

export function VoiceInputSheet({
  descriptions = true,
  title = DEFAULT_TITLE,
  descriptionItems,
  state = "default",
  audioLevel,
  onClose,
  className,
  ...rest
}: VoiceInputSheetProps) {
  const items =
    descriptionItems && descriptionItems.length > 0
      ? descriptionItems
      : [...DEFAULT_DESCRIPTIONS];

  return (
    <div
      className={cx(styles.root, className)}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      {...rest}
    >
      {/* 디버깅용 audioLevel 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: '#000',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          Level: {audioLevel ?? 0}
        </div>
      )}
      
      <div className={styles.top}>
        <div className={styles.closeRow}>
          <CloseButton onClick={onClose} />
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>{title}</h2>
          {descriptions ? <DescriptionList items={items} /> : null}
        </div>
      </div>

      <IndicatorArea state={state} audioLevel={audioLevel} />
    </div>
  );
}

export default VoiceInputSheet;
