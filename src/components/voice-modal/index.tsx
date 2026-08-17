"use client";

import { useEffect } from "react";
import { VoiceInputSheet } from "@/commons/components/voiceinputsheet";
import type { VoiceIndicatorState } from "@/commons/components/voiceindicator";
import { useVoiceInput } from "@/commons/components/voiceinputsheet/hooks/index.voice-input.hook";
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

const DEFAULT_TITLE = "어디가 불편하신가요?";

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

  // 컴포넌트 마운트 시 자동으로 음성 인식 시작
  useEffect(() => {
    start();
    
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Success 상태가 되면 체크 애니메이션 후 자동으로 모달 닫기
  useEffect(() => {
    if (state === "success") {
      // 체크 애니메이션을 보여주기 위해 800ms 대기 후 모달 닫기
      const timer = setTimeout(() => {
        stop();
        onClose?.();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [state, stop, onClose]);

  // state에 따라 descriptions 표시 여부 결정
  const shouldShowDescriptions =
    propDescriptions !== undefined
      ? propDescriptions
      : state === "default";

  // title 결정 (transcript가 있으면 그것을 사용, 없으면 propTitle 또는 기본값)
  const resolvedTitle = transcript || propTitle || DEFAULT_TITLE;

  // audioLevel 결정 (hook에서 받은 값 사용, 없으면 prop 값)
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
