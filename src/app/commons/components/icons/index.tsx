import {
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma variant API
 * ======================================== */

/** Figma Thick variant (`Thick=True` | `Thick=False`) */
export type IconThick = "True" | "False";

/** Figma Image Fill variant */
export type IconFill = "True" | "False";

/** Figma Voice Size variant */
export type IconVoiceSize = "sm" | "lg";

export type IconBaseProps = {
  thick?: IconThick;
  size?: number;
  color?: string;
  className?: string;
  title?: string;
};

type SvgShellProps = IconBaseProps & {
  children: ReactNode;
  viewBox?: string;
  className?: string;
  wrapperClassName?: string;
};

/* ========================================
 * Stroke width map (Coolicons base = 2)
 * Thick=False → slightly thinner outline
 * ======================================== */

const STROKE_WIDTH: Record<IconThick, number> = {
  True: 2,
  False: 1.5,
};

const DEFAULT_THICK: IconThick = "True";

/* ========================================
 * Shared SVG shell
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

function IconSvg({
  thick = DEFAULT_THICK,
  size,
  color,
  className,
  wrapperClassName,
  children,
  viewBox = "0 0 24 24",
  title,
}: SvgShellProps) {
  const strokeWidth = STROKE_WIDTH[thick];
  const style: CSSProperties = {
    ...(size !== undefined ? { width: size, height: size } : undefined),
    ...(color !== undefined ? { color } : undefined),
  };

  const svgProps: SVGProps<SVGSVGElement> = {
    viewBox,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: styles.iconSvg,
    "aria-hidden": title ? undefined : true,
    role: title ? "img" : undefined,
  };

  return (
    <span
      className={cx(styles.icon, wrapperClassName, className)}
      style={style}
    >
      <svg {...svgProps}>
        {title ? <title>{title}</title> : null}
        <g
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {children}
        </g>
      </svg>
    </span>
  );
}

/* ========================================
 * Icons — Coolicons paths (Figma Icons frame)
 * ======================================== */

/** Caret_Down_MD */
export function CaretDownMD(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Caret Down MD"}>
      <path d="M16 10L12 14L8 10" />
    </IconSvg>
  );
}

/** Caret_Up_MD */
export function CaretUpMD(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Caret Up MD"}>
      <path d="M8 14L12 10L16 14" />
    </IconSvg>
  );
}

/** Chevron_Up */
export function ChevronUp(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Chevron Up"}>
      <path d="M5 16L12 9L19 16" />
    </IconSvg>
  );
}

/** Chevron_Down */
export function ChevronDown(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Chevron Down"}>
      <path d="M19 9L12 16L5 9" />
    </IconSvg>
  );
}

/** Chevron_Left_MD */
export function ChevronLeftMD(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Chevron Left MD"}>
      <path d="M14 16L10 12L14 8" />
    </IconSvg>
  );
}

/**
 * Arrow (Figma name)
 * Visual = Coolicons Chevron_Left (full-size)
 */
export function Arrow(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Arrow"}>
      <path d="M15 19L8 12L15 5" />
    </IconSvg>
  );
}

/** Chevron_Right */
export function ChevronRight(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Chevron Right"}>
      <path d="M9 5L16 12L9 19" />
    </IconSvg>
  );
}

/** Arrow_Up */
export function ArrowUp(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Arrow Up"}>
      <path d="M12 19V5M12 5L6 11M12 5L18 11" />
    </IconSvg>
  );
}

/** Close_LG */
export function CloseLG(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Close LG"}>
      <path d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001" />
    </IconSvg>
  );
}

/** Circle */
export function Circle(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Circle"}>
      <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" />
    </IconSvg>
  );
}

/** Triangle */
export function Triangle(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Triangle"}>
      <path d="M4.37891 15.1999C3.46947 16.775 3.01489 17.5634 3.08281 18.2097C3.14206 18.7734 3.43792 19.2851 3.89648 19.6182C4.42204 20.0001 5.3309 20.0001 7.14853 20.0001H16.8515C18.6691 20.0001 19.5778 20.0001 20.1034 19.6182C20.5619 19.2851 20.8579 18.7734 20.9172 18.2097C20.9851 17.5634 20.5307 16.775 19.6212 15.1999L14.7715 6.79986C13.8621 5.22468 13.4071 4.43722 12.8135 4.17291C12.2957 3.94236 11.704 3.94236 11.1862 4.17291C10.5928 4.43711 10.1381 5.22458 9.22946 6.79845L4.37891 15.1999Z" />
    </IconSvg>
  );
}

/** Arrow_Undo_Up_Right */
export function ArrowUndoUpRight(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Arrow Undo Up Right"}>
      <path d="M17 13L21 9M21 9L17 5M21 9H8C5.23858 9 3 11.2386 3 14C3 16.7614 5.23858 19 8 19H13" />
    </IconSvg>
  );
}

/** Lock_Open */
export function LockOpen(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Lock Open"}>
      <path d="M9 9H7.2002C6.08009 9 5.51962 9 5.0918 9.21799C4.71547 9.40973 4.40973 9.71547 4.21799 10.0918C4 10.5196 4 11.0801 4 12.2002V17.8002C4 18.9203 4 19.4801 4.21799 19.9079C4.40973 20.2842 4.71547 20.5905 5.0918 20.7822C5.51921 21 6.07901 21 7.19694 21L16.8031 21C17.921 21 18.48 21 18.9074 20.7822C19.2837 20.5905 19.5905 20.2842 19.7822 19.9079C20 19.4805 20 18.9215 20 17.8036V12.1969C20 11.079 20 10.5192 19.7822 10.0918C19.5905 9.71547 19.2837 9.40973 18.9074 9.21799C18.4796 9 17.9203 9 16.8002 9H9ZM9 9V6.12012C9 4.39699 10.3 3 11.9037 3C12.7277 3 13.4708 3.36879 13.9993 3.96113" />
    </IconSvg>
  );
}

/** Lock */
export function Lock(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Lock"}>
      <path d="M9.23047 9H7.2002C6.08009 9 5.51962 9 5.0918 9.21799C4.71547 9.40973 4.40973 9.71547 4.21799 10.0918C4 10.5196 4 11.0801 4 12.2002V17.8002C4 18.9203 4 19.4801 4.21799 19.9079C4.40973 20.2842 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07902 21 7.19694 21H16.8031C17.921 21 18.48 21 18.9074 20.7822C19.2837 20.5905 19.5905 20.2842 19.7822 19.9079C20 19.4805 20 18.9215 20 17.8036V12.1969C20 11.079 20 10.5192 19.7822 10.0918C19.5905 9.71547 19.2837 9.40973 18.9074 9.21799C18.4796 9 17.9203 9 16.8002 9H14.7689M9.23047 9H14.7689M9.23047 9C9.10302 9 9 8.89668 9 8.76923V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8.76923C15 8.89668 14.8964 9 14.7689 9" />
    </IconSvg>
  );
}

/** File (File_Document — text lines in Figma) */
export function File(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "File"}>
      <path d="M9 17H15M9 14H15M13.0004 3.00087C12.9048 3 12.7974 3 12.6747 3H8.2002C7.08009 3 6.51962 3 6.0918 3.21799C5.71547 3.40973 5.40973 3.71547 5.21799 4.0918C5 4.51962 5 5.08009 5 6.2002V17.8002C5 18.9203 5 19.4801 5.21799 19.9079C5.40973 20.2842 5.71547 20.5905 6.0918 20.7822C6.51921 21 7.079 21 8.19694 21L15.8031 21C16.921 21 17.48 21 17.9074 20.7822C18.2837 20.5905 18.5905 20.2842 18.7822 19.9079C19 19.4805 19 18.9215 19 17.8036V9.32568C19 9.20302 18.9999 9.09553 18.999 9M13.0004 3.00087C13.2858 3.00348 13.4657 3.01407 13.6382 3.05547C13.8423 3.10446 14.0379 3.18526 14.2168 3.29492C14.4186 3.41857 14.5918 3.59181 14.9375 3.9375L18.063 7.06298C18.4089 7.40889 18.5809 7.58136 18.7046 7.78319C18.8142 7.96214 18.8953 8.15726 18.9443 8.36133C18.9857 8.53379 18.9964 8.71454 18.999 9M13.0004 3.00087L13 5.80021C13 6.92031 13 7.48015 13.218 7.90797C13.4097 8.2843 13.7155 8.59048 14.0918 8.78223C14.5192 9 15.079 9 16.1969 9H18.999" />
    </IconSvg>
  );
}

/** Edit (Edit_Pencil_01) */
export function Edit(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Edit"}>
      <path d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" />
    </IconSvg>
  );
}

/** Edit_pencile (Figma name) → Edit_Pencil_02 */
export function EditPencile(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Edit Pencil"}>
      <path d="M4 16.0001V20.0001L8 20.0001L18.8686 9.13146L18.8695 9.13061C19.265 8.73516 19.4628 8.53736 19.5369 8.3092C19.6021 8.10835 19.6022 7.89201 19.5369 7.69117C19.4627 7.46284 19.2646 7.26474 18.8686 6.86872L17.1288 5.12892C16.7345 4.7346 16.5369 4.53704 16.3091 4.46301C16.1082 4.39775 15.8919 4.39775 15.691 4.46301C15.463 4.53709 15.2652 4.73488 14.8704 5.12976L14.8686 5.13146L4 16.0001Z" />
    </IconSvg>
  );
}

/** search */
export function Search(props: IconBaseProps) {
  return (
    <IconSvg {...props} title={props.title ?? "Search"}>
      <path d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" />
    </IconSvg>
  );
}

/* ========================================
 * Image — Fill=True | Fill=False (Figma)
 * ======================================== */

export type ImageIconProps = Omit<IconBaseProps, "thick"> & {
  fill?: IconFill;
};

export function ImageIcon({
  fill = "False",
  size,
  color,
  className,
  title = "Image",
}: ImageIconProps) {
  const style: CSSProperties = {
    ...(size !== undefined ? { width: size, height: size } : undefined),
    ...(color !== undefined ? { color } : undefined),
  };

  const isFilled = fill === "True";

  return (
    <span className={cx(styles.icon, styles.sizeImage, className)} style={style}>
      <svg
        viewBox="0 0 30 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.iconSvg}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {isFilled ? (
          <>
            <path
              d="M3 6.2C3 4.98 3 4.37 3.22 3.94C3.41 3.56 3.72 3.26 4.09 3.07C4.52 2.85 5.08 2.85 6.2 2.85H18.8C19.92 2.85 20.48 2.85 20.91 3.07C21.28 3.26 21.59 3.56 21.78 3.94C22 4.37 22 4.97 22 6.09V16.91C22 18.03 22 18.59 21.78 19.02C21.59 19.39 21.28 19.7 20.91 19.89C20.48 20.11 19.92 20.11 18.8 20.11H6.2C5.08 20.11 4.52 20.11 4.09 19.89C3.72 19.7 3.41 19.39 3.22 19.02C3 18.59 3 18.03 3 16.91V6.2Z"
              fill="currentColor"
            />
            <path
              d="M3.5 17.5L8.2 12.1C8.5 11.75 8.95 11.75 9.25 12.1L13.1 16.5L15.4 14.2C15.7 13.9 16.15 13.9 16.45 14.2L21.5 19.1"
              stroke="var(--color-bg-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16.5" cy="8" r="1.6" fill="var(--color-bg-primary)" />
            <path
              d="M24.5 3.5V8.5M22 6H27"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <rect
              x="2.5"
              y="3.5"
              width="20"
              height="17"
              rx="2.2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M3.5 17.5L8.2 12.1C8.5 11.75 8.95 11.75 9.25 12.1L13.1 16.5L15.4 14.2C15.7 13.9 16.15 13.9 16.45 14.2L21.5 19.1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="16.5"
              cy="8"
              r="1.6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M24.5 3.5V8.5M22 6H27"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </span>
  );
}

/* ========================================
 * Voice — Size=sm | Size=lg (Figma)
 * ======================================== */

export type VoiceIconProps = Omit<IconBaseProps, "thick"> & {
  sizeVariant?: IconVoiceSize;
};

export function Voice({
  sizeVariant = "sm",
  size,
  color,
  className,
  title = "Voice",
}: VoiceIconProps) {
  const isLg = sizeVariant === "lg";
  const defaultPx = isLg ? 32 : 24;
  const style: CSSProperties = {
    width: size ?? defaultPx,
    height: size ?? defaultPx,
    ...(color !== undefined ? { color } : undefined),
  };

  return (
    <span
      className={cx(styles.icon, isLg && styles.sizeLg, className)}
      style={style}
    >
      <svg
        viewBox={isLg ? "0 0 32 32" : "0 0 24 24"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.iconSvg}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {isLg ? (
          <>
            <rect
              x="10"
              y="0"
              width="11.2"
              height="20.8"
              rx="5.6"
              fill="currentColor"
            />
            <path
              d="M6.8 17.6C6.8 22.3 10.6 26.1 15.3 26.1C20 26.1 23.8 22.3 23.8 17.6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M15.6 26.1V32"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <rect
              x="8.8"
              y="2"
              width="7"
              height="13"
              rx="3.5"
              fill="currentColor"
            />
            <path
              d="M6.8 13C6.8 16.3 9.2 19 12.3 19C15.4 19 17.8 16.3 17.8 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M12.3 19V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </span>
  );
}

/* ========================================
 * Aggregated export map (optional lookup)
 * ======================================== */

export const Icons = {
  CaretDownMD,
  CaretUpMD,
  ChevronUp,
  ChevronDown,
  ChevronLeftMD,
  Arrow,
  ChevronRight,
  ArrowUp,
  CloseLG,
  Circle,
  Triangle,
  ArrowUndoUpRight,
  LockOpen,
  Image: ImageIcon,
  Voice,
  File,
  Edit,
  EditPencile,
  Lock,
  Search,
} as const;

export type IconName = keyof typeof Icons;

export default Icons;
