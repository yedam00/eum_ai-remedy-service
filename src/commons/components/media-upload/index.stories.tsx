import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { MediaUpload } from "./index";

const SAMPLE_IMAGE_URL = "/images/level1.png";

const meta = {
  title: "Commons/Components/MediaUpload",
  component: MediaUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    imageUrl: {
      control: "text",
      description:
        "업로드된 이미지 URL — 값이 있으면 uploaded, 없으면 empty로 자동 전환",
    },
    alt: {
      control: "text",
      description: "업로드 이미지 대체 텍스트",
    },
    onRemove: {
      control: false,
      description: "uploaded 상태의 삭제(X) 버튼 클릭",
    },
    onEmptyClick: {
      control: false,
      description: "empty 상태의 플레이스홀더 클릭 (업로드 유도)",
    },
    className: { control: false },
  },
  args: {
    imageUrl: undefined,
    alt: "업로드 이미지",
    onRemove: fn(),
    onEmptyClick: fn(),
  },
} satisfies Meta<typeof MediaUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Variant
 * ======================================== */

export const VariantEmpty: Story = {
  name: "Variant / Empty",
  args: {
    imageUrl: undefined,
  },
};

export const VariantUploaded: Story = {
  name: "Variant / Uploaded",
  args: {
    imageUrl: SAMPLE_IMAGE_URL,
    alt: "level1",
  },
};

/* ========================================
 * Interaction
 * ======================================== */

export const WithEmptyClick: Story = {
  name: "Interaction / Empty Click",
  args: {
    imageUrl: undefined,
    onEmptyClick: fn(),
  },
};

export const WithRemove: Story = {
  name: "Interaction / Remove",
  args: {
    imageUrl: SAMPLE_IMAGE_URL,
    alt: "level1",
    onRemove: fn(),
  },
};

function InteractiveMediaUpload() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  return (
    <MediaUpload
      imageUrl={imageUrl}
      alt="업로드 이미지"
      onEmptyClick={() => setImageUrl(SAMPLE_IMAGE_URL)}
      onRemove={() => setImageUrl(undefined)}
    />
  );
}

export const Interactive: Story = {
  name: "Interactive / Toggle",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveMediaUpload />,
};

/* ========================================
 * Matrix — Empty | Uploaded
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const variants = [
      { label: "empty", imageUrl: undefined as string | undefined },
      { label: "uploaded", imageUrl: SAMPLE_IMAGE_URL },
    ] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {variants.map(({ label, imageUrl }) => (
          <div
            key={label}
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
              variant={label}
            </div>
            <MediaUpload
              imageUrl={imageUrl}
              alt={label === "uploaded" ? "level1" : ""}
            />
          </div>
        ))}
      </div>
    );
  },
};
