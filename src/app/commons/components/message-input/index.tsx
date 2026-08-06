"use client";

import {
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  useState,
} from "react";
import { ArrowUp, Voice } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma message-input variant API (3:3516)
 * ======================================== */

/** Figma State=`Default` | `Focused` | `Active` */
export type MessageInputState = "default" | "focused" | "active";

/** Figma Size=`sm` | `lg` */
export type MessageInputSize = "sm" | "lg";

export type MessageInputProps = {
  state?: MessageInputState;
  size?: MessageInputSize;
  /** AI 질문 상황에 맞춰 동적으로 전달. 기본값: "메시지를 입력하세요" */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Active 상태에서 전송 버튼 클릭 또는 Enter */
  onSubmit?: (value: string) => void;
  /** Default 상태 Voice 버튼 클릭 */
  onVoiceClick?: () => void;
  className?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "defaultValue" | "placeholder" | "onSubmit"
>;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const SIZE_CLASS: Record<MessageInputSize, string> = {
  sm: styles.sizeSm,
  lg: styles.sizeLg,
};

const STATE_CLASS: Record<MessageInputState, string> = {
  default: styles.stateDefault,
  focused: styles.stateFocused,
  active: styles.stateActive,
};

const DEFAULT_PLACEHOLDER = "메시지를 입력하세요";

function resolveState(
  controlled: MessageInputState | undefined,
  isFocused: boolean,
  hasValue: boolean
): MessageInputState {
  if (controlled !== undefined) return controlled;
  if (hasValue) return "active";
  if (isFocused) return "focused";
  return "default";
}

/* ========================================
 * Component
 * ======================================== */

export function MessageInput({
  state: controlledState,
  size = "sm",
  placeholder = DEFAULT_PLACEHOLDER,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onVoiceClick,
  className,
  disabled,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  ...rest
}: MessageInputProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const value = isControlled ? controlledValue : uncontrolledValue;
  const hasValue = value.trim().length > 0;
  const visualState = resolveState(controlledState, isFocused, hasValue);
  const showVoice = visualState === "default";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onValueChange?.(event.target.value);
    onChange?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleSubmit = () => {
    if (!hasValue || disabled) return;
    onSubmit?.(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
    onKeyDown?.(event);
  };

  const handleActionClick = (event: FormEvent) => {
    event.preventDefault();
    if (disabled) return;
    if (showVoice) {
      onVoiceClick?.();
      return;
    }
    handleSubmit();
  };

  return (
    <div
      className={cx(
        styles.root,
        SIZE_CLASS[size],
        STATE_CLASS[visualState],
        disabled && styles.disabled,
        className
      )}
    >
      <div className={styles.textField}>
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      </div>

      <button
        type="button"
        className={styles.actionButton}
        disabled={disabled || (!showVoice && !hasValue)}
        aria-label={showVoice ? "음성 입력" : "메시지 전송"}
        onClick={handleActionClick}
      >
        <span className={styles.iconSlot} aria-hidden>
          {showVoice ? (
            <Voice size={24} color="currentColor" />
          ) : (
            <ArrowUp size={24} color="currentColor" />
          )}
        </span>
      </button>
    </div>
  );
}

export default MessageInput;
