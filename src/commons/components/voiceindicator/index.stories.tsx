import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import {
  VoiceIndicator,
  type VoiceIndicatorState,
} from "./index";

const STATES: VoiceIndicatorState[] = ["default", "listening", "success"];
const AUDIO_LEVELS = [0, 30, 60, 100] as const;

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

const meta = {
  title: "Commons/Components/VoiceIndicator",
  component: VoiceIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    state: {
      control: "select",
      options: STATES,
      description: "Figma State — default | listening | success",
    },
    audioLevel: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description:
        "소리 크기 (0 ~ 100). listening일 때 막대 높이·애니메이션 속도·증폭에 사용",
    },
    className: { control: false },
  },
  args: {
    state: "default",
    audioLevel: 0,
  },
} satisfies Meta<typeof VoiceIndicator>;

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
 * Interactive
 * ======================================== */

function InteractiveVoiceIndicator() {
  const [state, setState] = useState<VoiceIndicatorState>("listening");
  const [audioLevel, setAudioLevel] = useState(50);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
        minWidth: 240,
      }}
    >
      <VoiceIndicator state={state} audioLevel={audioLevel} />

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
      </div>

      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          maxWidth: 240,
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
          onChange={(event) => setAudioLevel(Number(event.target.value))}
          disabled={state !== "listening"}
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
  render: () => <InteractiveVoiceIndicator />,
};

/* ========================================
 * Matrix — State × Audio Level
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
        gap: 32,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={sectionLabelStyle}>State</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "flex-start",
          }}
        >
          {STATES.map((state) => (
            <div
              key={state}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={labelStyle}>state={state}</div>
              <VoiceIndicator
                state={state}
                audioLevel={state === "listening" ? 60 : 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={sectionLabelStyle}>Audio Level (listening)</div>
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
                alignItems: "center",
              }}
            >
              <div style={labelStyle}>audioLevel={level}</div>
              <VoiceIndicator state="listening" audioLevel={level} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
