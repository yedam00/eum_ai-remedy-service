"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import Modal from "@/commons/components/modal";

export const useLinkModal = () => {
  const { openModal, closeModal } = useModal();

  const handleHeaderClick = () => {
    openModal(
      <Modal
        variant="info"
        title="제목"
        content="작성 중인 내용이 있습니다. 나가시겠습니까?"
        primaryLabel="계속 작성"
        secondaryLabel="나가기"
        onPrimary={closeModal}
        onSecondary={() => {
          closeModal();
          // 추가 동작이 필요한 경우 여기에 구현
        }}
      />
    );
  };

  return {
    handleHeaderClick,
  };
};
