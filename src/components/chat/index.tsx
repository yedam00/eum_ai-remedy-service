"use client";

import { useEffect, useRef } from "react";
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

const LAST_USER_BUBBLE_ID = "last-user-bubble";

export default function Chat({ uitype = "option-trio" }: ChatProps) {
  const { handleHeaderClick } = useLinkModal();
  const { handleExitClick } = useExitModal();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);
  const latestAiRef = useRef<HTMLDivElement>(null);

  // 쿼리 파라미터에서 텍스트 가져오기 (음성 입력에서 전달된 텍스트)
  const userText = searchParams.get("text") || "두통이 있어요";

  useEffect(() => {
    const contentEl = contentRef.current;
    const lastUserEl = lastUserRef.current;
    const latestAiEl = latestAiRef.current;
    if (!contentEl || !lastUserEl || !latestAiEl) return;

    let rafId = 0;
    let observer: ResizeObserver | null = null;

    const getWrap = () =>
      lastUserEl.querySelector("#last-user-bubble > div") as HTMLElement | null;

    const scrollUserWrapToTop = () => {
      const wrapEl = getWrap();
      if (!wrapEl) return;

      const nextTop =
        contentEl.scrollTop +
        (wrapEl.getBoundingClientRect().top -
          contentEl.getBoundingClientRect().top);

      contentEl.dataset.scrollTarget = String(nextTop);
      contentEl.scrollTop = nextTop;
      contentEl.scrollTo({
        top: nextTop,
        behavior: "smooth",
      });
    };

    const scheduleAfterLayout = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const viewportHeight = contentEl.clientHeight;
        if (viewportHeight > 0) {
          contentEl.style.paddingBottom = `${viewportHeight}px`;
        }
        rafId = window.requestAnimationFrame(() => {
          observer?.disconnect();
          scrollUserWrapToTop();
        });
      });
    };

    observer = new ResizeObserver(() => {
      scheduleAfterLayout();
    });
    observer.observe(latestAiEl);
    scheduleAfterLayout();

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(rafId);
    };
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
        <div ref={lastUserRef}>
          <SpeechBubble
            id={LAST_USER_BUBBLE_ID}
            variant="user"
            hasImage={false}
            label=""
            userLabel={userText}
          />
        </div>
        <div ref={latestAiRef} data-testid="chat-latest-ai-bubble">
          <SpeechBubble
            variant="ai"
            hasImage={false}
            label="어떤 증상을 느끼시나요?"
            userLabel=""
          />
        </div>
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
