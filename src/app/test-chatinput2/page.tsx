"use client";

import type { CSSProperties } from "react";
import { ChatInput } from "@/commons/components/chatinput";
import { useFuncBinding } from "@/commons/components/chatinput/hooks/index.func.binding.hook";
import { SpeechBubble } from "@/commons/components/speech-bubble";

/* ========================================
 * TestChatInput2Page — ChatInput variant 시퀀스 바인딩
 * option-trio → vertical-select → medicine-search
 * → pain-scale → checkbox-list → file-upload
 * ======================================== */

const pageStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  minHeight: "100vh",
  width: "100%",
  padding: "24px 16px",
  gap: 24,
};

const conversationStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: 393,
  flex: 1,
  gap: 24,
  overflowY: "auto",
};

const chatInputSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: 393,
  paddingBottom: 32,
};

export default function TestChatInput2Page() {
  const {
    messages,
    uitype,
    options,
    messagePlaceholder,
    dropdownItems,
    checklistItems,
    mediaUrls,
    fileInputRef,
    handleOptionClick,
    handleActionClick,
    handlePainLevelSelect,
    handleChecklistChange,
    handleDropdownItemToggle,
    handleFileUploadClick,
    handleMediaEmptyClick,
    handleMediaRemove,
    handleFileChange,
    handleMessageSubmit,
  } = useFuncBinding();

  return (
    <div data-testid="test-chatinput2-page" style={pageStyle}>
      <div data-testid="conversation-area" style={conversationStyle}>
        {messages.map((message) =>
          message.variant === "ai" ? (
            <SpeechBubble
              key={message.id}
              variant="ai"
              hasImage={false}
              label={message.text}
              userLabel=""
              data-testid="ai-speech-bubble"
            />
          ) : (
            <SpeechBubble
              key={message.id}
              variant="user"
              hasImage={message.hasImage}
              imageUrl={message.imageUrl}
              label=""
              userLabel={message.text}
              data-testid="user-speech-bubble"
            />
          )
        )}
      </div>
      <div style={chatInputSectionStyle}>
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
          options={options}
          messagePlaceholder={messagePlaceholder}
          dropdownItems={dropdownItems}
          checklistItems={checklistItems}
          mediaUrls={mediaUrls}
          onOptionClick={handleOptionClick}
          onActionClick={handleActionClick}
          onPainLevelSelect={handlePainLevelSelect}
          onChecklistChange={handleChecklistChange}
          onDropdownItemToggle={handleDropdownItemToggle}
          onFileUploadClick={handleFileUploadClick}
          onMediaEmptyClick={handleMediaEmptyClick}
          onMediaRemove={handleMediaRemove}
          onMessageSubmit={handleMessageSubmit}
          data-testid="chatinput"
        />
      </div>
    </div>
  );
}
