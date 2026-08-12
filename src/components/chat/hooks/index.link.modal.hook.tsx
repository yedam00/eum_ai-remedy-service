"use client";

import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import Modal from "@/commons/components/modal";
import { getUrlPath, UrlKey } from "@/commons/constants/url";

export const useLinkModal = () => {
  const { openModal, closeModal } = useModal();
  const router = useRouter();

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
          router.push(getUrlPath(UrlKey.HOME));
        }}
      />
    );
  };

  return {
    handleHeaderClick,
  };
};
