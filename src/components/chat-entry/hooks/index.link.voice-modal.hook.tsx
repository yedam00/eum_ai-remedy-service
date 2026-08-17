"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import VoiceModal from "@/components/voice-modal";

export const useLinkModal = () => {
  const { openModal, closeModal } = useModal();

  const handleVoicePress = () => {
    openModal(
      <div data-testid="voice-modal">
        <VoiceModal onClose={closeModal} />
      </div>,
      "top"
    );
  };

  return {
    handleVoicePress,
  };
};
