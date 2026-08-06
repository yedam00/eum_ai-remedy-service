import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import {
  SummaryItem,
  type SummaryItemVariant,
} from "./index";

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

const PARTIAL_IMAGE_URLS = [
  "/images/level1.png",
  "/images/level2.png",
  "/images/level3.png",
];

const DEFAULT_LIST_ANSWERS = [
  "머리가 어지러움",
  "속이 메스꺼움",
  "토할 것 같음",
];

const meta = {
  title: "Commons/Components/SummaryItem",
  component: SummaryItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Figma varient — default | list | media | opinion",
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
      control: false,
      description: "media variant일 때 노출할 이미지 URL 목록 (최대 6개)",
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

export const CustomAnswer: Story = {
  name: "Content / Custom Answer",
  args: {
    variant: "default",
    label: "언제부터 아팠나요?",
    answerLabel: "어제 저녁부터예요",
  },
};

export const CustomListAnswers: Story = {
  name: "Content / Custom List Answers",
  args: {
    variant: "list",
    label: "어떤 증상이 있나요?",
    answerLabel: DEFAULT_LIST_ANSWERS,
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
    imageUrls: PARTIAL_IMAGE_URLS,
  },
};

export const CustomOpinion: Story = {
  name: "Content / Custom Opinion",
  args: {
    variant: "opinion",
    title: "환자 추가 질문",
    answerLabel: "약을 꾸준히 먹어도 괜찮을까요?",
  },
};

/* ========================================
 * Interaction
 * ======================================== */

export const WithEdit: Story = {
  name: "Interaction / Edit",
  args: {
    variant: "default",
    onEdit: fn(),
  },
};

export const ListWithEdit: Story = {
  name: "Interaction / List Edit",
  args: {
    variant: "list",
    answerLabel: DEFAULT_LIST_ANSWERS,
    onEdit: fn(),
  },
};

/* ========================================
 * Matrix — default | list | media | opinion
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const entries: Array<{
      variant: SummaryItemVariant;
      props?: {
        answerLabel?: string | string[];
        imageUrls?: string[];
      };
    }> = [
      { variant: "default" },
      {
        variant: "list",
        props: { answerLabel: DEFAULT_LIST_ANSWERS },
      },
      {
        variant: "media",
        props: { imageUrls: SAMPLE_IMAGE_URLS },
      },
      { variant: "opinion" },
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
        {entries.map(({ variant, props }) => (
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
              onEdit={fn()}
              {...props}
            />
          </div>
        ))}
      </div>
    );
  },
};
