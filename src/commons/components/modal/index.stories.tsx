import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Modal } from "./index";

const meta = {
  title: "Commons/Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "danger"],
      description: "Figma Variant — info | danger",
    },
    actions: {
      control: "select",
      options: ["dual"],
      description: "Figma Actions — dual (2 buttons)",
    },
    title: {
      control: "text",
      description: "모달 제목 (Figma Label)",
    },
    content: {
      control: "text",
      description: "모달 본문 내용",
    },
    primaryLabel: {
      control: "text",
      description: "Primary 버튼 라벨 (오른쪽 버튼)",
    },
    secondaryLabel: {
      control: "text",
      description: "Secondary 버튼 라벨 (왼쪽 버튼)",
    },
    onPrimary: { control: false },
    onSecondary: { control: false },
    className: { control: false },
  },
  args: {
    variant: "info",
    actions: "dual",
    title: "제목",
    content: "모달 내용이 여기에 표시됩니다.",
    primaryLabel: "계속 작성",
    secondaryLabel: "나가기",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Variant
 * ======================================== */

export const VariantInfo: Story = {
  name: "Variant / Info",
  args: {
    variant: "info",
    title: "문진을 종료하시겠습니까?",
    content: "작성 중인 내용이 저장되지 않습니다. ",
  },
};

export const VariantDanger: Story = {
  name: "Variant / Danger",
  args: {
    variant: "danger",
    title: "문진을 종료하시겠습니까?",
    content: "선택한 내용들은 모두 초기화됩니다.",
    primaryLabel: "삭제",
    secondaryLabel: "취소",
  },
};

/* ========================================
 * Content
 * ======================================== */

export const ShortContent: Story = {
  name: "Content / Short",
  args: {
    variant: "info",
    title: "알림",
    content: "짧은 내용입니다.",
  },
};

export const LongContent: Story = {
  name: "Content / Long",
  args: {
    variant: "info",
    title: "개인정보 처리방침",
    content:
      "긴 내용의 예시입니다. 개인정보 처리방침에 동의하시면 계속 진행하실 수 있습니다. 수집된 개인정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다. 자세한 내용은 개인정보 처리방침을 확인해주세요.",
  },
};

export const NoContent: Story = {
  name: "Content / No Content",
  args: {
    variant: "info",
    title: "제목만 있는 모달",
    content: undefined,
  },
};

/* ========================================
 * Custom Labels
 * ======================================== */

export const CustomLabels: Story = {
  name: "Labels / Custom",
  args: {
    variant: "info",
    title: "파일을 저장하시겠습니까?",
    content: "변경사항이 저장되지 않았습니다.",
    primaryLabel: "저장",
    secondaryLabel: "저장 안 함",
  },
};

export const ConfirmationModal: Story = {
  name: "Labels / Confirmation",
  args: {
    variant: "danger",
    title: "계정을 삭제하시겠습니까?",
    content: "계정 삭제 시 모든 데이터가 영구적으로 삭제됩니다.",
    primaryLabel: "삭제",
    secondaryLabel: "취소",
  },
};

/* ========================================
 * Interactive
 * ======================================== */

function InteractiveModal() {
  const [showResult, setShowResult] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Modal
        variant="info"
        title="인터랙티브 모달"
        content="버튼을 클릭해보세요."
        primaryLabel="계속 작성"
        secondaryLabel="나가기"
        onPrimary={() => setShowResult("Primary 버튼 클릭됨")}
        onSecondary={() => setShowResult("Secondary 버튼 클릭됨")}
      />
      {showResult && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--color-bg-secondary)",
            borderRadius: 8,
            fontFamily: "var(--typography-ko-font-family)",
            fontSize: 14,
            color: "var(--color-text-primary)",
          }}
        >
          결과: {showResult}
        </div>
      )}
    </div>
  );
}

export const Interactive: Story = {
  name: "Interactive / Buttons",
  parameters: {
    controls: { disable: true },
  },
  render: () => <InteractiveModal />,
};

/* ========================================
 * Matrix — Variant × Actions
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const samples = [
      {
        variant: "info" as const,
        title: "작성 중인 내용이 있습니다",
        content:
          "페이지를 나가면 작성 중인 내용이 저장되지 않습니다. 계속 작성하시겠습니까?",
        primaryLabel: "계속 작성",
        secondaryLabel: "나가기",
      },
      {
        variant: "danger" as const,
        title: "정말 삭제하시겠습니까?",
        content: "삭제된 내용은 복구할 수 없습니다. 정말 삭제하시겠습니까?",
        primaryLabel: "삭제",
        secondaryLabel: "취소",
      },
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
        {samples.map(
          ({ variant, title, content, primaryLabel, secondaryLabel }) => (
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
                variant={variant} · actions=dual
              </div>
              <Modal
                variant={variant}
                actions="dual"
                title={title}
                content={content}
                primaryLabel={primaryLabel}
                secondaryLabel={secondaryLabel}
              />
            </div>
          )
        )}
      </div>
    );
  },
};
