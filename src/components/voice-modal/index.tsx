"use client";

import { useEffect } from "react";
import { useVoiceInput } from "@/commons/components/voiceinputsheet/hooks/index.voice-input.hook";
import { VoiceInputSheet } from "@/commons/components/voiceinputsheet";
import styles from "./styles.module.css";
import type { VoiceIndicatorState } from "@/commons/components/voiceindicator";

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

const DEFAULT_TITLE = "어디가 불편하신가요?";
const SUCCESS_CLOSE_DELAY_MS = 800;

const DEFAULT_DESCRIPTION_ITEMS = [
  '"배가 쑤시듯이 아파요"',
  '"배가 쑤시듯이 아파요"',
  '"배가 쑤시듯이 아파요"',
] as const;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Component — VoiceModal
 * VoiceInputSheet 공통컴포넌트 조립 + useVoiceInput hook 연동
 * ======================================== */

export default function VoiceModal({
  state: propState,
  descriptions: propDescriptions,
  title: propTitle,
  descriptionItems,
  audioLevel: propAudioLevel,
  onClose,
  className,
}: VoiceModalProps) {
  const { state, transcript, audioLevel, start, stop } = useVoiceInput();

  useEffect(() => {
    start();
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state !== "success") return;

    const timer = setTimeout(() => {
      stop();
      onClose?.();
    }, SUCCESS_CLOSE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [state, stop, onClose]);

  const shouldShowDescriptions =
    propDescriptions !== undefined
      ? propDescriptions
      : state === "default";

  const resolvedTitle = transcript || propTitle || DEFAULT_TITLE;
  const resolvedAudioLevel = audioLevel ?? propAudioLevel ?? 0;

  const resolvedDescriptionItems =
    descriptionItems && descriptionItems.length > 0
      ? descriptionItems
      : [...DEFAULT_DESCRIPTION_ITEMS];

  return (
    <div className={cx(styles.voiceModal, className)}>
      <VoiceInputSheet
        descriptions={shouldShowDescriptions}
        title={resolvedTitle}
        descriptionItems={resolvedDescriptionItems}
        state={propState ?? state}
        audioLevel={resolvedAudioLevel}
        onClose={() => {
          stop();
          onClose?.();
        }}
      />
    </div>
  );
}
