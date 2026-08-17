import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ChatInputUIType } from "@/commons/constants/enum";
import type { ChatInputUiType } from "../index";
import type { ChecklistItem } from "../../checklist";
import type { DropdownItemData } from "../../dropdown";
import type { ImageCardLevel } from "../../image-card";

/* ========================================
 * Types
 * ======================================== */

export type BindingMessage = {
  id: string;
  variant: "ai" | "user";
  text: string;
  hasImage: boolean;
  /** 업로드된 이미지 URL 전체 배열 (누락 없이 원본 전달) */
  imageUrls?: string[];
};

type PainScaleChoice = {
  level: ImageCardLevel;
  score: string;
  description: string;
};

/* ========================================
 * Constants — Mock 질문 / 선택지 스태킹
 * ======================================== */

const VARIANT_SEQUENCE: ChatInputUIType[] = [
  ChatInputUIType.OPTION_TRIO,
  ChatInputUIType.VERTICAL_SELECT,
  ChatInputUIType.MEDICINE_SEARCH,
  ChatInputUIType.PAIN_SCALE,
  ChatInputUIType.CHECKBOX_LIST,
  ChatInputUIType.FILE_UPLOAD,
];

const UI_TYPE_MAP: Record<ChatInputUIType, ChatInputUiType> = {
  [ChatInputUIType.OPTION_TRIO]: "option-trio",
  [ChatInputUIType.VERTICAL_SELECT]: "vertical-select",
  [ChatInputUIType.MEDICINE_SEARCH]: "medicine-search",
  [ChatInputUIType.PAIN_SCALE]: "pain-scale",
  [ChatInputUIType.CHECKBOX_LIST]: "checkbox-list",
  [ChatInputUIType.FILE_UPLOAD]: "file-upload",
};

const MOCK_QUESTIONS: Record<ChatInputUIType, string> = {
  [ChatInputUIType.OPTION_TRIO]: "최근에 비슷한 증상이 있었나요?",
  [ChatInputUIType.VERTICAL_SELECT]: "증상이 얼마나 오래 지속되었나요?",
  [ChatInputUIType.MEDICINE_SEARCH]: "복용 중인 약이 있나요?",
  [ChatInputUIType.PAIN_SCALE]: "통증 정도는 어느 정도인가요?",
  [ChatInputUIType.CHECKBOX_LIST]: "함께 나타나는 증상이 있나요?",
  [ChatInputUIType.FILE_UPLOAD]: "환부 사진을 첨부해 주세요.",
};

const OPTION_TRIO_OPTIONS = ["예", "아니오", "모르겠음"];
const VERTICAL_SELECT_OPTIONS = ["분", "시", "며칠에 걸침", "수주에 걸침"];

const MEDICINE_ITEMS: DropdownItemData[] = [
  { id: "1", label: "당뇨약", meta: "아침/저녁", selected: true },
  { id: "2", label: "고지혈증약", meta: "아침/저녁", selected: true },
  { id: "3", label: "고혈압약", meta: "아침/저녁", selected: true },
  { id: "4", label: "진통제", meta: "아침/저녁", selected: true },
];

const PAIN_SCALE_CHOICES: PainScaleChoice[] = [
  { level: 1, score: "1~2", description: "조금 아프다" },
  { level: 2, score: "3~4", description: "조금 아프다" },
  { level: 3, score: "5~6", description: "조금 아프다" },
  { level: 4, score: "7~8", description: "조금 아프다" },
  { level: 5, score: "9~10", description: "조금 아프다" },
];

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "1", label: "어지럽거나 속이 메스껍고, 토할 것 같다" },
  { id: "2", label: "가슴이 답답하거나 통증이 있다" },
  { id: "3", label: "숨이 차거나 호흡이 어렵다" },
  { id: "4", label: "극심한 피로감이 있다" },
];

const FILE_UPLOAD_GUIDE_TEXT = "사진, 동영상 추가하기";
const NEXT_VARIANT_DELAY_MS = 500;
const MAX_FILES = 6;

const GUIDE_TEXT: Record<ChatInputUIType, string> = {
  [ChatInputUIType.OPTION_TRIO]: OPTION_TRIO_OPTIONS[0],
  [ChatInputUIType.VERTICAL_SELECT]: VERTICAL_SELECT_OPTIONS[0],
  [ChatInputUIType.MEDICINE_SEARCH]: MEDICINE_ITEMS[0].label,
  [ChatInputUIType.PAIN_SCALE]: PAIN_SCALE_CHOICES[0].description,
  [ChatInputUIType.CHECKBOX_LIST]: CHECKLIST_ITEMS[0].label,
  [ChatInputUIType.FILE_UPLOAD]: FILE_UPLOAD_GUIDE_TEXT,
};

/* ========================================
 * Helpers
 * ======================================== */

const createMessageId = (): string =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createAiMessage = (uiType: ChatInputUIType): BindingMessage => ({
  id: createMessageId(),
  variant: "ai",
  text: MOCK_QUESTIONS[uiType],
  hasImage: false,
});

const createUserMessage = (
  text: string,
  imageUrls?: string[]
): BindingMessage => {
  const resolvedUrls = imageUrls?.filter(Boolean) ?? [];
  return {
    id: createMessageId(),
    variant: "user",
    text,
    hasImage: resolvedUrls.length > 0,
    imageUrls: resolvedUrls.length > 0 ? resolvedUrls : undefined,
  };
};

const joinLabels = (labels: string[]): string => labels.join(", ");

/* ========================================
 * Hook
 * ======================================== */

export function useFuncBinding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<BindingMessage[]>(() => [
    createAiMessage(VARIANT_SEQUENCE[0]),
  ]);
  const [dropdownItems, setDropdownItems] =
    useState<DropdownItemData[]>(MEDICINE_ITEMS);
  const [selectedChecklistIds, setSelectedChecklistIds] = useState<string[]>(
    []
  );
  const [mediaUrls, setMediaUrls] = useState<Array<string | undefined>>([]);

  const stepIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const isAdvancingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const currentUiType = VARIANT_SEQUENCE[stepIndex];
  const hasFiles = mediaUrls.some((url) => Boolean(url));
  const uitype: ChatInputUiType =
    currentUiType === ChatInputUIType.FILE_UPLOAD && hasFiles
      ? "multi-upload"
      : UI_TYPE_MAP[currentUiType];
  const messagePlaceholder = GUIDE_TEXT[currentUiType];
  const options =
    currentUiType === ChatInputUIType.OPTION_TRIO
      ? OPTION_TRIO_OPTIONS
      : currentUiType === ChatInputUIType.VERTICAL_SELECT
        ? VERTICAL_SELECT_OPTIONS
        : undefined;

  const advanceToNextVariant = () => {
    const nextIndex = stepIndexRef.current + 1;
    if (nextIndex >= VARIANT_SEQUENCE.length) {
      isAdvancingRef.current = false;
      return;
    }

    timerRef.current = window.setTimeout(() => {
      stepIndexRef.current = nextIndex;
      setStepIndex(nextIndex);
      setSelectedChecklistIds([]);
      setMediaUrls([]);
      setMessages((prev) => [
        ...prev,
        createAiMessage(VARIANT_SEQUENCE[nextIndex]),
      ]);
      isAdvancingRef.current = false;
    }, NEXT_VARIANT_DELAY_MS);
  };

  const submitUserAnswer = (text: string, imageUrls?: string[]) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    setMessages((prev) => [...prev, createUserMessage(text, imageUrls)]);
    advanceToNextVariant();
  };

  const handleOptionClick = (_index: number, label: string) => {
    submitUserAnswer(label);
  };

  const handlePainLevelSelect = (level: ImageCardLevel) => {
    const choice = PAIN_SCALE_CHOICES.find((item) => item.level === level);
    if (!choice) return;
    submitUserAnswer(`${choice.description} ${choice.score}`);
  };

  const handleChecklistChange = (selectedIds: string[]) => {
    setSelectedChecklistIds(selectedIds);
  };

  const handleDropdownItemToggle = (id: string) => {
    setDropdownItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMediaEmptyClick = (_index: number) => {
    fileInputRef.current?.click();
  };

  const handleMediaRemove = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remain = MAX_FILES - mediaUrls.filter(Boolean).length;
    const nextUrls = Array.from(files)
      .slice(0, remain)
      .map((file) => URL.createObjectURL(file));

    setMediaUrls((prev) => [...prev, ...nextUrls].slice(0, MAX_FILES));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleActionClick = () => {
    if (currentUiType === ChatInputUIType.MEDICINE_SEARCH) {
      const selected = dropdownItems
        .filter((item) => item.selected)
        .map((item) => item.label);
      submitUserAnswer(joinLabels(selected));
      return;
    }

    if (currentUiType === ChatInputUIType.CHECKBOX_LIST) {
      const selected = CHECKLIST_ITEMS.filter((item) =>
        selectedChecklistIds.includes(item.id)
      ).map((item) => item.label);
      submitUserAnswer(joinLabels(selected));
      return;
    }

    if (currentUiType === ChatInputUIType.FILE_UPLOAD) {
      const uploaded = mediaUrls.filter((url): url is string => Boolean(url));
      if (uploaded.length > 0) {
        submitUserAnswer("", uploaded);
        return;
      }
      submitUserAnswer("아니요");
    }
  };

  const handleMessageSubmit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    submitUserAnswer(trimmed);
  };

  return {
    messages,
    uitype,
    options,
    messagePlaceholder,
    dropdownItems,
    checklistItems: CHECKLIST_ITEMS,
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
  };
}
