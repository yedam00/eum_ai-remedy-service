import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import {
  Dropdown,
  type DropdownExpanded,
  type DropdownItemData,
} from "./index";

const SAMPLE_ITEMS: DropdownItemData[] = [
  { id: "1", label: "당뇨약", meta: "아침/저녁", selected: true },
  { id: "2", label: "고지혈증약", meta: "아침/저녁", selected: true },
  { id: "3", label: "고혈압약", meta: "아침/저녁", selected: true },
  { id: "4", label: "진통제", meta: "아침/저녁", selected: false },
];

const meta = {
  title: "Commons/Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    expanded: {
      control: "select",
      options: ["False", "True"],
      description: "Figma Expanded — False | True",
    },
    title: {
      control: "text",
      description: "드롭다운 헤더 제목",
    },
    pointText: {
      control: "text",
      description: "우측 선택 상태 텍스트",
    },
    items: { control: false },
    onToggleExpanded: { control: false },
    onItemToggle: { control: false },
    onAddClick: { control: false },
    className: { control: false },
  },
  args: {
    expanded: "False",
    title: "복약 중인 약",
    pointText: "+3개 선택됨",
    items: SAMPLE_ITEMS,
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Expanded
 * ======================================== */

export const ExpandedFalse: Story = {
  name: "Expanded / False",
  args: {
    expanded: "False",
  },
};

export const ExpandedTrue: Story = {
  name: "Expanded / True",
  args: {
    expanded: "True",
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomTitle: Story = {
  name: "Content / Custom Title",
  args: {
    expanded: "False",
    title: "복용 중인 영양제",
    pointText: "+2개 선택됨",
  },
};

export const PartialSelection: Story = {
  name: "Content / Partial Selection",
  args: {
    expanded: "True",
    pointText: "+2개 선택됨",
    items: [
      { id: "1", label: "당뇨약", meta: "아침/저녁", selected: true },
      { id: "2", label: "고지혈증약", meta: "아침/저녁", selected: false },
      { id: "3", label: "고혈압약", meta: "아침/저녁", selected: true },
      { id: "4", label: "진통제", meta: "아침/저녁", selected: false },
    ],
  },
};

export const EmptySelection: Story = {
  name: "Content / Empty Selection",
  args: {
    expanded: "True",
    pointText: "+0개 선택됨",
    items: [
      { id: "1", label: "당뇨약", meta: "아침/저녁", selected: false },
      { id: "2", label: "고지혈증약", meta: "아침/저녁", selected: false },
      { id: "3", label: "고혈압약", meta: "아침/저녁", selected: false },
      { id: "4", label: "진통제", meta: "아침/저녁", selected: false },
    ],
  },
};

/* ========================================
 * Interactive
 * ======================================== */

function InteractiveDropdown() {
  const [expanded, setExpanded] = useState<DropdownExpanded>("False");
  const [items, setItems] = useState<DropdownItemData[]>(SAMPLE_ITEMS);

  const selectedCount = items.filter((item) => item.selected).length;

  return (
    <Dropdown
      expanded={expanded}
      title="복약 중인 약"
      pointText={`+${selectedCount}개 선택됨`}
      items={items}
      onToggleExpanded={() =>
        setExpanded((prev) => (prev === "True" ? "False" : "True"))
      }
      onItemToggle={(id) =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
          )
        )
      }
      onAddClick={() => {
        // Storybook action placeholder
      }}
    />
  );
}

export const Interactive: Story = {
  name: "Interactive / Toggle",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveDropdown />,
};

/* ========================================
 * Matrix — Expanded
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const expandedValues = ["False", "True"] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        {expandedValues.map((expanded) => (
          <div
            key={expanded}
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
              expanded={expanded}
            </div>
            <Dropdown
              expanded={expanded}
              title="복약 중인 약"
              pointText="+3개 선택됨"
              items={SAMPLE_ITEMS}
            />
          </div>
        ))}
      </div>
    );
  },
};
