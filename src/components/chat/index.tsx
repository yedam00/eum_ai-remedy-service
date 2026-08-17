"use client";

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
  
  // 쿼리 파라미터에서 텍스트 가져오기 (음성 입력에서 전달된 텍스트)
  const userText = searchParams.get("text") || "두통이 있어요";

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
          variant="ai"
          hasImage={false}
          label="어디가 불편하신가요?"
          userLabel=""
        />
        <SpeechBubble
          variant="user"
          hasImage={false}
          label=""
          userLabel={userText}
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
