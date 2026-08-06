import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./index";

const meta = {
  title: "Commons/Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    state: {
      control: "select",
      options: ["default", "selected"],
      description: "Figma State — Default | Selected",
    },
    disabled: {
      control: "boolean",
      description: "HTML disabled",
    },
    className: { control: false },
  },
  args: {
    state: "default",
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

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

export const StateSelected: Story = {
  name: "State / Selected",
  args: {
    state: "selected",
  },
};

/* ========================================
 * Disabled
 * ======================================== */

export const DisabledDefault: Story = {
  name: "Disabled / Default",
  args: {
    state: "default",
    disabled: true,
  },
};

export const DisabledSelected: Story = {
  name: "Disabled / Selected",
  args: {
    state: "selected",
    disabled: true,
  },
};

/* ========================================
 * Matrix — State × Disabled
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const states = ["default", "selected"] as const;
    const disabledFlags = [false, true] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {disabledFlags.map((disabled) => (
          <div
            key={`disabled-${disabled}`}
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
              disabled={String(disabled)}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
              }}
            >
              {states.map((state) => (
                <div
                  key={`${state}-${disabled}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Checkbox state={state} disabled={disabled} />
                  <span
                    style={{
                      fontFamily: "var(--typography-ko-font-family)",
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
