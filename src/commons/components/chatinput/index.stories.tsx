import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import {
  ChatInput,
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
  { id: "2", label: "어지럽거나 속이 메스껍고, 토할 것 같다" },
  { id: "3", label: "어지럽거나 속이 메스껍고, 토할 것 같다" },
  { id: "4", label: "어지럽거나 속이 메스껍고, 토할 것 같다" },
];

const UI_TYPES: ChatInputUiType[] = [
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
  argTypes: {
    uitype: {
      control: "select",
      options: UI_TYPES,
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
      description: "medicine-search: Dropdown Expanded",
    },
    dropdownItems: { control: false },
    onDropdownToggle: { control: false },
    onDropdownItemToggle: { control: false },
    onDropdownAddClick: { control: false },
    onFileUploadClick: { control: false },
    selectedPainLevel: {
      control: "select",
      options: [null, 1, 2, 3, 4, 5],
      description: "pain-scale: 선택된 레벨",
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
      description: "checkbox-list: 액션 버튼 inactive",
    },
    className: { control: false },
  },
  args: {
    uitype: "multi-upload",
    messagePlaceholder: "두통, 어지러움",
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
  name: "UiType / Multi Upload",
  args: {
    uitype: "multi-upload",
  },
};

export const UiTypeMultiUploadFilled: Story = {
  name: "UiType / Multi Upload Filled",
  args: {
    uitype: "multi-upload",
    mediaUrls: SAMPLE_MEDIA_URLS,
  },
};

export const UiTypeVerticalSelect: Story = {
  name: "UiType / Vertical Select",
  args: {
    uitype: "vertical-select",
  },
};

export const UiTypeOptionTrio: Story = {
  name: "UiType / Option Trio",
  args: {
    uitype: "option-trio",
  },
};

export const UiTypeMedicineSearch: Story = {
  name: "UiType / Medicine Search",
  args: {
    uitype: "medicine-search",
    dropdownExpanded: "False",
    dropdownItems: SAMPLE_DROPDOWN_ITEMS,
  },
};

export const UiTypeMedicineSearchExpanded: Story = {
  name: "UiType / Medicine Search Expanded",
  args: {
    uitype: "medicine-search",
    dropdownExpanded: "True",
    dropdownItems: SAMPLE_DROPDOWN_ITEMS,
  },
};

export const UiTypeFileUpload: Story = {
  name: "UiType / File Upload",
  args: {
    uitype: "file-upload",
  },
};

export const UiTypePainScale: Story = {
  name: "UiType / Pain Scale",
  args: {
    uitype: "pain-scale",
  },
};

export const UiTypePainScaleSelected: Story = {
  name: "UiType / Pain Scale Selected",
  args: {
    uitype: "pain-scale",
    selectedPainLevel: 3,
  },
};

export const UiTypeCheckboxList: Story = {
  name: "UiType / Checkbox List",
  args: {
    uitype: "checkbox-list",
    checklistItems: SAMPLE_CHECKLIST_ITEMS,
    actionInactive: true,
  },
};

export const UiTypeCheckboxListActive: Story = {
  name: "UiType / Checkbox List Active",
  args: {
    uitype: "checkbox-list",
    checklistItems: SAMPLE_CHECKLIST_ITEMS,
    actionInactive: false,
  },
};

/* ========================================
 * Interactive
 * ======================================== */

function InteractiveChatInput({ uitype }: { uitype: ChatInputUiType }) {
  const [messageValue, setMessageValue] = useState("");
  const [dropdownExpanded, setDropdownExpanded] = useState<"False" | "True">(
    "False"
  );
  const [dropdownItems, setDropdownItems] =
    useState<DropdownItemData[]>(SAMPLE_DROPDOWN_ITEMS);
  const [selectedPainLevel, setSelectedPainLevel] =
    useState<ImageCardLevel | null>(null);
  const [actionInactive, setActionInactive] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<Array<string | undefined>>([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  return (
    <ChatInput
      uitype={uitype}
      mediaUrls={mediaUrls}
      onMediaEmptyClick={(index) =>
        setMediaUrls((prev) => {
          const next = [...prev];
          next[index] = `/images/level${(index % 5) + 1}.png`;
          return next;
        })
      }
      onMediaRemove={(index) =>
        setMediaUrls((prev) => {
          const next = [...prev];
          next[index] = undefined;
          return next;
        })
      }
      dropdownExpanded={dropdownExpanded}
      dropdownItems={dropdownItems}
      onDropdownToggle={() =>
        setDropdownExpanded((prev) => (prev === "True" ? "False" : "True"))
      }
      onDropdownItemToggle={(id) =>
        setDropdownItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
          )
        )
      }
      selectedPainLevel={selectedPainLevel}
      onPainLevelSelect={setSelectedPainLevel}
      checklistItems={SAMPLE_CHECKLIST_ITEMS}
      onChecklistChange={(selectedIds) =>
        setActionInactive(selectedIds.length === 0)
      }
      actionInactive={actionInactive}
      messageValue={messageValue}
      onMessageChange={setMessageValue}
      onMessageSubmit={() => setMessageValue("")}
    />
  );
}

export const InteractiveMultiUpload: Story = {
  name: "Interactive / Multi Upload",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveChatInput uitype="multi-upload" />,
};

export const InteractiveMedicineSearch: Story = {
  name: "Interactive / Medicine Search",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveChatInput uitype="medicine-search" />,
};

export const InteractivePainScale: Story = {
  name: "Interactive / Pain Scale",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveChatInput uitype="pain-scale" />,
};

export const InteractiveCheckboxList: Story = {
  name: "Interactive / Checkbox List",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveChatInput uitype="checkbox-list" />,
};

/* ========================================
 * Matrix — All UiTypes
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All UiTypes",
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 48,
        alignItems: "flex-start",
      }}
    >
      {UI_TYPES.map((uitype) => (
        <div
          key={uitype}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "var(--typography-ko-font-family)",
              fontSize: 14,
              color: "var(--color-text-secondary)",
            }}
          >
            uitype={uitype}
          </div>
          <ChatInput
            uitype={uitype}
            mediaUrls={
              uitype === "multi-upload" ? SAMPLE_MEDIA_URLS : undefined
            }
            dropdownExpanded={
              uitype === "medicine-search" ? "True" : undefined
            }
            dropdownItems={
              uitype === "medicine-search" ? SAMPLE_DROPDOWN_ITEMS : undefined
            }
            checklistItems={
              uitype === "checkbox-list" ? SAMPLE_CHECKLIST_ITEMS : undefined
            }
            actionInactive={uitype === "checkbox-list" ? true : undefined}
          />
        </div>
      ))}
    </div>
  ),
};
