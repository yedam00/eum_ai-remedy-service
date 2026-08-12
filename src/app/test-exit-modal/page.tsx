"use client";

import { useExitModal } from "@/commons/components/modal/hooks/index.exit-modal.hook";

/* ========================================
| * TestExitModal — exit-modal hook 테스트용 페이지
| * ======================================== */

export default function TestExitModalPage() {
  const { handleExitClick } = useExitModal();

  return (
    <div data-testid="test-exit-modal-container">
      <h1>Exit Modal 테스트 페이지</h1>
      <button onClick={handleExitClick} data-testid="trigger-exit-modal">
        나가기 모달 열기
      </button>
    </div>
  );
}
