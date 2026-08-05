import {
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from "react";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma GNB variant API (3:3222)
 * ======================================== */

/** Figma State=`Default` | `Selected` */
export type GnbState = "default" | "selected";

/** Figma menu=`home` | `history` | `profile` */
export type GnbMenu = "home" | "history" | "profile";

export type GnbProps = {
  menu?: GnbMenu;
  state?: GnbState;
  className?: string;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export type GnbBarProps = {
  /** 현재 선택된 메뉴. 해당 아이템이 `selected` 상태로 표시됨 */
  selectedMenu?: GnbMenu;
  onMenuClick?: (menu: GnbMenu) => void;
  className?: string;
  disabled?: boolean;
};

/* ========================================
 * Menu meta
 * ======================================== */

const MENU_LABEL: Record<GnbMenu, string> = {
  home: "홈",
  history: "기록",
  profile: "프로필",
};

const MENU_ORDER: GnbMenu[] = ["home", "history", "profile"];

/* ========================================
 * Icons — Figma GNB filled icons (24×24)
 * Home / History / Profile 은 icons 세트에 없어 GNB 전용으로 구성
 * ======================================== */

type MenuIconProps = SVGProps<SVGSVGElement>;

function HomeIcon(props: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 5.25C4.5 4.007 5.507 3 6.75 3h10.5C18.493 3 19.5 4.007 19.5 5.25v8.5c0 1.243-1.007 2.25-2.25 2.25H13.5l-2.4 2.4a.75.75 0 0 1-1.28-.53V16H6.75A2.25 2.25 0 0 1 4.5 13.75v-8.5ZM8 7.25a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8Zm0 3a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5H8Z"
      />
    </svg>
  );
}

function HistoryIcon(props: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM12.75 7a.75.75 0 0 0-1.5 0v5c0 .199.079.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V7Z"
      />
    </svg>
  );
}

function ProfileIcon(props: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 4a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 4ZM6.5 15.25c0-1.795 2.239-3 5.5-3s5.5 1.205 5.5 3V18a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6.5 18v-2.75Z"
      />
    </svg>
  );
}

const MENU_ICON: Record<GnbMenu, (props: MenuIconProps) => ReactElement> = {
  home: HomeIcon,
  history: HistoryIcon,
  profile: ProfileIcon,
};

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const STATE_CLASS: Record<GnbState, string> = {
  default: styles.stateDefault,
  selected: styles.stateSelected,
};

/* ========================================
 * Gnb — single menu item (Figma variant)
 * ======================================== */

export function Gnb({
  menu = "home",
  state = "default",
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: GnbProps) {
  const isDisabled = Boolean(disabled);
  const Icon = MENU_ICON[menu];
  const label = children ?? MENU_LABEL[menu];

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-current={state === "selected" ? "page" : undefined}
      className={cx(
        styles.item,
        STATE_CLASS[state],
        className
      )}
      {...rest}
    >
      <span className={styles.iconSlot}>
        <Icon />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}

/* ========================================
 * GnbBar — equal flex layout of all menus
 * ======================================== */

export function GnbBar({
  selectedMenu = "home",
  onMenuClick,
  className,
  disabled,
}: GnbBarProps) {
  return (
    <nav className={cx(styles.bar, className)} aria-label="주요 메뉴">
      {MENU_ORDER.map((menu) => (
        <Gnb
          key={menu}
          menu={menu}
          state={selectedMenu === menu ? "selected" : "default"}
          disabled={disabled}
          onClick={() => onMenuClick?.(menu)}
        />
      ))}
    </nav>
  );
}

export default Gnb;
