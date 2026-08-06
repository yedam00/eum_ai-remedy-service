import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Header } from "./index";

const meta = {
  title: "Commons/Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 393, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      control: "text",
      description: "헤더 좌측 타이틀 텍스트 (Figma Label · 기본값: 홈)",
    },
    onBackClick: {
      control: false,
      description: "뒤로가기(Arrow) 클릭 핸들러",
    },
    className: { control: false },
  },
  args: {
    title: "홈",
    onBackClick: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Title
 * ======================================== */

export const TitleHome: Story = {
  name: "Title / 홈",
  args: {
    title: "홈",
  },
};

export const TitleChat: Story = {
  name: "Title / 대화",
  args: {
    title: "대화",
  },
};

export const TitleSettings: Story = {
  name: "Title / 설정",
  args: {
    title: "설정",
  },
};

export const TitleLong: Story = {
  name: "Title / Long Text",
  args: {
    title: "매우 긴 헤더 타이틀 텍스트 말줄임 확인",
  },
};

/* ========================================
 * Interaction
 * ======================================== */

export const WithBackClick: Story = {
  name: "Interaction / Back Click",
  args: {
    title: "홈",
    onBackClick: fn(),
  },
};

/* ========================================
 * Matrix — Title variants
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const titles = ["홈", "대화", "설정", "복약 기록"] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
        }}
      >
        {titles.map((title) => (
          <div
            key={title}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
            }}
          >
            <div
              style={{
                fontFamily: "var(--typography-ko-font-family)",
                fontSize: 14,
                color: "var(--color-text-secondary)",
                paddingInline: 16,
              }}
            >
              title=&quot;{title}&quot;
            </div>
            <Header title={title} onBackClick={fn()} />
          </div>
        ))}
      </div>
    );
  },
};
