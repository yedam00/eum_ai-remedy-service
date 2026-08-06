import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImageCard, type ImageCardLevel } from "./index";

const LEVEL_LABELS: Record<ImageCardLevel, string> = {
  1: "조금 아프다",
  2: "약간 아프다",
  3: "아프다",
  4: "많이 아프다",
  5: "매우 아프다",
};

const meta = {
  title: "Commons/Components/ImageCard",
  component: ImageCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    state: {
      control: "select",
      options: ["default", "active"],
      description: "Figma State — Default | active",
    },
    level: {
      control: "select",
      options: [1, 2, 3, 4, 5],
      description: "레벨 이미지 (/images/level{n}.png). imageSrc가 있으면 무시",
    },
    imageSrc: {
      control: "text",
      description: "카드 상단 이미지 경로 (우선 사용)",
    },
    alt: {
      control: "text",
      description: "이미지 대체 텍스트",
    },
    label: {
      control: "text",
      description: "카드 하단 라벨 (children이 있으면 children 우선)",
    },
    disabled: {
      control: "boolean",
      description: "HTML disabled",
    },
    children: { control: false },
    className: { control: false },
  },
  args: {
    state: "default",
    level: 1,
    label: "조금 아프다",
    alt: "통증 레벨 1",
    disabled: false,
  },
} satisfies Meta<typeof ImageCard>;

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
  },
};

/* ========================================
 * Level
 * ======================================== */

export const Level1: Story = {
  name: "Level / 1",
  args: {
    level: 1,
    label: LEVEL_LABELS[1],
    alt: "통증 레벨 1",
  },
};

export const Level2: Story = {
  name: "Level / 2",
  args: {
    level: 2,
    label: LEVEL_LABELS[2],
    alt: "통증 레벨 2",
  },
};

export const Level3: Story = {
  name: "Level / 3",
  args: {
    level: 3,
    label: LEVEL_LABELS[3],
    alt: "통증 레벨 3",
  },
};

export const Level4: Story = {
  name: "Level / 4",
  args: {
    level: 4,
    label: LEVEL_LABELS[4],
    alt: "통증 레벨 4",
  },
};

export const Level5: Story = {
  name: "Level / 5",
  args: {
    level: 5,
    label: LEVEL_LABELS[5],
    alt: "통증 레벨 5",
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

export const DisabledActive: Story = {
  name: "Disabled / Active",
  args: {
    state: "active",
    disabled: true,
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomLabel: Story = {
  name: "Content / Custom Label",
  args: {
    level: 3,
    label: "중간 정도예요",
    alt: "통증 레벨 3",
  },
};

export const CustomImageSrc: Story = {
  name: "Content / Custom ImageSrc",
  args: {
    imageSrc: "/images/level5.png",
    label: "커스텀 이미지",
    alt: "커스텀 레벨 이미지",
  },
};

/* ========================================
 * Matrix — State × Level × Disabled
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const states = ["default", "active"] as const;
    const levels = [1, 2, 3, 4, 5] as const;
    const disabledFlags = [false, true] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        {disabledFlags.map((disabled) =>
          states.map((state) => (
            <div
              key={`${state}-${disabled}`}
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
                state={state} · disabled={String(disabled)}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                {levels.map((level) => (
                  <div
                    key={`${state}-${level}-${disabled}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <ImageCard
                      state={state}
                      level={level}
                      label={LEVEL_LABELS[level]}
                      alt={`통증 레벨 ${level}`}
                      disabled={disabled}
                    />
                    <span
                      style={{
                        fontFamily: "var(--typography-ko-font-family)",
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      level={level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  },
};
