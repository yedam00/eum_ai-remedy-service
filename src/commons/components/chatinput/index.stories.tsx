import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import {
  ChatInput,
  type ChatInputProps,
  type ChatInputUiType,
} from "./index";
import type { DropdownItemData } from "../dropdown";
import type { ChecklistItem } from "../checklist";
import type { ImageCardLevel } from "../image-card";

/* ========================================
 * Sample data
 * ======================================== */

const SAMPLE_MEDIA_URLS: Array<string | undefined> = [
  "/images/level1.png",
  "/images/level2.png",
  undefined,
  undefined,
  undefined,
  undefined,
];

const SAMPLE_DROPDOWN_ITEMS: DropdownItemData[] = [
  { id: "1", label: "당뇨약", meta: "아침/저녁", selected: true },
  { id: "2", label: "고지혈증약", meta: "아침/저녁", selected: true },
  { id: "3", label: "고혈압약", meta: "아침/저녁", selected: true },
  { id: "4", label: "진통제", meta: "아침/저녁", selected: false },
];

const SAMPLE_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "1", label: "어지럽거나 속이 메스껍고, 토할 것 같다" },
  { id: "2", label: "가슴이 답답하거나 통증이 있다" },
  { id: "3", label: "숨이 차거나 호흡이 어렵다" },
  { id: "4", label: "극심한 피로감이 있다" },
];

const UITYPES: ChatInputUiType[] = [
  "multi-upload",
  "vertical-select",
  "option-trio",
  "medicine-search",
  "file-upload",
  "pain-scale",
  "checkbox-list",
];

const meta = {
  title: "Commons/Components/ChatInput",
  component: ChatInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 393, padding: 16, boxSizing: "border-box" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    uitype: {
      control: "select",
      options: UITYPES,
      description:
        "Figma uitype — multi-upload | vertical-select | option-trio | medicine-search | file-upload | pain-scale | checkbox-list",
    },
    mediaUrls: { control: false },
    onMediaEmptyClick: { control: false },
    onMediaRemove: { control: false },
    options: { control: false },
    onOptionClick: { control: false },
    dropdownExpanded: {
      control: "select",
      options: ["False", "True"],
      description: "medicine-search: Dropdown expanded",
    },
    dropdownItems: { control: false },
    onDropdownToggle: { control: false },
    onDropdownItemToggle: { control: false },
    onDropdownAddClick: { control: false },
    onFileUploadClick: { control: false },
    selectedPainLevel: {
      control: "select",
      options: [null, 1, 2, 3, 4, 5],
      description: "pain-scale: 선택된 레벨 (controlled)",
    },
    onPainLevelSelect: { control: false },
    checklistItems: { control: false },
    onChecklistChange: { control: false },
    messagePlaceholder: {
      control: "text",
      description: "MessageInput placeholder",
    },
    messageValue: { control: "text" },
    onMessageChange: { control: false },
    onMessageSubmit: { control: false },
    onVoiceClick: { control: false },
    onActionClick: { control: false },
    actionInactive: {
      control: "boolean",
      description: "checkbox-list: 액션 버튼 비활성",
    },
    className: { control: false },
  },
  args: {
    uitype: "multi-upload",
    messagePlaceholder: "두통, 어지러움",
    onMediaEmptyClick: fn(),
    onMediaRemove: fn(),
    onOptionClick: fn(),
    onDropdownToggle: fn(),
    onDropdownItemToggle: fn(),
    onDropdownAddClick: fn(),
    onFileUploadClick: fn(),
    onPainLevelSelect: fn(),
    onChecklistChange: fn(),
    onMessageChange: fn(),
    onMessageSubmit: fn(),
    onVoiceClick: fn(),
    onActionClick: fn(),
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * UiType
 * ======================================== */

export const UiTypeMultiUpload: Story = {
  name: "UiType / multi-upload",
  args: {
    uitype: "multi-upload",
  },
};

export const UiTypeMultiUploadFilled: Story = {
  name: "UiType / multi-upload (filled)",
  args: {
    uitype: "multi-upload",
    mediaUrls: SAMPLE_MEDIA_URLS,
  },
};

export const UiTypeVerticalSelect: Story = {
  name: "UiType / vertical-select",
  args: {
    uitype: "vertical-select",
  },
};

export const UiTypeOptionTrio: Story = {
  name: "UiType / option-trio",
  args: {
    uitype: "option-trio",
  },
};

export const UiTypeMedicineSearch: Story = {
  name: "UiType / medicine-search",
  args: {
    uitype: "medicine-search",
    dropdownExpanded: "False",
    dropdownItems: SAMPLE_DROPDOWN_ITEMS,
  },
};

export const UiTypeMedicineSearchExpanded: Story = {
  name: "UiType / medicine-search (expanded)",
  args: {
    uitype: "medicine-search",
    dropdownExpanded: "True",
    dropdownItems: SAMPLE_DROPDOWN_ITEMS,
  },
};

export const UiTypeFileUpload: Story = {
  name: "UiType / file-upload",
  args: {
    uitype: "file-upload",
  },
};

export const UiTypePainScale: Story = {
  name: "UiType / pain-scale",
  args: {
    uitype: "pain-scale",
  },
};

export const UiTypePainScaleSelected: Story = {
  name: "UiType / pain-scale (selected)",
  args: {
    uitype: "pain-scale",
    selectedPainLevel: 3,
  },
};

export const UiTypeCheckboxList: Story = {
  name: "UiType / checkbox-list",
  args: {
    uitype: "checkbox-list",
    checklistItems: SAMPLE_CHECKLIST_ITEMS,
    actionInactive: true,
  },
};

export const UiTypeCheckboxListActive: Story = {
  name: "UiType / checkbox-list (action active)",
  args: {
    uitype: "checkbox-list",
    checklistItems: SAMPLE_CHECKLIST_ITEMS,
    actionInactive: false,
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomOptions: Story = {
  name: "Content / Custom Options",
  args: {
    uitype: "vertical-select",
    options: ["방금 전", "1시간 이내", "오늘", "어제 이전"],
  },
};

export const CustomMessagePlaceholder: Story = {
  name: "Content / Custom Message Placeholder",
  args: {
    uitype: "option-trio",
    messagePlaceholder: "증상을 자유롭게 입력해 주세요",
  },
};

/* ========================================
 * Interactive
 * ======================================== */

function InteractiveMedicineSearch() {
  const [expanded, setExpanded] = useState<"False" | "True">("False");
  const [items, setItems] = useState<DropdownItemData[]>(SAMPLE_DROPDOWN_ITEMS);

  return (
    <ChatInput
      uitype="medicine-search"
      dropdownExpanded={expanded}
      dropdownItems={items}
      onDropdownToggle={() =>
        setExpanded((prev) => (prev === "True" ? "False" : "True"))
      }
      onDropdownItemToggle={(id) =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
          )
        )
      }
      onDropdownAddClick={fn()}
      onActionClick={fn()}
    />
  );
}

function InteractivePainScale() {
  const [level, setLevel] = useState<ImageCardLevel | null>(null);
  const [message, setMessage] = useState("");

  return (
    <ChatInput
      uitype="pain-scale"
      selectedPainLevel={level}
      onPainLevelSelect={setLevel}
      messageValue={message}
      onMessageChange={setMessage}
      onMessageSubmit={fn()}
      onVoiceClick={fn()}
    />
  );
}

function InteractiveCheckboxList() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <ChatInput
      uitype="checkbox-list"
      checklistItems={SAMPLE_CHECKLIST_ITEMS}
      onChecklistChange={setSelectedIds}
      actionInactive={selectedIds.length === 0}
      onActionClick={fn()}
      onMessageChange={fn()}
      onMessageSubmit={fn()}
      onVoiceClick={fn()}
    />
  );
}

export const InteractiveMedicine: Story = {
  name: "Interactive / Medicine Search",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveMedicineSearch />,
};

export const InteractivePain: Story = {
  name: "Interactive / Pain Scale",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractivePainScale />,
};

export const InteractiveChecklist: Story = {
  name: "Interactive / Checkbox List",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveCheckboxList />,
};

/* ========================================
 * Matrix — All UiTypes
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const variants: Array<{ label: string; props: ChatInputProps }> = [
      { label: "uitype=multi-upload", props: { uitype: "multi-upload" } },
      {
        label: "uitype=multi-upload (filled)",
        props: { uitype: "multi-upload", mediaUrls: SAMPLE_MEDIA_URLS },
      },
      {
        label: "uitype=vertical-select",
        props: { uitype: "vertical-select" },
      },
      { label: "uitype=option-trio", props: { uitype: "option-trio" } },
      {
        label: "uitype=medicine-search (collapsed)",
        props: {
          uitype: "medicine-search",
          dropdownExpanded: "False",
          dropdownItems: SAMPLE_DROPDOWN_ITEMS,
        },
      },
      {
        label: "uitype=medicine-search (expanded)",
        props: {
          uitype: "medicine-search",
          dropdownExpanded: "True",
          dropdownItems: SAMPLE_DROPDOWN_ITEMS,
        },
      },
      { label: "uitype=file-upload", props: { uitype: "file-upload" } },
      { label: "uitype=pain-scale", props: { uitype: "pain-scale" } },
      {
        label: "uitype=pain-scale (selected=3)",
        props: { uitype: "pain-scale", selectedPainLevel: 3 },
      },
      {
        label: "uitype=checkbox-list (inactive)",
        props: {
          uitype: "checkbox-list",
          checklistItems: SAMPLE_CHECKLIST_ITEMS,
          actionInactive: true,
        },
      },
      {
        label: "uitype=checkbox-list (active)",
        props: {
          uitype: "checkbox-list",
          checklistItems: SAMPLE_CHECKLIST_ITEMS,
          actionInactive: false,
        },
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {variants.map(({ label, props }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
            }}
          >
            <div
              style={{
                fontFamily: "var(--typography-ko-font-family)",
                fontSize: 14,
                color: "var(--color-text-secondary)",
              }}
            >
              {label}
            </div>
            <ChatInput
              {...props}
              onMediaEmptyClick={fn()}
              onMediaRemove={fn()}
              onOptionClick={fn()}
              onDropdownToggle={fn()}
              onDropdownItemToggle={fn()}
              onDropdownAddClick={fn()}
              onFileUploadClick={fn()}
              onPainLevelSelect={fn()}
              onChecklistChange={fn()}
              onMessageChange={fn()}
              onMessageSubmit={fn()}
              onVoiceClick={fn()}
              onActionClick={fn()}
            />
          </div>
        ))}
      </div>
    );
  },
};
