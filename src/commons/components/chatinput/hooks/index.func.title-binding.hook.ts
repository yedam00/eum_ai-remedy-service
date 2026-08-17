/* ========================================
 * Types
 * ======================================== */

export type TitleBindingItem = {
  label: string;
  selected?: boolean;
};

export type TitleBindingResult = {
  selectedItems: TitleBindingItem[];
  dropdownTitle: string;
  dropdownPointText: string;
};

/* ========================================
 * Constants
 * ======================================== */

const EMPTY_MEDICINE_TITLE = "복용 중인 약이 없음";

/* ========================================
 * Hook — medicine-search 대표 타이틀 / 뱃지
 * ======================================== */

export function useFuncTitleBinding(
  items: TitleBindingItem[]
): TitleBindingResult {
  const selectedItems = items.filter((item) => Boolean(item.selected));
  const selectedCount = selectedItems.length;
  const firstSelected = selectedItems[0];

  const dropdownTitle = firstSelected?.label ?? EMPTY_MEDICINE_TITLE;
  const dropdownPointText =
    selectedCount >= 2 ? `+${selectedCount - 1}개 선택됨` : "";

  return {
    selectedItems,
    dropdownTitle,
    dropdownPointText,
  };
}
