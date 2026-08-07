import {
  type ButtonHTMLAttributes,
  type ReactNode,
  type SVGProps,
} from "react";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Navigation variant API (3:3222)
 * ======================================== */

/** Figma State=`Default` | `Selected` */
export type NavigationState = "default" | "selected";

/** Figma menu=`home` | `history` | `profile` */
export type NavigationMenu = "home" | "history" | "profile";

export type NavigationProps = {
  menu?: NavigationMenu;
  state?: NavigationState;
  className?: string;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export type NavigationBarProps = {
  /** 현재 선택된 메뉴. 해당 아이템이 `selected` 상태로 표시됨 */
  selectedMenu?: NavigationMenu;
  onMenuClick?: (menu: NavigationMenu) => void;
  className?: string;
  disabled?: boolean;
};

/* ========================================
 * Menu meta
 * ======================================== */

const MENU_LABEL: Record<NavigationMenu, string> = {
  home: "홈",
  history: "기록",
  profile: "프로필",
};

const MENU_ORDER: NavigationMenu[] = ["home", "history", "profile"];

/* ========================================
 * Icons — Figma Navigation filled icons (24×24)
 * home / history / profile (nodes 2009:8535 · 8529 · 8532)
 * ======================================== */

type MenuIconProps = SVGProps<SVGSVGElement>;

/** Speech-bubble (chat) — Home · Figma Subtract 20×17 (node 3:1621) */
function HomeIcon({ className, ...props }: MenuIconProps) {
  return (
    <svg
      viewBox="0 0 20 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cx(styles.iconHome, className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2.2C0 0.98497 0.98497 0 2.2 0H17.8C19.015 0 20 0.98497 20 2.2V9.8C20 11.015 19.015 12 17.8 12H5.2L0 17V2.2ZM3.75 3.75C3.33579 3.75 3 4.08579 3 4.5C3 4.91421 3.33579 5.25 3.75 5.25H15.625C16.0392 5.25 16.375 4.91421 16.375 4.5C16.375 4.08579 16.0392 3.75 15.625 3.75H3.75ZM3.75 6.75C3.33579 6.75 3 7.08579 3 7.5C3 7.91421 3.33579 8.25 3.75 8.25H15.625C16.0392 8.25 16.375 7.91421 16.375 7.5C16.375 7.08579 16.0392 6.75 15.625 6.75H3.75ZM3.75 9.75C3.33579 9.75 3 10.0858 3 10.5C3 10.9142 3.33579 11.25 3.75 11.25H11.875C12.2892 11.25 12.625 10.9142 12.625 10.5C12.625 10.0858 12.2892 9.75 11.875 9.75H3.75Z"
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

const MENU_ICON: Record<NavigationMenu, (props: MenuIconProps) => JSX.Element> = {
  home: HomeIcon,
  history: HistoryIcon,
  profile: ProfileIcon,
};

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const STATE_CLASS: Record<NavigationState, string> = {
  default: styles.stateDefault,
  selected: styles.stateSelected,
};

/* ========================================
 * Navigation — single menu item (Figma variant)
 * ======================================== */

export function Navigation({
  menu = "home",
  state = "default",
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: NavigationProps) {
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
 * NavigationBar — equal flex layout of all menus
 * ======================================== */

export function NavigationBar({
  selectedMenu = "home",
  onMenuClick,
  className,
  disabled,
}: NavigationBarProps) {
  return (
    <nav className={cx(styles.bar, className)} aria-label="주요 메뉴">
      {MENU_ORDER.map((menu) => (
        <Navigation
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

export default Navigation;
