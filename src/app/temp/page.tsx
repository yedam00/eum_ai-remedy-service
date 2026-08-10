"use client";

import { useEffect, useRef } from "react";
import VoiceModal from "@/components/voice-modal";
import { useModal } from "@/commons/providers/modal/modal.provider";

/* ========================================
 * Temp — VoiceModal 연결 페이지
 * ModalProvider + VoiceModal (default 419:5683)
 * 컨텐츠는 화면 최상단(top: 0)부터 붙음
 * ======================================== */

export default function TempPage() {
  const { openModal, closeModal } = useModal();
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;

    openModal(<VoiceModal state="default" onClose={closeModal} />);
  }, [openModal, closeModal]);

  return null;
}
