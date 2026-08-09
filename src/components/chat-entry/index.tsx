"use client";

import { useRouter } from "next/navigation";
import SpeechBubble from "@/commons/components/speech-bubble";
import MessageInput from "@/commons/components/message-input";
import Button from "@/commons/components/button";
import Header from "@/commons/components/header";
import { Voice } from "@/commons/components/icons";
import styles from "./styles.module.css";

/* ========================================
 * ChatEntry UI
 * header · gap · content · gap · voice button · gap · chat-input-area
 * Figma content 2063:8226 · voice button 2065:8332 · chat-input-area 173:2889
 * ======================================== */

export default function ChatEntry() {
  const router = useRouter();

  return (
    <div className={styles.chatEntry}>
      <div className={styles.header}>
        <Header state="chat" title="홈" onBack={() => router.back()} />
      </div>
      <div className={styles.gap40} />
      <div className={styles.content}>
        <SpeechBubble
          variant="ai"
          hasImage={false}
          label="어디가 불편하신가요?"
          userLabel=""
        />
      </div>
      <div className={styles.gap205} />
      <div className={styles.voiceButton}>
        <button
          type="button"
          className={styles.voicePress}
          aria-label="누르고 말하기"
        >
          <span className={styles.voiceCircle} aria-hidden>
            <Voice size="lg" className={styles.voiceIcon} />
          </span>
          <span className={styles.voiceLabel}>누르고 말하기</span>
        </button>
      </div>
      <div className={styles.gap195} />
      <div className={styles.chatInputArea}>
        {/* state 미지정: 포커스→focused, 텍스트 입력→active 로 자동 전환 */}
        <MessageInput
          disabled={false}
          size="lg"
          placeholder="어지럽고 두통이..."
        />
        <Button
          className={styles.symptomButton}
          variant="default"
          state="default"
          size="md"
          label="증상 선택하기"
        />
      </div>
    </div>
  );
}
