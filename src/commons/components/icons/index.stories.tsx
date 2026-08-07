import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Arrow,
  ArrowUndoUpRight,
  ArrowUp,
  CaretDownMD,
  CaretUpMD,
  ChevronDown,
  ChevronLeftMD,
  ChevronRight,
  ChevronUp,
  Circle,
  CloseLG,
  Edit,
  EditPencile,
  File,
  Icons,
  ImageIcon,
  Lock,
  LockOpen,
  Search,
  Triangle,
  Voice,
  type IconName,
  type IconThick,
} from "./index";

/* ========================================
 * Shared styles
 * ======================================== */

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

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
  gap: 16,
  width: 480,
};

const cellStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
};

const ICON_NAMES = Object.keys(Icons) as IconName[];

const STROKE_ICONS = [
  { name: "CaretDownMD", Component: CaretDownMD },
  { name: "CaretUpMD", Component: CaretUpMD },
  { name: "ChevronUp", Component: ChevronUp },
  { name: "ChevronDown", Component: ChevronDown },
  { name: "ChevronLeftMD", Component: ChevronLeftMD },
  { name: "Arrow", Component: Arrow },
  { name: "ChevronRight", Component: ChevronRight },
  { name: "ArrowUp", Component: ArrowUp },
  { name: "CloseLG", Component: CloseLG },
  { name: "Circle", Component: Circle },
  { name: "Triangle", Component: Triangle },
  { name: "ArrowUndoUpRight", Component: ArrowUndoUpRight },
  { name: "LockOpen", Component: LockOpen },
  { name: "Lock", Component: Lock },
  { name: "File", Component: File },
  { name: "Edit", Component: Edit },
  { name: "EditPencile", Component: EditPencile },
  { name: "Search", Component: Search },
] as const;

/* ========================================
 * Meta — playground uses Search (common stroke icon)
 * ======================================== */

const meta = {
  title: "Commons/Components/Icons",
  component: Search,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    thick: {
      control: "select",
      options: ["True", "False"],
      description: "Figma Thick — True | False",
    },
    title: {
      control: "text",
      description: "접근성 title",
    },
    className: { control: false },
  },
  args: {
    thick: "True",
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========================================
 * Playground
 * ======================================== */

export const Default: Story = {};

/* ========================================
 * Thick
 * ======================================== */

export const ThickTrue: Story = {
  name: "Thick / True",
  args: {
    thick: "True",
  },
};

export const ThickFalse: Story = {
  name: "Thick / False",
  args: {
    thick: "False",
  },
};

/* ========================================
 * Image — Fill
 * ======================================== */

export const ImageFillFalse: Story = {
  name: "Image / Fill False",
  parameters: {
    controls: { disable: true },
  },
  render: () => <ImageIcon fill="False" />,
};

export const ImageFillTrue: Story = {
  name: "Image / Fill True",
  parameters: {
    controls: { disable: true },
  },
  render: () => <ImageIcon fill="True" />,
};

/* ========================================
 * Voice — Size
 * ======================================== */

export const VoiceSm: Story = {
  name: "Voice / Size SM",
  parameters: {
    controls: { disable: true },
  },
  render: () => <Voice size="sm" />,
};

export const VoiceLg: Story = {
  name: "Voice / Size LG",
  parameters: {
    controls: { disable: true },
  },
  render: () => <Voice size="lg" />,
};

/* ========================================
 * Gallery — All Icons
 * ======================================== */

export const AllIcons: Story = {
  name: "Gallery / All Icons",
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={gridStyle}>
      {ICON_NAMES.map((name) => {
        const Icon = Icons[name];
        return (
          <div key={name} style={cellStyle}>
            <Icon />
            <span style={labelStyle}>{name}</span>
          </div>
        );
      })}
    </div>
  ),
};

/* ========================================
 * Matrix — Thick × Stroke Icons
 * ======================================== */

export const AllThickVariants: Story = {
  name: "Matrix / Thick Variants",
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const thicks: IconThick[] = ["True", "False"];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        {thicks.map((thick) => (
          <div
            key={thick}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={sectionLabelStyle}>thick={thick}</div>
            <div style={gridStyle}>
              {STROKE_ICONS.map(({ name, Component }) => (
                <div key={`${thick}-${name}`} style={cellStyle}>
                  <Component thick={thick} />
                  <span style={labelStyle}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* ========================================
 * Matrix — Special variants (Image · Voice)
 * ======================================== */

export const SpecialVariants: Story = {
  name: "Matrix / Special Variants",
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
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={sectionLabelStyle}>Image · fill</div>
        <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
          {(["False", "True"] as const).map((fill) => (
            <div key={fill} style={cellStyle}>
              <ImageIcon fill={fill} />
              <span style={labelStyle}>fill={fill}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={sectionLabelStyle}>Voice · size</div>
        <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
          {(["sm", "lg"] as const).map((size) => (
            <div key={size} style={cellStyle}>
              <Voice size={size} />
              <span style={labelStyle}>size={size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
