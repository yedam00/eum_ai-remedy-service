"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { VoiceIndicatorState } from "../../voiceindicator";
import { getUrlPath, UrlKey } from "@/commons/constants/url";

/* ========================================
 * Types
 * ======================================== */

// Web Speech API 타입 정의
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type UseVoiceInputReturn = {
  /** 현재 상태 (default | listening | success) */
  state: VoiceIndicatorState;
  /** 현재 인식된 텍스트 (실시간 업데이트) */
  transcript: string;
  /** 현재 오디오 레벨 (0~100) */
  audioLevel: number;
  /** 음성 인식 시작 */
  start: () => void;
  /** 음성 인식 중단 */
  stop: () => void;
};

/* ========================================
 * Constants
 * ======================================== */

const SILENCE_DURATION_MS = 2000; // 2초 무음 감지
const SILENCE_THRESHOLD = 5; // audioLevel이 5 이하면 무음으로 간주
const FALLBACK_TEXT = "배가 쑤시듯이 아파요"; // Fallback 텍스트
const FALLBACK_DELAY_MS = 2000; // Fallback 텍스트 생성 딜레이
const AUDIO_LEVEL_UPDATE_INTERVAL_MS = 100; // audioLevel 업데이트 주기

/* ========================================
 * Helpers
 * ======================================== */

/**
 * Web Speech API 지원 여부 확인
 */
const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition
  );
};

/**
 * Uint8Array 주파수 데이터를 0~100 범위의 audioLevel로 변환
 */
const calculateAudioLevel = (frequencyData: Uint8Array): number => {
  if (frequencyData.length === 0) return 0;

  // 최대값 사용 (음성에 더 민감하게 반응)
  let maxValue = 0;
  for (let i = 0; i < frequencyData.length; i++) {
    if (frequencyData[i] > maxValue) {
      maxValue = frequencyData[i];
    }
  }

  // 0~255 → 0~100 변환
  return Math.min(100, Math.round((maxValue / 255) * 100));
};

/* ========================================
 * Hook
 * ======================================== */

export const useVoiceInput = (): UseVoiceInputReturn => {
  const router = useRouter();
  const [state, setState] = useState<VoiceIndicatorState>("default");
  const [transcript, setTranscript] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastAudioLevelRef = useRef<number>(0);
  const finalTranscriptRef = useRef<string>("");

  /**
   * 2초 무음 감지 후 Success 전환 및 /chat 이동
   */
  const handleSilenceDetected = () => {
    const textToSend = finalTranscriptRef.current || FALLBACK_TEXT;
    
    // Success 상태로 전환
    setState("success");
    setTranscript(textToSend);

    // 음성 인식 중단
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // AudioContext 정리
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // 타이머 정리
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }

    // /chat 페이지로 이동 (텍스트를 쿼리 파라미터로 전달)
    setTimeout(() => {
      const chatPath = getUrlPath(UrlKey.CHAT);
      const encodedText = encodeURIComponent(textToSend);
      router.push(`${chatPath}?text=${encodedText}`);
    }, 800); // 모달 닫힘 애니메이션과 동기화
  };

  /**
   * 무음 감지 타이머 시작
   */
  const startSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      handleSilenceDetected();
    }, SILENCE_DURATION_MS);
  };

  /**
   * 무음 감지 타이머 취소
   */
  const cancelSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  /**
   * AudioContext 및 Analyser 초기화
   */
  const initAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      
      if (!AudioContextClass) {
        console.error("AudioContext가 지원되지 않습니다.");
        return;
      }
      
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // audioLevel 업데이트 시작
      audioLevelIntervalRef.current = setInterval(() => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const level = calculateAudioLevel(dataArray);
        setAudioLevel(level);
        lastAudioLevelRef.current = level;

        // 무음 감지 (audioLevel이 임계값 이하이고 transcript가 있을 때)
        if (level <= SILENCE_THRESHOLD && finalTranscriptRef.current) {
          // 이전에 타이머가 없었다면 시작
          if (!silenceTimerRef.current) {
            startSilenceTimer();
          }
        } else {
          // 소리가 들리면 타이머 취소
          cancelSilenceTimer();
        }
      }, AUDIO_LEVEL_UPDATE_INTERVAL_MS);
    } catch (error) {
      console.error("AudioContext 초기화 실패:", error);
    }
  };

  /**
   * Web Speech API 초기화
   */
  const initSpeechRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      console.warn("Web Speech API가 지원되지 않습니다.");
      
      // Fallback: 2초 후 기본 텍스트로 성공 처리
      fallbackTimerRef.current = setTimeout(() => {
        finalTranscriptRef.current = FALLBACK_TEXT;
        handleSilenceDetected();
      }, FALLBACK_DELAY_MS);
      
      return;
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.error("SpeechRecognition이 지원되지 않습니다.");
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ko-KR";

    recognition.onstart = () => {
      setState("listening");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      // 최종 결과 저장
      if (finalTranscript) {
        finalTranscriptRef.current = finalTranscript;
      }

      // 실시간 텍스트 업데이트 (최종 + 중간)
      const currentTranscript =
        finalTranscriptRef.current + interimTranscript;
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("음성 인식 에러:", event.error);
      
      // 에러 발생 시 Fallback
      if (!finalTranscriptRef.current) {
        finalTranscriptRef.current = FALLBACK_TEXT;
        handleSilenceDetected();
      }
    };

    recognition.onend = () => {
      // 음성 인식 종료 시 처리
    };

    recognitionRef.current = recognition;
  };

  /**
   * 음성 인식 시작
   */
  const start = () => {
    // 상태 초기화
    setState("default");
    setTranscript("");
    setAudioLevel(0);
    finalTranscriptRef.current = "";

    // AudioContext 초기화
    initAudioAnalyser();

    // Speech Recognition 초기화 및 시작
    initSpeechRecognition();
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("음성 인식 시작 실패:", error);
      }
    }
  };

  /**
   * 음성 인식 중단
   */
  const stop = () => {
    // Speech Recognition 중단
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // AudioContext 정리
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // 타이머 정리
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }

    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    // 상태 초기화
    setState("default");
    setAudioLevel(0);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    state,
    transcript,
    audioLevel,
    start,
    stop,
  };
};
