"use client";

import ChatInput, {
  type ChatInputUiType,
} from "@/commons/components/chatinput";
import SpeechBubble from "@/commons/components/speech-bubble";
import Header from "@/commons/components/header";
import { useLinkModal } from "./hooks/index.link.modal.hook";
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
      <div className={styles.content}>
        <SpeechBubble
          variant="user"
          hasImage={false}
          label=""
          userLabel="두통이 있어요"
        />
        <SpeechBubble
          variant="ai"
          hasImage={false}
          label="어떤 증상을 느끼시나요?"
          userLabel=""
        />
      </div>
      <div className={styles.chatInput}>
        <ChatInput uitype={uitype} />
      </div>
    </div>
  );
}
