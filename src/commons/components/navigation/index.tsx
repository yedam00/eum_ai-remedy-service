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

/**
 * Speech-bubble (chat) — Home
 * Figma Subtract top-level frame: 20×16.989 (node 3:1621 · parent slot 24×24)
 */
function HomeIcon({ className, ...props }: MenuIconProps) {
  return (
    <svg
      viewBox="0 0 20 16.9891"
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
        d="M19 0C19.5523 0 20 0.447715 20 1V13.2109C19.9998 13.763 19.5521 14.2109 19 14.2109H5.33594C5.11809 14.211 4.9061 14.2816 4.73242 14.4131L1.60449 16.7842C0.945904 17.2833 0 16.8137 0 15.9873V1C0 0.447715 0.447715 0 1 0H19ZM5 9.2998C4.6134 9.2998 4.2998 9.6134 4.2998 10C4.2998 10.3866 4.6134 10.7002 5 10.7002H13C13.3866 10.7002 13.7002 10.3866 13.7002 10C13.7002 9.6134 13.3866 9.2998 13 9.2998H5ZM5 6.2998C4.6134 6.2998 4.2998 6.6134 4.2998 7C4.2998 7.3866 4.6134 7.7002 5 7.7002H16C16.3866 7.7002 16.7002 7.3866 16.7002 7C16.7002 6.6134 16.3866 6.2998 16 6.2998H5ZM5 3.2998C4.6134 3.2998 4.2998 3.6134 4.2998 4C4.2998 4.3866 4.6134 4.7002 5 4.7002H16C16.3866 4.7002 16.7002 4.3866 16.7002 4C16.7002 3.6134 16.3866 3.2998 16 3.2998H5Z"
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
