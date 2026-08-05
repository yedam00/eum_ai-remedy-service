"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { ChatInputUIType } from "../../constants/enum";

/* ========================================
 * Types
 * ======================================== */

export type ChatSender = "AI" | "USER";

export type ChatMessage = {
  id: string;
  sender: ChatSender;
  text: string;
  /** 해당 메시지를 입력/선택할 때 사용된 UI 타입 (주로 USER 메시지) */
  inputType?: ChatInputUIType;
  /** submitUserAnswer 시 summaryData에 추가된 키 목록 (Undo용) */
  summaryKeys?: string[];
};

type ChatStateContextValue = {
  messages: ChatMessage[];
  currentInputType: ChatInputUIType | null;
  isThinking: boolean;
  summaryData: Record<string, unknown>;
  addMessage: (message: Omit<ChatMessage, "id"> & { id?: string }) => void;
  setNextQuestion: (
    aiMessage: string,
    nextInputType: ChatInputUIType | null
  ) => void;
  submitUserAnswer: (
    answerText: string,
    payloadData?: Record<string, unknown>
  ) => void;
  popLastAnswer: () => void;
  setIsThinking: (value: boolean) => void;
  /** 가장 마지막(최신) 유저 메시지인지 판별 — Undo 버튼 노출용 */
  isLastUserMessage: (messageId: string) => boolean;
};

type ChatStateProviderProps = {
  children: ReactNode;
};

/* ========================================
 * Helpers
 * ======================================== */

const createMessageId = (): string =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const findLastUserMessageIndex = (messages: ChatMessage[]): number => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].sender === "USER") {
      return i;
    }
  }
  return -1;
};

/* ========================================
 * Context
 * ======================================== */

const ChatStateContext = createContext<ChatStateContextValue | null>(null);

export const useChatState = (): ChatStateContextValue => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error("useChatState must be used within ChatStateProvider");
  }
  return context;
};

/* ========================================
 * ChatStateProvider
 * ======================================== */

export default function ChatStateProvider({
  children,
}: ChatStateProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInputType, setCurrentInputType] =
    useState<ChatInputUIType | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [summaryData, setSummaryData] = useState<Record<string, unknown>>({});

  const addMessage = (
    message: Omit<ChatMessage, "id"> & { id?: string }
  ) => {
    const nextMessage: ChatMessage = {
      ...message,
      id: message.id ?? createMessageId(),
    };
    setMessages((prev) => [...prev, nextMessage]);
  };

  const setNextQuestion = (
    aiMessage: string,
    nextInputType: ChatInputUIType | null
  ) => {
    const aiChatMessage: ChatMessage = {
      id: createMessageId(),
      sender: "AI",
      text: aiMessage,
      inputType: nextInputType ?? undefined,
    };
    setMessages((prev) => [...prev, aiChatMessage]);
    setCurrentInputType(nextInputType);
    setIsThinking(false);
  };

  const submitUserAnswer = (
    answerText: string,
    payloadData?: Record<string, unknown>
  ) => {
    const summaryKeys = payloadData ? Object.keys(payloadData) : [];
    const userMessage: ChatMessage = {
      id: createMessageId(),
      sender: "USER",
      text: answerText,
      inputType: currentInputType ?? undefined,
      summaryKeys: summaryKeys.length > 0 ? summaryKeys : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    if (payloadData && summaryKeys.length > 0) {
      setSummaryData((prev) => ({ ...prev, ...payloadData }));
    }

    setCurrentInputType(null);
    setIsThinking(true);
  };

  const popLastAnswer = () => {
    setMessages((prev) => {
      const lastUserIndex = findLastUserMessageIndex(prev);
      if (lastUserIndex === -1) {
        return prev;
      }

      const lastUserMessage = prev[lastUserIndex];
      const restoredInputType = lastUserMessage.inputType ?? null;

      if (lastUserMessage.summaryKeys && lastUserMessage.summaryKeys.length > 0) {
        setSummaryData((prevSummary) => {
          const next = { ...prevSummary };
          lastUserMessage.summaryKeys?.forEach((key) => {
            delete next[key];
          });
          return next;
        });
      }

      setCurrentInputType(restoredInputType);
      setIsThinking(false);

      // 해당 유저 답변 및 그 이후의 AI 응답/질문 메시지 제거
      return prev.slice(0, lastUserIndex);
    });
  };

  const isLastUserMessage = (messageId: string): boolean => {
    const lastUserIndex = findLastUserMessageIndex(messages);
    if (lastUserIndex === -1) {
      return false;
    }
    return messages[lastUserIndex].id === messageId;
  };

  const value: ChatStateContextValue = {
    messages,
    currentInputType,
    isThinking,
    summaryData,
    addMessage,
    setNextQuestion,
    submitUserAnswer,
    popLastAnswer,
    setIsThinking,
    isLastUserMessage,
  };

  return (
    <ChatStateContext.Provider value={value}>
      {children}
    </ChatStateContext.Provider>
  );
}
