import {
  type ButtonHTMLAttributes,
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
 * home / history / profile (nodes 2009:8535 · 8529 · 8532)
 * ======================================== */

type MenuIconProps = SVGProps<SVGSVGElement>;

/** Speech-bubble (chat) — Home · Figma 2009:8535 */
function HomeIcon(props: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 6.2C4 4.98497 4.98497 4 6.2 4H17.8C19.015 4 20 4.98497 20 6.2V13.8C20 15.015 19.015 16 17.8 16H9.2L4 21V6.2ZM7 7.75C6.58579 7.75 6.25 8.08579 6.25 8.5C6.25 8.91421 6.58579 9.25 7 9.25H16.5C16.9142 9.25 17.25 8.91421 17.25 8.5C17.25 8.08579 16.9142 7.75 16.5 7.75H7ZM7 10.75C6.58579 10.75 6.25 11.0858 6.25 11.5C6.25 11.9142 6.58579 12.25 7 12.25H16.5C16.9142 12.25 17.25 11.9142 17.25 11.5C17.25 11.0858 16.9142 10.75 16.5 10.75H7ZM7 13.75C6.58579 13.75 6.25 14.0858 6.25 14.5C6.25 14.9142 6.58579 15.25 7 15.25H13.5C13.9142 15.25 14.25 14.9142 14.25 14.5C14.25 14.0858 13.9142 13.75 13.5 13.75H7Z"
      />
    </svg>
  );
}

/** Clock — History · Figma 2009:8529 */
function HistoryIcon(props: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM13 7.5C13 6.94772 12.5523 6.5 12 6.5C11.4477 6.5 11 6.94772 11 7.5V12C11 12.5523 11.4477 13 12 13H15.5C16.0523 13 16.5 12.5523 16.5 12C16.5 11.4477 16.0523 11 15.5 11H13V7.5Z"
      />
    </svg>
  );
}

/** User silhouette — Profile · Figma 2009:8532 */
function ProfileIcon(props: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3ZM5.25 18.75C5.25 16.1266 8.07452 14.5 12 14.5C15.9255 14.5 18.75 16.1266 18.75 18.75V20C18.75 20.6904 18.1904 21.25 17.5 21.25H6.5C5.80964 21.25 5.25 20.6904 5.25 20V18.75Z"
      />
    </svg>
  );
}

const MENU_ICON: Record<GnbMenu, (props: MenuIconProps) => JSX.Element> = {
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
      className={cx(styles.item, STATE_CLASS[state], className)}
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
