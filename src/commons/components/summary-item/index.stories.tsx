import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { SummaryItem, type SummaryItemVariant } from "./index";

const VARIANTS: SummaryItemVariant[] = [
  "default",
  "list",
  "media",
  "opinion",
];

const SAMPLE_IMAGE_URLS = [
  "/images/level1.png",
  "/images/level2.png",
  "/images/level3.png",
  "/images/level4.png",
  "/images/level5.png",
  "/images/level1.png",
];

const SAMPLE_LIST_ANSWERS = ["두통", "어지러움", "구역감"];

const meta = {
  title: "Commons/Components/SummaryItem",
  component: SummaryItem,
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
      description: "Figma varient — Default | List | Media | Opinion",
    },
    label: {
      control: "text",
      description: "질문/섹션 라벨 (default · list · media)",
    },
    answerLabel: {
      control: "text",
      description:
        "답변 텍스트 — default/opinion: string, list: string | string[]",
    },
    imageUrls: {
      control: "object",
      description: "media variant 이미지 URL 목록 (최대 6개)",
    },
    title: {
      control: "text",
      description: "opinion variant 제목",
    },
    onEdit: {
      control: false,
      description: "default / list 편집(연필) 버튼 클릭",
    },
    className: { control: false },
  },
  args: {
    variant: "default",
    onEdit: fn(),
  },
} satisfies Meta<typeof SummaryItem>;

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
  },
};

export const VariantList: Story = {
  name: "Variant / List",
  args: {
    variant: "list",
  },
};

export const VariantMedia: Story = {
  name: "Variant / Media",
  args: {
    variant: "media",
  },
};

export const VariantOpinion: Story = {
  name: "Variant / Opinion",
  args: {
    variant: "opinion",
  },
};

/* ========================================
 * Content
 * ======================================== */

export const CustomDefault: Story = {
  name: "Content / Custom Default",
  args: {
    variant: "default",
    label: "언제부터 아팠나요?",
    answerLabel: "어제 저녁부터",
  },
};

export const CustomList: Story = {
  name: "Content / Custom List",
  args: {
    variant: "list",
    label: "어떤 증상이 있나요?",
    answerLabel: SAMPLE_LIST_ANSWERS,
  },
};

export const MediaWithImages: Story = {
  name: "Content / Media With Images",
  args: {
    variant: "media",
    label: "첨부한 사진",
    imageUrls: SAMPLE_IMAGE_URLS,
  },
};

export const MediaPartialImages: Story = {
  name: "Content / Media Partial Images",
  args: {
    variant: "media",
    label: "첨부한 사진",
    imageUrls: SAMPLE_IMAGE_URLS.slice(0, 3),
  },
};

export const CustomOpinion: Story = {
  name: "Content / Custom Opinion",
  args: {
    variant: "opinion",
    title: "의사 소견",
    answerLabel: "충분한 휴식과 수분 섭취가 필요합니다.",
  },
};

/* ========================================
 * Interaction
 * ======================================== */

export const WithEdit: Story = {
  name: "Interaction / Edit",
  args: {
    variant: "default",
    label: "다친 적이 있나요?",
    answerLabel: "머리가 어지러움",
    onEdit: fn(),
  },
};

export const WithEditList: Story = {
  name: "Interaction / Edit List",
  args: {
    variant: "list",
    label: "어떤 증상이 있나요?",
    answerLabel: SAMPLE_LIST_ANSWERS,
    onEdit: fn(),
  },
};

/* ========================================
 * Matrix — Default | List | Media | Opinion
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
      {VARIANTS.map((variant) => (
        <div
          key={variant}
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
            variant={variant}
          </div>
          <SummaryItem
            variant={variant}
            answerLabel={
              variant === "list" ? SAMPLE_LIST_ANSWERS : undefined
            }
            imageUrls={
              variant === "media" ? SAMPLE_IMAGE_URLS.slice(0, 4) : undefined
            }
            onEdit={variant === "default" || variant === "list" ? fn() : undefined}
          />
        </div>
      ))}
    </div>
  ),
};
