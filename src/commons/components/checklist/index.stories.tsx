import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Checklist, type ChecklistItem } from "./index";

const DEFAULT_LABEL = "어지럽거나 속이 메스껍고, 토할 것 같다";

const ITEMS_2: ChecklistItem[] = [
  { id: "1", label: DEFAULT_LABEL },
  { id: "2", label: DEFAULT_LABEL },
];

const ITEMS_3: ChecklistItem[] = [
  { id: "1", label: DEFAULT_LABEL },
  { id: "2", label: DEFAULT_LABEL },
  { id: "3", label: DEFAULT_LABEL },
];

const ITEMS_4: ChecklistItem[] = [
  { id: "1", label: DEFAULT_LABEL },
  { id: "2", label: DEFAULT_LABEL },
  { id: "3", label: DEFAULT_LABEL },
  { id: "4", label: DEFAULT_LABEL },
];

const CUSTOM_ITEMS: ChecklistItem[] = [
  { id: "dizzy", label: "어지럽거나 속이 메스껍고, 토할 것 같다" },
  { id: "pain", label: "가슴이 답답하거나 통증이 있다" },
  { id: "breath", label: "숨이 차거나 호흡이 어렵다" },
  { id: "fatigue", label: "극심한 피로감이 있다" },
];

const meta = {
  title: "Commons/Components/Checklist",
  component: Checklist,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: {
      control: false,
      description: "체크리스트 항목 (2~4개). 미전달 시 피그마 기본 4개 문구 사용",
    },
    onChange: {
      control: false,
      description: "선택된 항목 ID 목록 변경 시 호출",
    },
    className: { control: false },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checklist>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Item Count — 2 ~ 4
 * ======================================== */

export const Items2: Story = {
  name: "Items / 2",
  args: {
    items: ITEMS_2,
  },
};

export const Items3: Story = {
  name: "Items / 3",
  args: {
    items: ITEMS_3,
  },
};

export const Items4: Story = {
  name: "Items / 4",
  args: {
    items: ITEMS_4,
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomLabels: Story = {
  name: "Content / Custom Labels",
  args: {
    items: CUSTOM_ITEMS,
  },
};

/* ========================================
 * Matrix — Item Count
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const variants: Array<{ label: string; items?: ChecklistItem[] }> = [
      { label: "default (4)", items: undefined },
      { label: "items=2", items: ITEMS_2 },
      { label: "items=3", items: ITEMS_3 },
      { label: "items=4", items: ITEMS_4 },
      { label: "custom labels", items: CUSTOM_ITEMS },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        {variants.map(({ label, items }) => (
          <div
            key={label}
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
              {label}
            </div>
            <Checklist items={items} onChange={fn()} />
          </div>
        ))}
      </div>
    );
  },
};
