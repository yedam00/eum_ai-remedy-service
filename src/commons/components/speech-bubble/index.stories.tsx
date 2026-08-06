import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SpeechBubble,
  type SpeechBubbleVariant,
} from "./index";

const VARIANTS: SpeechBubbleVariant[] = ["ai", "user"];
const HAS_IMAGE_FLAGS = [false, true] as const;

const SAMPLE_IMAGE_URL = "/images/level1.png";

const DEFAULT_LABEL = "어디가 불편하신가요?";
const DEFAULT_USER_LABEL = "머리가 아파요";

const meta = {
  title: "Commons/Components/SpeechBubble",
  component: SpeechBubble,
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
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Figma varient — AI | User",
    },
    hasImage: {
      control: "boolean",
      description: "Figma Has Image — true일 경우 이미지 프레임 영역 포함",
    },
    label: {
      control: "text",
      description: "AI 질문 텍스트 (Figma Label)",
    },
    userLabel: {
      control: "text",
      description: "사용자 답변 텍스트 (Figma User-Label)",
    },
    imageUrl: {
      control: "text",
      description: "hasImage가 true일 때 노출할 이미지 경로",
    },
    className: { control: false },
  },
  args: {
    variant: "ai",
    hasImage: false,
    label: DEFAULT_LABEL,
    userLabel: DEFAULT_USER_LABEL,
  },
} satisfies Meta<typeof SpeechBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Variant
 * ======================================== */

export const VariantAi: Story = {
  name: "Variant / AI",
  args: {
    variant: "ai",
    hasImage: false,
    label: DEFAULT_LABEL,
    userLabel: DEFAULT_USER_LABEL,
  },
};

export const VariantUser: Story = {
  name: "Variant / User",
  args: {
    variant: "user",
    hasImage: false,
    label: DEFAULT_LABEL,
    userLabel: DEFAULT_USER_LABEL,
  },
};

/* ========================================
 * Has Image
 * ======================================== */

export const HasImageAiFalse: Story = {
  name: "Has Image / AI · false",
  args: {
    variant: "ai",
    hasImage: false,
    label: DEFAULT_LABEL,
    userLabel: DEFAULT_USER_LABEL,
  },
};

export const HasImageAiTrue: Story = {
  name: "Has Image / AI · true",
  args: {
    variant: "ai",
    hasImage: true,
    label: DEFAULT_LABEL,
    userLabel: DEFAULT_USER_LABEL,
    imageUrl: SAMPLE_IMAGE_URL,
  },
};

export const HasImageUserFalse: Story = {
  name: "Has Image / User · false",
  args: {
    variant: "user",
    hasImage: false,
    label: DEFAULT_LABEL,
    userLabel: DEFAULT_USER_LABEL,
  },
};

export const HasImageUserTrue: Story = {
  name: "Has Image / User · true",
  args: {
    variant: "user",
    hasImage: true,
    label: DEFAULT_LABEL,
    userLabel: DEFAULT_USER_LABEL,
    imageUrl: SAMPLE_IMAGE_URL,
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomLabels: Story = {
  name: "Content / Custom Labels",
  args: {
    variant: "ai",
    hasImage: false,
    label: "증상이 시작된 지는 얼마나 되었나요?",
    userLabel: "어제 저녁부터예요",
  },
};

export const WithImageUrl: Story = {
  name: "Content / With ImageUrl",
  args: {
    variant: "ai",
    hasImage: true,
    label: "이 부위가 아픈가요?",
    userLabel: "네, 맞아요",
    imageUrl: "/images/level3.png",
  },
};

export const MultilineLabel: Story = {
  name: "Content / Multiline Label",
  args: {
    variant: "ai",
    hasImage: false,
    label: "어지럽거나 속이 메스껍고,\n토할 것 같은 증상이 있나요?",
    userLabel: "조금 어지러워요",
  },
};

/* ========================================
 * Matrix — Variant × Has Image
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
          gap: 32,
          alignItems: "stretch",
          width: 361,
        }}
      >
        {VARIANTS.map((variant) => (
          <div
            key={variant}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--typography-ko-font-family)",
                fontSize: 14,
                color: "var(--color-text-secondary)",
              }}
            >
              variant={variant}
            </div>
            {HAS_IMAGE_FLAGS.map((hasImage) => (
              <div
                key={`${variant}-${hasImage}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--typography-ko-font-family)",
                    fontSize: 12,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  hasImage={String(hasImage)}
                </div>
                <SpeechBubble
                  variant={variant}
                  hasImage={hasImage}
                  label={DEFAULT_LABEL}
                  userLabel={DEFAULT_USER_LABEL}
                  imageUrl={hasImage ? SAMPLE_IMAGE_URL : undefined}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
