import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ChangeEvent } from "react";
import { fn } from "storybook/test";
import { SearchBar, type SearchBarState } from "./index";

const STATES: SearchBarState[] = ["default", "active"];

const meta = {
  title: "Commons/Components/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 361, boxSizing: "border-box" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    state: {
      control: "select",
      options: STATES,
      description:
        "Figma State — Default | Active (미지정 시 value 유무로 자동 전환)",
    },
    placeholder: {
      control: "text",
      description: "플레이스홀더 (기본: 아픈 곳을 입력하세요)",
    },
    value: {
      control: "text",
      description: "controlled value",
    },
    defaultValue: {
      control: "text",
      description: "uncontrolled 초기값",
    },
    disabled: {
      control: "boolean",
      description: "HTML disabled",
    },
    onChange: { control: false },
    className: { control: false },
  },
  args: {
    placeholder: "아픈 곳을 입력하세요",
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * State
 * ======================================== */

export const StateDefault: Story = {
  name: "State / Default",
  args: {
    state: "default",
  },
};

export const StateActive: Story = {
  name: "State / Active",
  args: {
    state: "active",
    defaultValue: "두통",
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomPlaceholder: Story = {
  name: "Content / Custom Placeholder",
  args: {
    placeholder: "증상을 검색해 보세요",
  },
};

export const WithValue: Story = {
  name: "Content / With Value",
  args: {
    state: "active",
    defaultValue: "어지러움",
  },
};

export const Disabled: Story = {
  name: "Content / Disabled",
  args: {
    disabled: true,
    defaultValue: "입력 불가",
  },
};

/* ========================================
 * Interactive
 * ======================================== */

function InteractiveSearchBar() {
  const [value, setValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <SearchBar
      value={value}
      onChange={handleChange}
      placeholder="아픈 곳을 입력하세요"
    />
  );
}

export const Interactive: Story = {
  name: "Interactive / Type",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveSearchBar />,
};

/* ========================================
 * Matrix — State Default | Active
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        alignItems: "stretch",
        width: 361,
      }}
    >
      {STATES.map((state) => (
        <div
          key={state}
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
            state={state}
          </div>
          <SearchBar
            state={state}
            defaultValue={state === "active" ? "두통" : undefined}
            onChange={fn()}
          />
        </div>
      ))}
    </div>
  ),
};
