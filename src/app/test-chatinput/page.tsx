"use client";

import { ChatInput } from "@/commons/components/chatinput";
import { useFileUpload } from "@/commons/components/chatinput/hooks/index.file-upload.hook";
import styles from "./styles.module.css";

/* ========================================
 * TestChatInputPage — ChatInput (file-upload) 테스트 페이지
 * uitype="file-upload" 독립 렌더링
 * ======================================== */

export default function TestChatInputPage() {
  const {
    uitype,
    mediaUrls,
    fileInputRef,
    handleFileUploadClick,
    handleFileChange,
    handleMediaEmptyClick,
    handleMediaRemove,
  } = useFileUpload();

  const handleActionClick = () => {
    console.log("아니요/다음 버튼 클릭");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>ChatInput (file-upload) 테스트</h1>
      </div>
      <div className={styles.chatInputSection}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          data-testid="hidden-file-input"
        />
        <ChatInput
          uitype={uitype}
          mediaUrls={mediaUrls}
          onFileUploadClick={handleFileUploadClick}
          onMediaEmptyClick={handleMediaEmptyClick}
          onMediaRemove={handleMediaRemove}
          onActionClick={handleActionClick}
        />
      </div>
    </div>
  );
}
