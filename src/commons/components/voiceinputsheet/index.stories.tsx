import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import {
  VoiceInputSheet,
  type VoiceInputSheetProps,
} from "./index";
import type { VoiceIndicatorState } from "../voiceindicator";

const STATES: VoiceIndicatorState[] = ["default", "listening", "success"];
const AUDIO_LEVELS = [0, 30, 60, 100] as const;

const DEFAULT_TITLE = "어디가 불편하신가요?";

const CUSTOM_DESCRIPTIONS = [
  "“머리가 지끈지끈 아파요”",
  "“속이 메스껍고 토할 것 같아요”",
  "“숨이 차고 가슴이 답답해요”",
] as const;

const labelStyle: CSSProperties = {
  fontFamily: "var(--typography-ko-font-family)",
  fontSize: 12,
  color: "var(--color-text-secondary)",
};

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--typography-ko-font-family)",
  fontSize: 14,
  color: "var(--color-text-secondary)",
};

const sheetFrameStyle: CSSProperties = {
  width: 393,
  boxSizing: "border-box",
};

const meta = {
  title: "Commons/Components/VoiceInputSheet",
  component: VoiceInputSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={sheetFrameStyle}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    descriptions: {
      control: "boolean",
      description: "가이드 문구(Description 1~3) 영역 표시 여부",
    },
    title: {
      control: "text",
      description: "모달 상단 타이틀 (Figma Titel)",
    },
    descriptionItems: {
      control: "object",
      description: "가이드 문구 목록 (Description 1~3)",
    },
    state: {
      control: "select",
      options: STATES,
      description: "VoiceIndicator State — default | listening | success",
    },
    audioLevel: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description:
        "VoiceIndicator audioLevel (0 ~ 100). listening일 때 막대 애니메이션에 사용",
    },
    onClose: {
      control: false,
      description: "닫기(Close_LG) 버튼 클릭 핸들러",
    },
    className: { control: false },
  },
  args: {
    descriptions: true,
    title: DEFAULT_TITLE,
    state: "default",
    audioLevel: 0,
    onClose: fn(),
  },
} satisfies Meta<typeof VoiceInputSheet>;

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
    audioLevel: 0,
  },
};

export const StateListening: Story = {
  name: "State / Listening",
  args: {
    state: "listening",
    audioLevel: 60,
  },
};

export const StateSuccess: Story = {
  name: "State / Success",
  args: {
    state: "success",
    audioLevel: 0,
  },
};

/* ========================================
 * Descriptions
 * ======================================== */

export const DescriptionsTrue: Story = {
  name: "Descriptions / True",
  args: {
    descriptions: true,
  },
};

export const DescriptionsFalse: Story = {
  name: "Descriptions / False",
  args: {
    descriptions: false,
  },
};

export const DescriptionsCustom: Story = {
  name: "Descriptions / Custom Items",
  args: {
    descriptions: true,
    descriptionItems: [...CUSTOM_DESCRIPTIONS],
  },
};

/* ========================================
 * Title
 * ======================================== */

export const TitleDefault: Story = {
  name: "Title / Default",
  args: {
    title: DEFAULT_TITLE,
  },
};

export const TitleCustom: Story = {
  name: "Title / Custom",
  args: {
    title: "증상을 말씀해 주세요",
  },
};

/* ========================================
 * Audio Level (listening)
 * ======================================== */

export const AudioLevel0: Story = {
  name: "Audio Level / 0 (Idle)",
  args: {
    state: "listening",
    audioLevel: 0,
  },
};

export const AudioLevel30: Story = {
  name: "Audio Level / 30",
  args: {
    state: "listening",
    audioLevel: 30,
  },
};

export const AudioLevel60: Story = {
  name: "Audio Level / 60",
  args: {
    state: "listening",
    audioLevel: 60,
  },
};

export const AudioLevel100: Story = {
  name: "Audio Level / 100",
  args: {
    state: "listening",
    audioLevel: 100,
  },
};

/* ========================================
 * Interaction
 * ======================================== */

export const WithCloseClick: Story = {
  name: "Interaction / Close Click",
  args: {
    onClose: fn(),
  },
};

/* ========================================
 * Interactive
 * ======================================== */

function InteractiveVoiceInputSheet() {
  const [state, setState] = useState<VoiceIndicatorState>("listening");
  const [audioLevel, setAudioLevel] = useState(50);
  const [descriptions, setDescriptions] = useState(true);
  const [closed, setClosed] = useState(false);

  if (closed) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
          minWidth: 240,
        }}
      >
        <div style={sectionLabelStyle}>시트가 닫혔습니다</div>
        <button
          type="button"
          onClick={() => setClosed(false)}
          style={{
            fontFamily: "var(--typography-ko-font-family)",
            fontSize: 12,
            padding: "6px 12px",
            border: "1px solid var(--color-border-primary)",
            background: "transparent",
            color: "var(--color-text-secondary)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          다시 열기
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "stretch",
        width: 393,
      }}
    >
      <VoiceInputSheet
        descriptions={descriptions}
        state={state}
        audioLevel={audioLevel}
        onClose={() => setClosed(true)}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {STATES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setState(s)}
            style={{
              fontFamily: "var(--typography-ko-font-family)",
              fontSize: 12,
              padding: "6px 12px",
              border:
                state === s
                  ? "1px solid var(--color-brand-primary)"
                  : "1px solid var(--color-border-primary)",
              background:
                state === s
                  ? "var(--color-brand-primary)"
                  : "transparent",
              color:
                state === s
                  ? "var(--color-text-inverse, #fff)"
                  : "var(--color-text-secondary)",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setDescriptions((prev) => !prev)}
          style={{
            fontFamily: "var(--typography-ko-font-family)",
            fontSize: 12,
            padding: "6px 12px",
            border: "1px solid var(--color-border-primary)",
            background: descriptions
              ? "var(--color-brand-primary)"
              : "transparent",
            color: descriptions
              ? "var(--color-text-inverse, #fff)"
              : "var(--color-text-secondary)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          descriptions: {descriptions ? "true" : "false"}
        </button>
      </div>

      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          ...labelStyle,
        }}
      >
        audioLevel: {audioLevel}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={audioLevel}
          onChange={(e) => setAudioLevel(Number(e.target.value))}
          disabled={state !== "listening"}
          style={{ width: "100%" }}
        />
      </label>
    </div>
  );
}

export const Interactive: Story = {
  name: "Interactive / State & Audio Level",
  parameters: {
    controls: { disable: true },
  },
  decorators: [],
  render: () => <InteractiveVoiceInputSheet />,
};

/* ========================================
 * Matrix — State × Descriptions
 * ======================================== */

export const AllVariants: Story = {
  name: "Matrix / All Variants",
  parameters: {
    controls: { disable: true },
  },
  decorators: [],
  render: () => {
    const descriptionFlags = [true, false] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={sectionLabelStyle}>state × descriptions</div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {STATES.flatMap((state) =>
              descriptionFlags.map((descriptions) => {
                const props: VoiceInputSheetProps = {
                  state,
                  descriptions,
                  audioLevel: state === "listening" ? 60 : 0,
                };

                return (
                  <div
                    key={`${state}-${descriptions}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      alignItems: "stretch",
                      width: 393,
                    }}
                  >
                    <div style={labelStyle}>
                      state={state} · descriptions={String(descriptions)}
                    </div>
                    <VoiceInputSheet {...props} onClose={fn()} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={sectionLabelStyle}>listening × audioLevel</div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {AUDIO_LEVELS.map((level) => (
              <div
                key={level}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  alignItems: "stretch",
                  width: 393,
                }}
              >
                <div style={labelStyle}>audioLevel={level}</div>
                <VoiceInputSheet
                  state="listening"
                  audioLevel={level}
                  onClose={fn()}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
