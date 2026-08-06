import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import Image from "next/image";
import { Edit } from "../icons";
import styles from "./styles.module.css";

/* ========================================
 * Types — Figma Summary_Item variant API (3:3367)
 * ======================================== */

/** Figma varient=`Default` | `List` | `Media` | `Opinion` */
export type SummaryItemVariant = "default" | "list" | "media" | "opinion";

export type SummaryItemProps = {
  /** Figma varient — `default` | `list` | `media` | `opinion` */
  variant?: SummaryItemVariant;
  /**
   * 질문/섹션 라벨 (default · list · media).
   * 미전달 시 피그마 기본 문구 사용.
   */
  label?: string;
  /**
   * 답변 텍스트.
   * - default / opinion: string
   * - list: string | string[]
   * 미전달 시 피그마 기본 문구 사용.
   */
  answerLabel?: string | string[];
  /**
   * media variant일 때 노출할 이미지 URL 목록 (최대 6개).
   * 미전달 시 빈 슬롯 6개 표시.
   */
  imageUrls?: string[];
  /**
   * opinion variant 제목.
   * 미전달 시 피그마 기본 문구("환자 추가 질문") 사용.
   */
  title?: string;
  /** default / list 편집(연필) 버튼 클릭 */
  onEdit?: () => void;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "title">;

/* ========================================
 * Constants — Figma Summary_Item default copy
 * ======================================== */

const DEFAULT_LABEL_BY_VARIANT: Record<
  Exclude<SummaryItemVariant, "opinion">,
  string
> = {
  default: "다친 적이 있나요?",
  list: "어떤 증상이 있나요?",
  media: "첨부한 사진",
};

const DEFAULT_ANSWER = "머리가 어지러움";

const DEFAULT_LIST_ANSWERS = [
  DEFAULT_ANSWER,
  DEFAULT_ANSWER,
  DEFAULT_ANSWER,
];

const DEFAULT_OPINION_TITLE = "환자 추가 질문";

const DEFAULT_OPINION_BODY =
  "재발하지 않으려면 평상시에 어떻게 관리해야할까요?";

const MEDIA_SLOT_COUNT = 6;

/* ========================================
 * Helpers
 * ======================================== */

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const VARIANT_CLASS: Record<SummaryItemVariant, string | undefined> = {
  default: styles.variantDefault,
  list: styles.variantList,
  media: undefined,
  opinion: styles.variantOpinion,
};

function toAnswerList(answerLabel?: string | string[]): string[] {
  if (answerLabel === undefined) {
    return DEFAULT_LIST_ANSWERS;
  }
  if (Array.isArray(answerLabel)) {
    return answerLabel.length > 0 ? answerLabel : DEFAULT_LIST_ANSWERS;
  }
  return [answerLabel];
}

function resolveAnswer(answerLabel?: string | string[]): string {
  if (typeof answerLabel === "string" && answerLabel.length > 0) {
    return answerLabel;
  }
  if (Array.isArray(answerLabel) && answerLabel[0]) {
    return answerLabel[0];
  }
  return DEFAULT_ANSWER;
}

/* ========================================
 * Sub-parts
 * ======================================== */

function EditButton({ onClick }: { onClick?: () => void }) {
  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (
    event
  ) => {
    event.stopPropagation();
    onClick?.();
  };

  return (
    <button
      type="button"
      className={styles.editButton}
      onClick={handleClick}
      aria-label="수정"
    >
      <span className={styles.editIcon} aria-hidden>
        <Edit size={24} color="currentColor" />
      </span>
    </button>
  );
}

function QuestionHeader({
  label,
  onEdit,
}: {
  label: string;
  onEdit?: () => void;
}) {
  return (
    <div className={styles.header}>
      <p className={styles.label}>{label}</p>
      <EditButton onClick={onEdit} />
    </div>
  );
}

function DefaultBody({
  label,
  answerLabel,
  onEdit,
}: {
  label: string;
  answerLabel?: string | string[];
  onEdit?: () => void;
}) {
  return (
    <>
      <QuestionHeader label={label} onEdit={onEdit} />
      <p className={styles.answer}>{resolveAnswer(answerLabel)}</p>
    </>
  );
}

function ListBody({
  label,
  answerLabel,
  onEdit,
}: {
  label: string;
  answerLabel?: string | string[];
  onEdit?: () => void;
}) {
  const answers = toAnswerList(answerLabel);

  return (
    <>
      <QuestionHeader label={label} onEdit={onEdit} />
      <div className={styles.answerList}>
        {answers.map((answer, index) => (
          <p key={`${answer}-${index}`} className={styles.answer}>
            {answer}
          </p>
        ))}
      </div>
    </>
  );
}

function MediaBody({
  label,
  imageUrls,
}: {
  label: string;
  imageUrls?: string[];
}) {
  const urls = imageUrls ?? [];
  const slots = Array.from({ length: MEDIA_SLOT_COUNT }, (_, index) =>
    urls[index]
  );

  return (
    <>
      <p className={styles.label}>{label}</p>
      <div className={styles.mediaGrid}>
        {slots.map((url, index) => (
          <div key={index} className={styles.mediaSlot}>
            {url ? (
              <Image
                className={styles.mediaImage}
                src={url}
                alt=""
                width={96}
                height={96}
              />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

function OpinionBody({
  title,
  answerLabel,
}: {
  title: string;
  answerLabel?: string | string[];
}) {
  const body =
    typeof answerLabel === "string" && answerLabel.length > 0
      ? answerLabel
      : Array.isArray(answerLabel) && answerLabel[0]
        ? answerLabel[0]
        : DEFAULT_OPINION_BODY;

  return (
    <>
      <p className={styles.opinionTitle}>{title}</p>
      <p className={styles.opinionBody}>{body}</p>
    </>
  );
}

/* ========================================
 * Component — Figma Summary_Item · 3:3367
 * ======================================== */

export function SummaryItem({
  variant = "default",
  label,
  answerLabel,
  imageUrls,
  title,
  onEdit,
  className,
  ...rest
}: SummaryItemProps) {
  const resolvedLabel =
    label ??
    (variant === "opinion"
      ? undefined
      : DEFAULT_LABEL_BY_VARIANT[variant]);

  return (
    <div
      className={cx(styles.root, VARIANT_CLASS[variant], className)}
      data-variant={variant}
      {...rest}
    >
      {variant === "default" ? (
        <DefaultBody
          label={resolvedLabel ?? DEFAULT_LABEL_BY_VARIANT.default}
          answerLabel={answerLabel}
          onEdit={onEdit}
        />
      ) : null}

      {variant === "list" ? (
        <ListBody
          label={resolvedLabel ?? DEFAULT_LABEL_BY_VARIANT.list}
          answerLabel={answerLabel}
          onEdit={onEdit}
        />
      ) : null}

      {variant === "media" ? (
        <MediaBody
          label={resolvedLabel ?? DEFAULT_LABEL_BY_VARIANT.media}
          imageUrls={imageUrls}
        />
      ) : null}

      {variant === "opinion" ? (
        <OpinionBody
          title={title ?? DEFAULT_OPINION_TITLE}
          answerLabel={answerLabel}
        />
      ) : null}
    </div>
  );
}

export default SummaryItem;
