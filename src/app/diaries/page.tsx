"use client";

import { useExitModal } from "@/commons/components/modal/hooks/index.exit-modal.hook";

export default function DiariesPage() {
  const { handleExitClick } = useExitModal();

  return (
    <div data-testid="diaries-container">
      <h1>일기 작성</h1>
      <button onClick={handleExitClick} data-testid="exit-button">
        나가기
      </button>
      <div>
        <p>일기 내용을 작성하세요...</p>
      </div>
    </div>
  );
}
