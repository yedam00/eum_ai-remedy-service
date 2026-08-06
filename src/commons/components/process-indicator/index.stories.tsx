import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import {
  ProcessIndicator,
  type ProcessIndicatorValue,
} from "./index";

const VALUES: ProcessIndicatorValue[] = [1, 2, 3];

const meta = {
  title: "Commons/Components/ProcessIndicator",
  component: ProcessIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: {
      control: "select",
      options: VALUES,
      description: "Figma value — 현재 활성화된 온보딩 단계 (1 | 2 | 3)",
    },
    className: { control: false },
  },
  args: {
    value: 1,
  },
} satisfies Meta<typeof ProcessIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Value
 * ======================================== */

export const Value1: Story = {
  name: "Value / 1",
  args: {
    value: 1,
  },
};

export const Value2: Story = {
  name: "Value / 2",
  args: {
    value: 2,
  },
};

export const Value3: Story = {
  name: "Value / 3",
  args: {
    value: 3,
  },
};

/* ========================================
 * Value (string)
 * ======================================== */

export const ValueString1: Story = {
  name: "Value / String 1",
  args: {
    value: "1",
  },
};

export const ValueString2: Story = {
  name: "Value / String 2",
  args: {
    value: "2",
  },
};

export const ValueString3: Story = {
  name: "Value / String 3",
  args: {
    value: "3",
  },
};

/* ========================================
 * Interactive
 * ======================================== */

function InteractiveProcessIndicator() {
  const [value, setValue] = useState<ProcessIndicatorValue>(1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <ProcessIndicator value={value} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        {VALUES.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setValue(step)}
            style={{
              fontFamily: "var(--typography-ko-font-family)",
              fontSize: 12,
              padding: "6px 12px",
              border:
                value === step
                  ? "1px solid var(--color-brand-primary)"
                  : "1px solid var(--color-border-primary)",
              background:
                value === step
                  ? "var(--color-brand-primary)"
                  : "transparent",
              color:
                value === step
                  ? "var(--color-text-inverse, #fff)"
                  : "var(--color-text-secondary)",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            step {step}
          </button>
        ))}
      </div>
    </div>
  );
}

export const Interactive: Story = {
  name: "Interactive / Step Toggle",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveProcessIndicator />,
};

/* ========================================
 * Matrix — value 1 | 2 | 3
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
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 24,
        alignItems: "flex-start",
      }}
    >
      {VALUES.map((value) => (
        <div
          key={value}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--typography-ko-font-family)",
              fontSize: 14,
              color: "var(--color-text-secondary)",
            }}
          >
            value={value}
          </div>
          <ProcessIndicator value={value} />
        </div>
      ))}
    </div>
  ),
};
