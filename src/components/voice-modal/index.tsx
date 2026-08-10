"use client";

import {
  VoiceInputSheet,
  type VoiceInputSheetProps,
} from "@/commons/components/voiceinputsheet";
import type { VoiceIndicatorState } from "@/commons/components/voiceindicator";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma VoiceInputSheet instances
 * default 419:5683 · listening 2087:5431 · success 419:5703
 * ======================================== */

export type VoiceModalState = VoiceIndicatorState;

export type VoiceModalProps = {
  /**
   * 가이드 문구(Description 1~3) 영역 표시 여부.
   * 미전달 시 state별 피그마 프리셋을 따른다.
   * - default → true
   * - listening / success → false
   */
  descriptions?: boolean;
  /**
   * 모달 상단 타이틀.
   * 미전달 시 state별 피그마 문구를 사용한다.
   */
  title?: string;
  /** 가이드 문구 목록 (Description 1~3) */
  descriptionItems?: string[];
  /**
   * VoiceIndicator / VoiceInputSheet state
   * `default` | `listening` | `success`
   */
  state?: VoiceModalState;
  /**
   * VoiceIndicator audioLevel (0 ~ 100).
   * 미전달 시 listening은 100, 그 외는 0.
   */
  audioLevel?: number;
  /** 닫기(Close_LG) 버튼 클릭 */
  onClose?: () => void;
  className?: string;
};

/* ========================================
 * Constants — Figma copy / state presets
 * ======================================== */

const DEFAULT_DESCRIPTION_ITEMS = [
  "“배가 쑤시듯이 아파요”",
  "“배가 쑤시듯이 아파요”",
  "“배가 쑤시듯이 아파요”",
] as const;

/**
 * 피그마 인스턴스별 기본 props
 * - 419:5683 default — 가이드 문구 노출 · "어디가 불편하신가요?"
 * - 2087:5431 listening — 가이드 숨김 · "두통이..." · bars full
 * - 419:5703 success — 가이드 숨김 · "두통이 있어요"
 */
const FIGMA_STATE_PRESETS: Record<
  VoiceModalState,
  Pick<VoiceInputSheetProps, "descriptions" | "title" | "audioLevel">
> = {
  default: {
    descriptions: true,
    title: "어디가 불편하신가요?",
    audioLevel: 0,
  },
  listening: {
    descriptions: false,
    title: "두통이...",
    audioLevel: 100,
  },
  success: {
    descriptions: false,
    title: "두통이 있어요",
    audioLevel: 0,
  },
};

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Component — VoiceModal
 * VoiceInputSheet 공통컴포넌트 조립 (원본 수정 없음)
 * ======================================== */

export default function VoiceModal({
  state = "default",
  descriptions,
  title,
  descriptionItems,
  audioLevel,
  onClose,
  className,
}: VoiceModalProps) {
  const preset = FIGMA_STATE_PRESETS[state];

  const resolvedDescriptions = descriptions ?? preset.descriptions ?? true;
  const resolvedTitle = title ?? preset.title;
  const resolvedAudioLevel = audioLevel ?? preset.audioLevel;
  const resolvedDescriptionItems =
    descriptionItems && descriptionItems.length > 0
      ? descriptionItems
      : [...DEFAULT_DESCRIPTION_ITEMS];

  return (
    <div className={cx(styles.voiceModal, className)}>
      <VoiceInputSheet
        descriptions={resolvedDescriptions}
        title={resolvedTitle}
        descriptionItems={resolvedDescriptionItems}
        state={state}
        audioLevel={resolvedAudioLevel}
        onClose={onClose}
      />
    </div>
  );
}
