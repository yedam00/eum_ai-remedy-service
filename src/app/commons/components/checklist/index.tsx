"use client";

import {
  useState,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import { Checkbox } from "../checkbox";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma CheckList (3:3511)
 * ======================================== */

export type ChecklistItem = {
  id: string;
  label: string;
};

export type ChecklistProps = {
  /** 체크리스트 항목 (2~4개). 미전달 시 피그마 기본 4개 문구 사용 */
  items?: ChecklistItem[];
  /** 선택된 항목 ID 목록 변경 시 호출 */
  onChange?: (selectedIds: string[]) => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange">;

/* ========================================
 * Constants — Figma CheckList default copy
 * ======================================== */

const DEFAULT_LABEL = "어지럽거나 속이 메스껍고, 토할 것 같다";

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: "1", label: DEFAULT_LABEL },
  { id: "2", label: DEFAULT_LABEL },
  { id: "3", label: DEFAULT_LABEL },
  { id: "4", label: DEFAULT_LABEL },
];

const MIN_ITEMS = 2;
const MAX_ITEMS = 4;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

/** items를 2~4개 범위로 정규화 */
function normalizeItems(items?: ChecklistItem[]): ChecklistItem[] {
  if (!items || items.length < MIN_ITEMS) {
    return DEFAULT_ITEMS;
  }
  return items.slice(0, MAX_ITEMS);
}

/* ========================================
 * Sub-parts — Figma CheckListItem
 * ======================================== */

function ChecklistRow({
  item,
  selected,
  onToggle,
}: {
  item: ChecklistItem;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const handleRowClick = () => {
    onToggle(item.id);
  };

  const handleCheckboxClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggle(item.id);
  };

  return (
    <div className={styles.item} onClick={handleRowClick}>
      <span className={styles.label}>{item.label}</span>
      <div className={styles.checkboxSlot}>
        <Checkbox
          state={selected ? "selected" : "default"}
          onClick={handleCheckboxClick}
          aria-label={item.label}
        />
      </div>
    </div>
  );
}

/* ========================================
 * Component — Figma CheckList · 3:3511
 * ======================================== */

export function Checklist({
  items,
  onChange,
  className,
  ...rest
}: ChecklistProps) {
  const resolvedItems = normalizeItems(items);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id];
      onChange?.(next);
      return next;
    });
  };

  return (
    <div
      role="group"
      aria-label="체크리스트"
      className={cx(styles.root, className)}
      {...rest}
    >
      {resolvedItems.map((item) => (
        <ChecklistRow
          key={item.id}
          item={item}
          selected={selectedIds.includes(item.id)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}

export default Checklist;
