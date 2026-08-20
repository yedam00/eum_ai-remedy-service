"use client";

import type { CSSProperties } from "react";
import { ChatInput } from "@/commons/components/chatinput";
import { useFuncBackNavigation } from "@/commons/components/chatinput/hooks/index.func.back-navigation.hook";
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

const userBubbleWrapStyle: CSSProperties = {
  position: "relative",
  alignSelf: "flex-end",
  width: "fit-content",
};

const userIconSlotStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  width: 48,
  height: 48,
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
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
    handleBackClick,
  } = useFuncBackNavigation();

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
            <div key={message.id} style={userBubbleWrapStyle}>
              <SpeechBubble
                variant="user"
                hasImage={message.hasImage}
                imageUrls={message.imageUrls}
                imageUrl={message.imageUrls?.[0]}
                label=""
                userLabel={message.text}
                data-testid="user-speech-bubble"
              />
              {!message.hasImage ? (
                <button
                  type="button"
                  aria-label="뒤로가기"
                  data-testid="user-icon-slot"
                  onClick={handleBackClick}
                  style={userIconSlotStyle}
                />
              ) : null}
            </div>
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
