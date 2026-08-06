import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import {
  Navigation,
  NavigationBar,
  type NavigationMenu,
  type NavigationState,
} from "./index";

const MENUS: NavigationMenu[] = ["home", "history", "profile"];
const STATES: NavigationState[] = ["default", "selected"];

const meta = {
  title: "Commons/Components/Navigation",
  component: Navigation,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    menu: {
      control: "select",
      options: MENUS,
      description: "Figma menu — home | history | profile",
    },
    state: {
      control: "select",
      options: STATES,
      description: "Figma State — Default | Selected",
    },
    disabled: {
      control: "boolean",
      description: "HTML disabled",
    },
    children: {
      control: "text",
      description: "커스텀 라벨 (미지정 시 menu 기본 라벨)",
    },
    className: { control: false },
  },
  args: {
    menu: "home",
    state: "default",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Navigation>;

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
    menu: "home",
    state: "default",
  },
};

export const StateSelected: Story = {
  name: "State / Selected",
  args: {
    menu: "home",
    state: "selected",
  },
};

/* ========================================
 * Menu
 * ======================================== */

export const MenuHome: Story = {
  name: "Menu / Home",
  args: {
    menu: "home",
    state: "selected",
  },
};

export const MenuHistory: Story = {
  name: "Menu / History",
  args: {
    menu: "history",
    state: "selected",
  },
};

export const MenuProfile: Story = {
  name: "Menu / Profile",
  args: {
    menu: "profile",
    state: "selected",
  },
};

/* ========================================
 * Disabled
 * ======================================== */

export const DisabledDefault: Story = {
  name: "Disabled / Default",
  args: {
    menu: "home",
    state: "default",
    disabled: true,
  },
};

export const DisabledSelected: Story = {
  name: "Disabled / Selected",
  args: {
    menu: "home",
    state: "selected",
    disabled: true,
  },
};

/* ========================================
 * NavigationBar
 * ======================================== */

export const BarHomeSelected: Story = {
  name: "Bar / Home Selected",
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
  render: () => (
    <NavigationBar selectedMenu="home" onMenuClick={fn()} />
  ),
};

export const BarHistorySelected: Story = {
  name: "Bar / History Selected",
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
  render: () => (
    <NavigationBar selectedMenu="history" onMenuClick={fn()} />
  ),
};

export const BarProfileSelected: Story = {
  name: "Bar / Profile Selected",
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
  render: () => (
    <NavigationBar selectedMenu="profile" onMenuClick={fn()} />
  ),
};

export const BarDisabled: Story = {
  name: "Bar / Disabled",
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
  render: () => (
    <NavigationBar selectedMenu="home" disabled onMenuClick={fn()} />
  ),
};

function InteractiveNavigationBar() {
  const [selectedMenu, setSelectedMenu] = useState<NavigationMenu>("home");

  return (
    <NavigationBar
      selectedMenu={selectedMenu}
      onMenuClick={setSelectedMenu}
    />
  );
}

export const BarInteractive: Story = {
  name: "Bar / Interactive",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 393, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <InteractiveNavigationBar />,
};

/* ========================================
 * Matrix — menu × state
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
          }}
        >
          <div
            style={{
              fontFamily: "var(--typography-ko-font-family)",
              fontSize: 14,
              color: "var(--color-text-secondary)",
            }}
          >
            state={state}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
            }}
          >
            {MENUS.map((menu) => (
              <Navigation key={`${state}-${menu}`} menu={menu} state={state} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
