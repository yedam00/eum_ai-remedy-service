"use client";

import {
  useEffect,
  useState,
  type HTMLAttributes,
} from "react";
import { Checkbox } from "../checkbox";
import { ChevronDown, ChevronUp } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Dropdown variant API (3:3315)
 * ======================================== */

/** Figma Expanded=`False` | `True` */
export type DropdownExpanded = "False" | "True";

export type DropdownItemData = {
  id: string;
  label: string;
  /** 우측 부가 텍스트 (Figma: 아침/저녁) */
  meta?: string;
  /** Checkbox state — true → selected, false → default */
  selected?: boolean;
};

export type DropdownProps = {
  /** Figma Expanded — `False` | `True` */
  expanded?: DropdownExpanded;
  /** 드롭다운 헤더 제목 (Figma Title · 기본값: 복약 중인 약) */
  title?: string;
  /** 우측 선택 상태 텍스트 (기본값: +3개 선택됨) */
  pointText?: string;
  /** 확장 목록 항목 (기본값: 피그마 4개 약 목록) */
  items?: DropdownItemData[];
  /** 헤더(펼치기/접기) 클릭 */
  onToggleExpanded?: () => void;
  /** 항목 체크 토글 */
  onItemToggle?: (id: string) => void;
  /** 약 추가하기 클릭 */
  onAddClick?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "title" | "children">;

/* ========================================
 * Constants — Figma defaults
 * ======================================== */

const DEFAULT_TITLE = "복약 중인 약";
const DEFAULT_POINT_TEXT = "+3개 선택됨";
const DEFAULT_META = "아침/저녁";

const DEFAULT_ITEMS: DropdownItemData[] = [
  { id: "1", label: "당뇨약", meta: DEFAULT_META, selected: true },
  { id: "2", label: "고지혈증약", meta: DEFAULT_META, selected: true },
  { id: "3", label: "고혈압약", meta: DEFAULT_META, selected: true },
  { id: "4", label: "진통제", meta: DEFAULT_META, selected: true },
];

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/* ========================================
 * Sub-parts
 * ======================================== */

/** Figma Frame 217 — 48 circular slot + two-tone pill (Rect 39/40) */
function PillIcon() {
  return (
    <span className={styles.pillIcon} aria-hidden>
      <span className={styles.pillGraphic}>
        <span className={styles.pillLight} />
        <span className={styles.pillDark} />
      </span>
    </span>
  );
}

/** Figma Union — 16×16 plus for 약 추가하기 */
function PlusIcon() {
  return (
    <svg
      className={styles.plusSvg}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 3.333V12.667M3.333 8H12.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DropdownHeader({
  title,
  pointText,
  expanded,
  onToggle,
}: {
  title: string;
  pointText: string;
  expanded: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className={styles.header}>
      <span className={styles.headerLeft}>
        <PillIcon />
        <span className={styles.title}>{title}</span>
        <span className={styles.pointText}>{pointText}</span>
      </span>
      {/* chevronSlot — expanded 양방향 토글 */}
      <button
        type="button"
        className={styles.chevronSlot}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={expanded ? "목록 접기" : "목록 펼치기"}
      >
        {expanded ? (
          <ChevronUp size={24} color="currentColor" />
        ) : (
          <ChevronDown size={24} color="currentColor" />
        )}
      </button>
    </div>
  );
}

function DropdownItemRow({
  item,
  onToggle,
}: {
  item: DropdownItemData;
  onToggle?: (id: string) => void;
}) {
  const isSelected = Boolean(item.selected);

  const handleToggle = () => {
    onToggle?.(item.id);
  };

  return (
    <div
      className={styles.item}
      role="option"
      aria-selected={isSelected}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleToggle();
        }
      }}
      tabIndex={0}
    >
      <div className={styles.itemLeft}>
        <span className={styles.checkboxSlot}>
          {/*
           * Checkbox 원본 수정 없이 state만 사용.
           * size는 공통 컴포넌트 24×24로 피그마와 일치.
           */}
          <Checkbox
            state={isSelected ? "selected" : "default"}
            tabIndex={-1}
            onClick={(event) => {
              event.stopPropagation();
              handleToggle();
            }}
          />
        </span>
        <span className={styles.itemLabel}>{item.label}</span>
      </div>
      {item.meta ? (
        <span className={styles.itemMeta}>{item.meta}</span>
      ) : null}
    </div>
  );
}

function AddMedicineButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className={styles.addButton}
      onClick={onClick}
    >
      <span className={styles.addIcon} aria-hidden>
        <PlusIcon />
      </span>
      <span className={styles.addLabel}>약 추가하기</span>
    </button>
  );
}

/* ========================================
 * Component — Figma Dropdown · 3:3315
 * ======================================== */

export function Dropdown({
  expanded = "False",
  title = DEFAULT_TITLE,
  pointText = DEFAULT_POINT_TEXT,
  items = DEFAULT_ITEMS,
  onToggleExpanded,
  onItemToggle,
  onAddClick,
  className,
  ...rest
}: DropdownProps) {
  const isExpandedControlled = onToggleExpanded !== undefined;
  const isItemsControlled = onItemToggle !== undefined;

  const [internalExpanded, setInternalExpanded] =
    useState<DropdownExpanded>(expanded);
  const [internalItems, setInternalItems] =
    useState<DropdownItemData[]>(items);

  useEffect(() => {
    setInternalExpanded(expanded);
  }, [expanded]);

  useEffect(() => {
    setInternalItems(items);
  }, [items]);

  const resolvedExpanded = isExpandedControlled ? expanded : internalExpanded;
  const resolvedItems = isItemsControlled ? items : internalItems;
  const isExpanded = resolvedExpanded === "True";

  /** chevronSlot 클릭 — expanded False ↔ True 양방향 토글 */
  const handleToggleExpanded = () => {
    if (isExpandedControlled) {
      onToggleExpanded();
      return;
    }
    setInternalExpanded((prev) => (prev === "True" ? "False" : "True"));
  };

  const handleItemToggle = (id: string) => {
    if (isItemsControlled) {
      onItemToggle(id);
      return;
    }
    setInternalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  return (
    <div
      className={cx(
        styles.root,
        isExpanded ? styles.expandedTrue : styles.expandedFalse,
        className
      )}
      data-expanded={resolvedExpanded}
      {...rest}
    >
      <div className={styles.card}>
        <DropdownHeader
          title={title}
          pointText={pointText}
          expanded={isExpanded}
          onToggle={handleToggleExpanded}
        />

        {isExpanded ? (
          <>
            <div className={styles.itemList} role="listbox">
              {resolvedItems.map((item) => (
                <DropdownItemRow
                  key={item.id}
                  item={item}
                  onToggle={handleItemToggle}
                />
              ))}
            </div>
            <div className={styles.addRow}>
              <AddMedicineButton onClick={onAddClick} />
            </div>
          </>
        ) : null}
      </div>

      {!isExpanded ? (
        <div className={styles.addRow}>
          <AddMedicineButton onClick={onAddClick} />
        </div>
      ) : null}
    </div>
  );
}

export default Dropdown;
