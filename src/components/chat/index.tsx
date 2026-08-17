"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChatInput, {
  type ChatInputUiType,
} from "@/commons/components/chatinput";
import SpeechBubble from "@/commons/components/speech-bubble";
import Header from "@/commons/components/header";
import { useLinkModal } from "./hooks/index.link.modal.hook";
import { useExitModal } from "@/commons/components/modal/hooks/index.exit-modal.hook";
import styles from "./styles.module.css";

/* ========================================
 * Chat UI
 * header · content · chat-input
 * Figma content 457:6248
 * ======================================== */

export type ChatProps = {
  /**
   * 하단 ChatInput 옵션 UI 타입.
   * multi-upload | vertical-select | option-trio | medicine-search |
   * file-upload | pain-scale | checkbox-list
   */
  uitype?: ChatInputUiType;
};

export default function Chat({ uitype = "option-trio" }: ChatProps) {
  const { handleHeaderClick } = useLinkModal();
  const { handleExitClick } = useExitModal();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const latestUserBubbleRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  // 쿼리 파라미터에서 텍스트 가져오기 (음성 입력에서 전달된 텍스트)
  const userText = searchParams.get("text") || "두통이 있어요";

  useLayoutEffect(() => {
    const contentEl = contentRef.current;
    const spacerEl = spacerRef.current;
    if (!contentEl || !spacerEl) return;
    spacerEl.style.height = `${contentEl.clientHeight}px`;
  }, [userText]);

  useEffect(() => {
    const contentEl = contentRef.current;
    const userBubbleEl = latestUserBubbleRef.current;
    if (!contentEl || !userBubbleEl) return;

    const frameId = window.requestAnimationFrame(() => {
      const nextTop =
        contentEl.scrollTop +
        (userBubbleEl.getBoundingClientRect().top -
          contentEl.getBoundingClientRect().top);
      contentEl.scrollTo({
        top: nextTop,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [userText]);

  return (
    <div className={styles.chat} data-testid="chat-container">
      <div className={styles.header}>
        <Header
          state="chat"
          title="홈"
          onBack={handleHeaderClick}
          backButtonTestId="chat-back-button"
        />
      </div>
      <div
        className={styles.content}
        ref={contentRef}
        data-testid="chat-content"
      >
        <SpeechBubble
          variant="ai"
          hasImage={false}
          label="어디가 불편하신가요?"
          userLabel=""
          data-testid="chat-history-ai-bubble"
        />
        <div ref={latestUserBubbleRef} data-testid="chat-latest-user-bubble">
          <SpeechBubble
            variant="user"
            hasImage={false}
            label=""
            userLabel={userText}
          />
        </div>
        <SpeechBubble
          variant="ai"
          hasImage={false}
          label="어떤 증상을 느끼시나요?"
          userLabel=""
          data-testid="chat-latest-ai-bubble"
        />
        <div ref={spacerRef} data-testid="chat-scroll-spacer" aria-hidden />
      </div>
      <div className={styles.chatInput}>
        <ChatInput uitype={uitype} />
      </div>
      <button
        data-testid="exit-button"
        onClick={handleExitClick}
        style={{ position: "absolute", bottom: "100px", right: "20px" }}
      >
        나가기
      </button>
    </div>
  );
}
