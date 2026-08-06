import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import {
  MessageInput,
  type MessageInputSize,
  type MessageInputState,
} from "./index";

const STATES: MessageInputState[] = ["default", "focused", "active"];
const SIZES: MessageInputSize[] = ["sm", "lg"];

const meta = {
  title: "Commons/Components/MessageInput",
  component: MessageInput,
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
        "Figma State — Default | Focused | Active (미지정 시 focus/value로 자동 전환)",
    },
    size: {
      control: "select",
      options: SIZES,
      description: "Figma Size — sm | lg",
    },
    placeholder: {
      control: "text",
      description: "플레이스홀더 (기본: 메시지를 입력하세요)",
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
    onValueChange: { control: false },
    onSubmit: { control: false },
    onVoiceClick: { control: false },
    className: { control: false },
  },
  args: {
    size: "sm",
    placeholder: "메시지를 입력하세요",
    disabled: false,
    onValueChange: fn(),
    onSubmit: fn(),
    onVoiceClick: fn(),
  },
} satisfies Meta<typeof MessageInput>;

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

export const StateFocused: Story = {
  name: "State / Focused",
  args: {
    state: "focused",
  },
};

export const StateActive: Story = {
  name: "State / Active",
  args: {
    state: "active",
    defaultValue: "두통이 있어요",
  },
};

/* ========================================
 * Size
 * ======================================== */

export const SizeSm: Story = {
  name: "Size / SM",
  args: {
    size: "sm",
  },
};

export const SizeLg: Story = {
  name: "Size / LG",
  args: {
    size: "lg",
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomPlaceholder: Story = {
  name: "Content / Custom Placeholder",
  args: {
    placeholder: "증상을 자유롭게 입력해 주세요",
  },
};

export const WithValue: Story = {
  name: "Content / With Value",
  args: {
    state: "active",
    defaultValue: "어지러움과 메스꺼움이 있어요",
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
 * Interaction
 * ======================================== */

export const WithVoiceClick: Story = {
  name: "Interaction / Voice Click",
  args: {
    state: "default",
    onVoiceClick: fn(),
  },
};

export const WithSubmit: Story = {
  name: "Interaction / Submit",
  args: {
    state: "active",
    defaultValue: "전송할 메시지",
    onSubmit: fn(),
  },
};

function InteractiveMessageInput() {
  const [value, setValue] = useState("");

  return (
    <MessageInput
      size="sm"
      value={value}
      onValueChange={setValue}
      onSubmit={(submitted) => {
        fn()(submitted);
        setValue("");
      }}
      onVoiceClick={fn()}
    />
  );
}

export const Interactive: Story = {
  name: "Interactive / Type & Submit",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveMessageInput />,
};

/* ========================================
 * Matrix — State × Size
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    return (
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {SIZES.map((size) => (
                <div
                  key={`${state}-${size}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--typography-ko-font-family)",
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    size={size}
                  </div>
                  <MessageInput
                    state={state}
                    size={size}
                    defaultValue={
                      state === "active" ? "두통이 있어요" : undefined
                    }
                    onValueChange={fn()}
                    onSubmit={fn()}
                    onVoiceClick={fn()}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
