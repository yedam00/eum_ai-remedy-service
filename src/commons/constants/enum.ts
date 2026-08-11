/**
 * 문진 챗봇 하단 입력/선택 UI 타입 enum
 * - 각 스텝에서 노출할 입력 UI를 제어하기 위한 상수
 */

/** UI 타입 값 */
export const ChatInputUIType = {
  CHECKBOX_LIST: "CHECKBOX_LIST",
  VERTICAL_SELECT: "VERTICAL_SELECT",
  OPTION_TRIO: "OPTION_TRIO",
  PAIN_SCALE: "PAIN_SCALE",
  MEDICINE_SEARCH: "MEDICINE_SEARCH",
  FILE_UPLOAD: "FILE_UPLOAD",
} as const;

export type ChatInputUIType =
  (typeof ChatInputUIType)[keyof typeof ChatInputUIType];

/** UI 타입별 메타데이터 */
export type ChatInputUIMeta = {
  key: ChatInputUIType;
  value: ChatInputUIType;
  description: string;
};

const createMeta = (
  key: ChatInputUIType,
  description: string
): ChatInputUIMeta => ({
  key,
  value: key,
  description,
});

export const chatInputUIMeta = {
  [ChatInputUIType.CHECKBOX_LIST]: createMeta(
    ChatInputUIType.CHECKBOX_LIST,
    "체크박스 형태의 동반 증상 다중 선택 및 자연어/음성 입력 UI"
  ),
  [ChatInputUIType.VERTICAL_SELECT]: createMeta(
    ChatInputUIType.VERTICAL_SELECT,
    "발병 기간 및 경과 선택을 위한 세로형 대형 버튼 UI"
  ),
  [ChatInputUIType.OPTION_TRIO]: createMeta(
    ChatInputUIType.OPTION_TRIO,
    "예 / 아니오 / 모르겠음 선택 버튼 UI"
  ),
  [ChatInputUIType.PAIN_SCALE]: createMeta(
    ChatInputUIType.PAIN_SCALE,
    "이모지 및 1~10 점수 기반 통증 척도 선택 UI"
  ),
  [ChatInputUIType.MEDICINE_SEARCH]: createMeta(
    ChatInputUIType.MEDICINE_SEARCH,
    "복용 중인 약물 검색 및 추가/목록 관리 UI"
  ),
  [ChatInputUIType.FILE_UPLOAD]: createMeta(
    ChatInputUIType.FILE_UPLOAD,
    "환부 사진 및 동영상 파일 업로드 UI"
  ),
} as const satisfies Record<ChatInputUIType, ChatInputUIMeta>;

/** 전체 UI 타입 목록 */
export const chatInputUITypeList = Object.values(ChatInputUIType);

/** UI 타입에 해당하는 메타데이터 조회 */
export const getChatInputUIMeta = (type: ChatInputUIType): ChatInputUIMeta =>
  chatInputUIMeta[type];

/** UI 타입에 해당하는 description 조회 */
export const getChatInputUIDescription = (type: ChatInputUIType): string =>
  chatInputUIMeta[type].description;

export default ChatInputUIType;
