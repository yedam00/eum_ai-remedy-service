"use client";

import { useState } from "react";
import VoiceModal from "@/components/voice-modal";
import { useExitModal } from "@/components/voice-modal/hooks/index.link.exit-modal.hook";
import styles from "./styles.module.css";

export default function DiariesPage() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const { handleExitClick } = useExitModal();

  return (
    <div data-testid="diaries-container" className={styles.container}>
      <h1>Diaries Page</h1>
      <button
        data-testid="exit-button"
        onClick={handleExitClick}
        className={styles.exitButton}
      >
        나가기
      </button>

      <button
        data-testid="open-voice-modal-button"
        onClick={() => setIsVoiceModalOpen(true)}
        className={styles.openButton}
      >
        음성 모달 열기
      </button>

      {isVoiceModalOpen && (
        <VoiceModal
          state="default"
          onClose={() => setIsVoiceModalOpen(false)}
        />
      )}
    </div>
  );
}
