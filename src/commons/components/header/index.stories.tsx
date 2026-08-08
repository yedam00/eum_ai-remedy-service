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
    state: {
      control: "inline-radio",
      options: ["home", "chat"],
      description: "Figma Header state variant (home | chat)",
    },
    title: {
      control: "text",
      description: 'state="chat"일 때 타이틀 텍스트 (Figma Label · 기본값: 홈)',
    },
    onBack: {
      control: false,
      description: "뒤로가기(Arrow) 클릭 핸들러",
    },
    className: { control: false },
  },
  args: {
    state: "home",
    title: "홈",
    onBack: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * State
 * ======================================== */

export const StateHome: Story = {
  name: "State / home",
  args: {
    state: "home",
  },
};

export const StateChat: Story = {
  name: "State / chat",
  args: {
    state: "chat",
    title: "홈",
    onBack: fn(),
  },
};

/* ========================================
 * Title (chat)
 * ======================================== */

export const TitleHome: Story = {
  name: "Title / 홈",
  args: {
    state: "chat",
    title: "홈",
  },
};

export const TitleChat: Story = {
  name: "Title / 대화",
  args: {
    state: "chat",
    title: "대화",
  },
};

export const TitleSettings: Story = {
  name: "Title / 설정",
  args: {
    state: "chat",
    title: "설정",
  },
};

export const TitleLong: Story = {
  name: "Title / Long Text",
  args: {
    state: "chat",
    title: "매우 긴 헤더 타이틀 텍스트 말줄임 확인",
  },
};

/* ========================================
 * Interaction
 * ======================================== */

export const WithBackClick: Story = {
  name: "Interaction / Back Click",
  args: {
    state: "chat",
    title: "홈",
    onBack: fn(),
  },
};

/* ========================================
 * Matrix — State variants
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const chatTitles = ["홈", "대화", "설정", "복약 기록"] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
        }}
      >
        <div
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
            state=&quot;home&quot;
          </div>
          <Header state="home" />
        </div>

        {chatTitles.map((title) => (
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
              state=&quot;chat&quot; · title=&quot;{title}&quot;
            </div>
            <Header state="chat" title={title} onBack={fn()} />
          </div>
        ))}
      </div>
    );
  },
};
