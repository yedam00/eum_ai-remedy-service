import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./index";
import { Arrow, ChevronRight, Search } from "../icons";

const meta = {
  title: "Commons/Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined"],
      description: "Figma Variant — Default | Outlined",
    },
    state: {
      control: "select",
      options: ["default", "inactive"],
      description: "Figma State — Default | Inactive",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Figma Size — sm | md | lg (타이포그래피 세트 포함)",
    },
    label: {
      control: "text",
      description: "버튼 라벨 (children이 있으면 children 우선)",
    },
    disabled: {
      control: "boolean",
      description: "HTML disabled (state=inactive와 동일하게 비활성 처리)",
    },
    leftIcon: { control: false },
    rightIcon: { control: false },
    children: { control: false },
  },
  args: {
    variant: "default",
    state: "default",
    size: "md",
    label: "버튼",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Variant
 * ======================================== */

export const VariantDefault: Story = {
  name: "Variant / Default",
  args: {
    variant: "default",
    label: "Default",
  },
};

export const VariantOutlined: Story = {
  name: "Variant / Outlined",
  args: {
    variant: "outlined",
    label: "Outlined",
  },
};

/* ========================================
 * State
 * ======================================== */

export const StateDefault: Story = {
  name: "State / Default",
  args: {
    state: "default",
    label: "Default",
  },
};

export const StateInactive: Story = {
  name: "State / Inactive",
  args: {
    state: "inactive",
    label: "Inactive",
  },
};

export const StateInactiveOutlined: Story = {
  name: "State / Inactive Outlined",
  args: {
    variant: "outlined",
    state: "inactive",
    label: "Inactive",
  },
};

/* ========================================
 * Size
 * ======================================== */

export const SizeSm: Story = {
  name: "Size / SM",
  args: {
    size: "sm",
    label: "Small",
  },
};

export const SizeMd: Story = {
  name: "Size / MD",
  args: {
    size: "md",
    label: "Medium",
  },
};

export const SizeLg: Story = {
  name: "Size / LG",
  args: {
    size: "lg",
    label: "Large",
  },
};

/* ========================================
 * Icons
 * ======================================== */

export const WithLeftIcon: Story = {
  name: "Icon / Left",
  args: {
    label: "검색",
    leftIcon: <Search />,
  },
};

export const WithRightIcon: Story = {
  name: "Icon / Right",
  args: {
    label: "다음",
    rightIcon: <ChevronRight />,
  },
};

export const WithBothIcons: Story = {
  name: "Icon / Both",
  args: {
    label: "이동",
    leftIcon: <Arrow />,
    rightIcon: <ChevronRight />,
  },
};

export const IconOnlyOutlined: Story = {
  name: "Icon / Only",
  args: {
    variant: "outlined",
    label: undefined,
    leftIcon: <Search />,
    "aria-label": "검색",
  },
};

/* ========================================
 * Matrix — Variant × State × Size
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const variants = ["default", "outlined"] as const;
    const states = ["default", "inactive"] as const;
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {variants.map((variant) =>
          states.map((state) => (
            <div
              key={`${variant}-${state}`}
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
                variant={variant} · state={state}
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
                {sizes.map((size) => (
                  <Button
                    key={`${variant}-${state}-${size}`}
                    variant={variant}
                    state={state}
                    size={size}
                    label={`${size.toUpperCase()}`}
                    rightIcon={<ChevronRight />}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  },
};
