"use client";

import {
  useEffect,
  useState,
  type HTMLAttributes,
} from "react";
import { Button } from "../button";
import { MediaUpload } from "../media-upload";
import { MessageInput } from "../message-input";
import {
  Dropdown,
  type DropdownExpanded,
  type DropdownItemData,
} from "../dropdown";
import { ImageCard, type ImageCardLevel } from "../image-card";
import { Checklist, type ChecklistItem } from "../checklist";
import { Circle, CloseLG, Triangle } from "../icons";
import { useFuncTitleBinding } from "./hooks/index.func.title-binding.hook";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma ChatInput variant API (2030:1233)
 * ======================================== */

export type ChatInputUiType =
  | "multi-upload"
  | "vertical-select"
  | "option-trio"
  | "medicine-search"
  | "file-upload"
  | "pain-scale"
  | "checkbox-list";

export type PainScaleItem = {
  level: ImageCardLevel;
  /** 점수 텍스트 (예: 1~2) */
  score: string;
  /** 설명 (예: 조금 아프다) */
  description: string;
  imageSrc: string;
};

export type ChatInputProps = {
  /** Figma uitype */
  uitype?: ChatInputUiType;
  /** multi-upload: 최대 6개 미디어 URL (없으면 empty 슬롯) */
  mediaUrls?: Array<string | undefined>;
  /** multi-upload: empty 슬롯 클릭 */
  onMediaEmptyClick?: (index: number) => void;
  /** multi-upload: uploaded 삭제 */
  onMediaRemove?: (index: number) => void;
  /** vertical-select / option-trio: 옵션 라벨 목록 */
  options?: string[];
  /** vertical-select / option-trio: 옵션 클릭 */
  onOptionClick?: (index: number, label: string) => void;
  /** medicine-search: Dropdown expanded (`False` | `True`) */
  dropdownExpanded?: DropdownExpanded;
  /**
   * medicine-search: Dropdown 헤더 제목.
   * 실제 표시는 선택된 항목 배열의 첫 요소로 동적 계산된다.
   */
  dropdownTitle?: string;
  /**
   * medicine-search: Dropdown 우측 선택 상태 텍스트.
   * 실제 표시는 선택 개수에 따라 `+N개 선택됨`으로 동적 계산된다.
   */
  dropdownPointText?: string;
  /** medicine-search: Dropdown 항목 */
  dropdownItems?: DropdownItemData[];
  /** medicine-search: Dropdown 헤더 토글 */
  onDropdownToggle?: () => void;
  /** medicine-search: Dropdown 항목 토글 */
  onDropdownItemToggle?: (id: string) => void;
  /** medicine-search: 약 추가하기 */
  onDropdownAddClick?: () => void;
  /** file-upload: 드롭존 클릭 */
  onFileUploadClick?: () => void;
  /** pain-scale: 선택된 레벨 (controlled) */
  selectedPainLevel?: ImageCardLevel | null;
  /** pain-scale: 레벨 선택 */
  onPainLevelSelect?: (level: ImageCardLevel) => void;
  /** checkbox-list: Checklist 항목 */
  checklistItems?: ChecklistItem[];
  /** checkbox-list: 선택 변경 */
  onChecklistChange?: (selectedIds: string[]) => void;
  /** MessageInput placeholder */
  messagePlaceholder?: string;
  /** MessageInput 값 */
  messageValue?: string;
  /** MessageInput 값 변경 */
  onMessageChange?: (value: string) => void;
  /** MessageInput 전송 */
  onMessageSubmit?: (value: string) => void;
  /** MessageInput 음성 버튼 */
  onVoiceClick?: () => void;
  /** 하단/주요 액션 버튼 클릭 (다음 / 아니요 등) */
  onActionClick?: () => void;
  /**
   * checkbox-list 호환용. '다음' 버튼 상태는 체크 선택 수에 따라
   * 자동 전환되므로 무시된다.
   */
  actionInactive?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/* ========================================
 * Constants — Figma defaults
 * ======================================== */

const MEDIA_SLOT_COUNT = 6;

const DEFAULT_VERTICAL_OPTIONS = ["분", "시", "며칠에 걸침", "수주에 걸침"];

const DEFAULT_OPTION_TRIO = ["예", "아니오", "모르겠음"] as const;

const DEFAULT_MESSAGE_PLACEHOLDER = "두통, 어지러움";

/** medicine-search Dropdown 기본 항목 — Checkbox state: selected | default */
const DEFAULT_MEDICINE_ITEMS: DropdownItemData[] = [
  { id: "1", label: "당뇨약", meta: "아침/저녁", selected: true },
  { id: "2", label: "고지혈증약", meta: "아침/저녁", selected: true },
  { id: "3", label: "고혈압약", meta: "아침/저녁", selected: true },
  { id: "4", label: "진통제", meta: "아침/저녁", selected: true },
];

/**
 * pain-scale 고정 정적 데이터.
 * 이미지: /images/level1.png ~ level5.png
 * 점수·설명은 피그마(2030:1233) 기준.
 */
const PAIN_SCALE_DATA: readonly PainScaleItem[] = [
  {
    level: 1,
    score: "1~2",
    description: "조금 아프다",
    imageSrc: "/images/level1.png",
  },
  {
    level: 2,
    score: "3~4",
    description: "조금 아프다",
    imageSrc: "/images/level2.png",
  },
  {
    level: 3,
    score: "5~6",
    description: "조금 아프다",
    imageSrc: "/images/level3.png",
  },
  {
    level: 4,
    score: "7~8",
    description: "조금 아프다",
    imageSrc: "/images/level4.png",
  },
  {
    level: 5,
    score: "9~10",
    description: "조금 아프다",
    imageSrc: "/images/level5.png",
  },
] as const;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

function normalizeMediaUrls(
  mediaUrls?: Array<string | undefined>
): Array<string | undefined> {
  const source = mediaUrls ?? [];
  return Array.from(
    { length: MEDIA_SLOT_COUNT },
    (_, index) => source[index]
  );
}

/* ========================================
 * Sub-parts — MessageInput (공유)
 * ======================================== */

function ChatMessageInput({
  placeholder = DEFAULT_MESSAGE_PLACEHOLDER,
  value,
  onValueChange,
  onSubmit,
  onVoiceClick,
}: {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onVoiceClick?: () => void;
}) {
  return (
    <MessageInput
      size="sm"
      placeholder={placeholder}
      value={value}
      onValueChange={onValueChange}
      onSubmit={onSubmit}
      onVoiceClick={onVoiceClick}
    />
  );
}

/* ========================================
 * Sub-parts — uitype variants
 * ======================================== */

/** Figma uitype=multi-upload · 2030:1809 */
function MultiUploadView({
  mediaUrls,
  onMediaEmptyClick,
  onMediaRemove,
  onActionClick,
}: {
  mediaUrls?: Array<string | undefined>;
  onMediaEmptyClick?: (index: number) => void;
  onMediaRemove?: (index: number) => void;
  onActionClick?: () => void;
}) {
  const slots = normalizeMediaUrls(mediaUrls);

  return (
    <div
      className={cx(styles.section, styles.gap24)}
      data-testid="multi-upload-filled-container"
    >
      <div className={styles.mediaGrid}>
        {slots.map((url, index) => (
          <MediaUpload
            key={`media-${index}`}
            imageUrl={url}
            alt={url ? `업로드 이미지 ${index + 1}` : ""}
            onEmptyClick={() => onMediaEmptyClick?.(index)}
            onRemove={() => onMediaRemove?.(index)}
          />
        ))}
      </div>
      <Button
        variant="default"
        state="default"
        size="md"
        label="다음"
        className={styles.fullButton}
        onClick={onActionClick}
      />
    </div>
  );
}

/** Figma uitype=vertical-select · 2027:1894 */
function VerticalSelectView({
  options = DEFAULT_VERTICAL_OPTIONS,
  onOptionClick,
  messagePlaceholder,
  messageValue,
  onMessageChange,
  onMessageSubmit,
  onVoiceClick,
}: {
  options?: string[];
  onOptionClick?: (index: number, label: string) => void;
  messagePlaceholder?: string;
  messageValue?: string;
  onMessageChange?: (value: string) => void;
  onMessageSubmit?: (value: string) => void;
  onVoiceClick?: () => void;
}) {
  return (
    <div className={cx(styles.section, styles.gap24)}>
      <div className={styles.verticalButtons}>
        {options.map((label, index) => (
          <Button
            key={`vertical-${index}`}
            variant="outlined"
            state="default"
            size="sm"
            label={label}
            className={styles.fullButton}
            onClick={() => onOptionClick?.(index, label)}
          />
        ))}
      </div>
      <ChatMessageInput
        placeholder={messagePlaceholder}
        value={messageValue}
        onValueChange={onMessageChange}
        onSubmit={onMessageSubmit}
        onVoiceClick={onVoiceClick}
      />
    </div>
  );
}

/** Figma uitype=option-trio · 2027:1899 */
function OptionTrioView({
  options,
  onOptionClick,
  messagePlaceholder,
  messageValue,
  onMessageChange,
  onMessageSubmit,
  onVoiceClick,
}: {
  options?: string[];
  onOptionClick?: (index: number, label: string) => void;
  messagePlaceholder?: string;
  messageValue?: string;
  onMessageChange?: (value: string) => void;
  onMessageSubmit?: (value: string) => void;
  onVoiceClick?: () => void;
}) {
  const labels = options ?? [...DEFAULT_OPTION_TRIO];

  /**
   * 피그마: 첫 옵션(예) = Default(선택/활성), 나머지 = Inactive 비주얼(클릭 가능).
   * 아이콘 색은 styles.optionButton / optionButtonMuted 에서
   * color-icon-brand | color-icon-secondary 로 분기한다.
   */
  const icons = [
    <Circle key="circle" />,
    <CloseLG key="close" />,
    <Triangle key="triangle" />,
  ];

  return (
    <div className={cx(styles.section, styles.gap24)}>
      <div className={styles.optionRow}>
        {labels.slice(0, 3).map((label, index) => {
          const isInactiveVisual = index > 0;
          return (
            <Button
              key={`trio-${index}`}
              variant="outlined"
              state="default"
              size="lg"
              label={label}
              leftIcon={icons[index]}
              className={cx(
                styles.optionButton,
                isInactiveVisual && styles.optionButtonMuted
              )}
              onClick={() => onOptionClick?.(index, label)}
            />
          );
        })}
      </div>
      <ChatMessageInput
        placeholder={messagePlaceholder}
        value={messageValue}
        onValueChange={onMessageChange}
        onSubmit={onMessageSubmit}
        onVoiceClick={onVoiceClick}
      />
    </div>
  );
}

/** Figma uitype=medicine-search · 2030:1193 */
function MedicineSearchView({
  dropdownExpanded = "False",
  dropdownItems,
  onDropdownToggle,
  onDropdownItemToggle,
  onDropdownAddClick,
  onActionClick,
}: {
  dropdownExpanded?: DropdownExpanded;
  dropdownItems?: DropdownItemData[];
  onDropdownToggle?: () => void;
  onDropdownItemToggle?: (id: string) => void;
  onDropdownAddClick?: () => void;
  onActionClick?: () => void;
}) {
  /**
   * ChatInput 내부에서 Dropdown expanded를 소유하고,
   * 외부 prop 변경과 화살표 토글을 상호 연동한다.
   * (부모가 onDropdownToggle만 넘기고 상태를 갱신하지 않아도 토글이 동작)
   */
  const [expanded, setExpanded] =
    useState<DropdownExpanded>(dropdownExpanded);
  const [items, setItems] = useState<DropdownItemData[]>(
    () => dropdownItems ?? DEFAULT_MEDICINE_ITEMS
  );

  useEffect(() => {
    setExpanded(dropdownExpanded);
  }, [dropdownExpanded]);

  useEffect(() => {
    if (dropdownItems !== undefined) {
      setItems(dropdownItems);
    }
  }, [dropdownItems]);

  const { dropdownTitle, dropdownPointText } = useFuncTitleBinding(items);

  const handleToggleExpanded = () => {
    setExpanded((prev) => (prev === "True" ? "False" : "True"));
    onDropdownToggle?.();
  };

  const handleItemToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
    onDropdownItemToggle?.(id);
  };

  return (
    <div className={cx(styles.section, styles.gap24)}>
      <div
        className={styles.dropdownSlot}
        data-testid="medicine-search-dropdown"
      >
        <Dropdown
          expanded={expanded}
          title={dropdownTitle}
          pointText={dropdownPointText}
          items={items}
          onToggleExpanded={handleToggleExpanded}
          onItemToggle={handleItemToggle}
          onAddClick={onDropdownAddClick}
        />
      </div>
      <Button
        variant="default"
        state="default"
        size="md"
        label="다음"
        className={styles.fullButton}
        onClick={onActionClick}
      />
    </div>
  );
}

/** Figma uitype=file-upload · 2027:2048 */
function FileUploadView({
  onFileUploadClick,
  onActionClick,
}: {
  onFileUploadClick?: () => void;
  onActionClick?: () => void;
}) {
  return (
    <div className={cx(styles.section, styles.gap24)}>
      <button
        type="button"
        className={styles.fileDropzone}
        onClick={onFileUploadClick}
        aria-label="사진, 동영상 추가하기"
        data-testid="file-dropzone"
      >
        <span className={styles.filePlus} aria-hidden>
          +
        </span>
        <span className={styles.fileLabel}>사진, 동영상 추가하기</span>
      </button>
      <Button
        variant="outlined"
        state="default"
        size="md"
        label="아니요"
        className={cx(styles.fullButton, styles.fileDismissButton)}
        onClick={onActionClick}
      />
    </div>
  );
}

/** Figma uitype=pain-scale · 2027:1888 */
function PainScaleView({
  selectedPainLevel,
  onPainLevelSelect,
  messagePlaceholder,
  messageValue,
  onMessageChange,
  onMessageSubmit,
  onVoiceClick,
}: {
  selectedPainLevel?: ImageCardLevel | null;
  onPainLevelSelect?: (level: ImageCardLevel) => void;
  messagePlaceholder?: string;
  messageValue?: string;
  onMessageChange?: (value: string) => void;
  onMessageSubmit?: (value: string) => void;
  onVoiceClick?: () => void;
}) {
  const isControlled = selectedPainLevel !== undefined;
  const [uncontrolledLevel, setUncontrolledLevel] =
    useState<ImageCardLevel | null>(null);

  const activeLevel = isControlled
    ? selectedPainLevel
    : uncontrolledLevel;

  const handleSelect = (level: ImageCardLevel) => {
    if (!isControlled) setUncontrolledLevel(level);
    onPainLevelSelect?.(level);
  };

  const topRow = PAIN_SCALE_DATA.slice(0, 3);
  const bottomRow = PAIN_SCALE_DATA.slice(3, 5);

  return (
    <div className={cx(styles.section, styles.gap24)}>
      <div className={styles.painScale}>
        <div className={styles.painRow}>
          {topRow.map((item) => (
            <ImageCard
              key={item.level}
              level={item.level}
              imageSrc={item.imageSrc}
              alt={`${item.description} ${item.score}`}
              label={`${item.description}\n${item.score}`}
              state={activeLevel === item.level ? "active" : "default"}
              onClick={() => handleSelect(item.level)}
            />
          ))}
        </div>
        <div className={styles.painRow}>
          {bottomRow.map((item) => (
            <ImageCard
              key={item.level}
              level={item.level}
              imageSrc={item.imageSrc}
              alt={`${item.description} ${item.score}`}
              label={`${item.description}\n${item.score}`}
              state={activeLevel === item.level ? "active" : "default"}
              onClick={() => handleSelect(item.level)}
            />
          ))}
        </div>
      </div>
      <ChatMessageInput
        placeholder={messagePlaceholder}
        value={messageValue}
        onValueChange={onMessageChange}
        onSubmit={onMessageSubmit}
        onVoiceClick={onVoiceClick}
      />
    </div>
  );
}

/** Figma uitype=checkbox-list · 2027:2091 */
function CheckboxListView({
  checklistItems,
  onChecklistChange,
  onActionClick,
  messagePlaceholder,
  messageValue,
  onMessageChange,
  onMessageSubmit,
  onVoiceClick,
}: {
  checklistItems?: ChecklistItem[];
  onChecklistChange?: (selectedIds: string[]) => void;
  onActionClick?: () => void;
  messagePlaceholder?: string;
  messageValue?: string;
  onMessageChange?: (value: string) => void;
  onMessageSubmit?: (value: string) => void;
  onVoiceClick?: () => void;
}) {
  /**
   * 체크 선택 수에 따라 '다음' 버튼 Default / Inactive 실시간 전환.
   * - 1개 이상 선택 → default(활성)
   * - 0개 선택 → inactive(비활성)
   */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isActionInactive = selectedIds.length === 0;

  const handleChecklistChange = (ids: string[]) => {
    setSelectedIds(ids);
    onChecklistChange?.(ids);
  };

  return (
    <div className={cx(styles.section, styles.gap24)}>
      <div className={styles.checklistBlock}>
        <Checklist items={checklistItems} onChange={handleChecklistChange} />
        <Button
          variant="default"
          state={isActionInactive ? "inactive" : "default"}
          size="md"
          label="다음"
          className={styles.fullButton}
          onClick={onActionClick}
        />
      </div>
      <ChatMessageInput
        placeholder={messagePlaceholder}
        value={messageValue}
        onValueChange={onMessageChange}
        onSubmit={onMessageSubmit}
        onVoiceClick={onVoiceClick}
      />
    </div>
  );
}

/* ========================================
 * Component — Figma ChatInput · 2030:1233
 * ======================================== */

export function ChatInput({
  uitype = "multi-upload",
  mediaUrls,
  onMediaEmptyClick,
  onMediaRemove,
  options,
  onOptionClick,
  dropdownExpanded,
  dropdownTitle: _dropdownTitle,
  dropdownPointText: _dropdownPointText,
  dropdownItems,
  onDropdownToggle,
  onDropdownItemToggle,
  onDropdownAddClick,
  onFileUploadClick,
  selectedPainLevel,
  onPainLevelSelect,
  checklistItems,
  onChecklistChange,
  messagePlaceholder = DEFAULT_MESSAGE_PLACEHOLDER,
  messageValue,
  onMessageChange,
  onMessageSubmit,
  onVoiceClick,
  onActionClick,
  actionInactive: _actionInactive,
  className,
  ...rest
}: ChatInputProps) {
  void _actionInactive;
  void _dropdownTitle;
  void _dropdownPointText;

  return (
    <div
      className={cx(
        styles.root,
        uitype === "multi-upload" && styles.rootMultiUpload,
        className
      )}
      data-uitype={uitype}
      {...rest}
    >
      {uitype === "multi-upload" ? (
        <MultiUploadView
          mediaUrls={mediaUrls}
          onMediaEmptyClick={onMediaEmptyClick}
          onMediaRemove={onMediaRemove}
          onActionClick={onActionClick}
        />
      ) : null}

      {uitype === "vertical-select" ? (
        <VerticalSelectView
          options={options}
          onOptionClick={onOptionClick}
          messagePlaceholder={messagePlaceholder}
          messageValue={messageValue}
          onMessageChange={onMessageChange}
          onMessageSubmit={onMessageSubmit}
          onVoiceClick={onVoiceClick}
        />
      ) : null}

      {uitype === "option-trio" ? (
        <OptionTrioView
          options={options}
          onOptionClick={onOptionClick}
          messagePlaceholder={messagePlaceholder}
          messageValue={messageValue}
          onMessageChange={onMessageChange}
          onMessageSubmit={onMessageSubmit}
          onVoiceClick={onVoiceClick}
        />
      ) : null}

      {uitype === "medicine-search" ? (
        <MedicineSearchView
          dropdownExpanded={dropdownExpanded}
          dropdownItems={dropdownItems}
          onDropdownToggle={onDropdownToggle}
          onDropdownItemToggle={onDropdownItemToggle}
          onDropdownAddClick={onDropdownAddClick}
          onActionClick={onActionClick}
        />
      ) : null}

      {uitype === "file-upload" ? (
        <FileUploadView
          onFileUploadClick={onFileUploadClick}
          onActionClick={onActionClick}
        />
      ) : null}

      {uitype === "pain-scale" ? (
        <PainScaleView
          selectedPainLevel={selectedPainLevel}
          onPainLevelSelect={onPainLevelSelect}
          messagePlaceholder={messagePlaceholder}
          messageValue={messageValue}
          onMessageChange={onMessageChange}
          onMessageSubmit={onMessageSubmit}
          onVoiceClick={onVoiceClick}
        />
      ) : null}

      {uitype === "checkbox-list" ? (
        <CheckboxListView
          checklistItems={checklistItems}
          onChecklistChange={onChecklistChange}
          onActionClick={onActionClick}
          messagePlaceholder={messagePlaceholder}
          messageValue={messageValue}
          onMessageChange={onMessageChange}
          onMessageSubmit={onMessageSubmit}
          onVoiceClick={onVoiceClick}
        />
      ) : null}
    </div>
  );
}

export default ChatInput;
