"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUrlPath, UrlKey } from "@/commons/constants/url";
import type { VoiceIndicatorState } from "../../voiceindicator";

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
    webkitAudioContext?: typeof AudioContext;
  }
}

type UseVoiceInputReturn = {
  state: VoiceIndicatorState;
  transcript: string;
  audioLevel: number;
  start: () => void;
  stop: () => void;
};

const SILENCE_DURATION_MS = 2000;
const SILENCE_THRESHOLD = 40;
const FALLBACK_TEXT = "배가 쑤시듯이 아파요";
const FALLBACK_DELAY_MS = 2000;
const AUDIO_LEVEL_UPDATE_INTERVAL_MS = 100;
const SUCCESS_NAVIGATE_DELAY_MS = 800;

const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

const getSpeechRecognitionConstructor = ():
  | SpeechRecognitionConstructor
  | undefined => {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition || window.webkitSpeechRecognition;
};

const getAudioContextConstructor = (): typeof AudioContext | undefined => {
  if (typeof window === "undefined") return undefined;
  if (typeof window.AudioContext === "function") {
    return window.AudioContext;
  }
  if (typeof window.webkitAudioContext === "function") {
    return window.webkitAudioContext;
  }
  return undefined;
};

const calculateAudioLevel = (frequencyData: Uint8Array): number => {
  if (frequencyData.length === 0) return 0;

  let maxValue = 0;
  for (let i = 0; i < frequencyData.length; i++) {
    if (frequencyData[i] > maxValue) {
      maxValue = frequencyData[i];
    }
  }

  return Math.min(100, Math.round((maxValue / 255) * 100));
};

export const useVoiceInput = (): UseVoiceInputReturn => {
  const router = useRouter();
  const [state, setState] = useState<VoiceIndicatorState>("default");
  const [transcript, setTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioLevelIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTranscriptRef = useRef("");

  const handleSilenceDetected = () => {
    const textToSend = finalTranscriptRef.current || FALLBACK_TEXT;

    setState("success");
    setTranscript(textToSend);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }

    setTimeout(() => {
      const chatPath = getUrlPath(UrlKey.CHAT);
      const encodedText = encodeURIComponent(textToSend);
      router.push(`${chatPath}?text=${encodedText}`);
    }, SUCCESS_NAVIGATE_DELAY_MS);
  };

  const startSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      handleSilenceDetected();
    }, SILENCE_DURATION_MS);
  };

  const cancelSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const initAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = getAudioContextConstructor();
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      audioLevelIntervalRef.current = setInterval(() => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const level = calculateAudioLevel(dataArray);
        setAudioLevel(level);

        if (level <= SILENCE_THRESHOLD && finalTranscriptRef.current) {
          if (!silenceTimerRef.current) {
            startSilenceTimer();
          }
        } else {
          cancelSilenceTimer();
        }
      }, AUDIO_LEVEL_UPDATE_INTERVAL_MS);
    } catch {
      return;
    }
  };

  const initSpeechRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      fallbackTimerRef.current = setTimeout(() => {
        finalTranscriptRef.current = FALLBACK_TEXT;
        handleSilenceDetected();
      }, FALLBACK_DELAY_MS);
      return;
    }

    const SpeechRecognitionClass = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionClass) return;

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

      if (finalTranscript) {
        finalTranscriptRef.current = finalTranscript;
      }

      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = () => {
      if (!finalTranscriptRef.current) {
        finalTranscriptRef.current = FALLBACK_TEXT;
        handleSilenceDetected();
      }
    };

    recognitionRef.current = recognition;
  };

  const start = () => {
    setState("default");
    setTranscript("");
    setAudioLevel(0);
    finalTranscriptRef.current = "";

    initAudioAnalyser();
    initSpeechRecognition();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        return;
      }
    }
  };

  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

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

    setState("default");
    setAudioLevel(0);
  };

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
