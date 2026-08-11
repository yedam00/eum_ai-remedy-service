/**
 * URL 경로 및 화면별 레이아웃 노출 설정
 * - 링크 이동 / 다이나믹 라우팅에 사용
 * - header · navigation 노출 여부를 경로와 함께 관리
 */

/** 앱 내 라우트 키 */
export const UrlKey = {
  HOME: "HOME",
  CHAT_ENTRY: "CHAT_ENTRY",
  CHAT: "CHAT",
  SUMMARY: "SUMMARY",
} as const;

export type UrlKey = (typeof UrlKey)[keyof typeof UrlKey];

/** 헤더 노출 설정 */
export type HeaderVisibility = {
  /** 헤더 영역 노출 여부 */
  visible: boolean;
  /** 로고 노출 여부 */
  logo: boolean;
  /** 뒤로가기 버튼 노출 여부 */
  backButton: boolean;
};

/** 화면별 레이아웃 노출 설정 */
export type LayoutVisibility = {
  header: HeaderVisibility;
  /** 하단/사이드 navigation 노출 여부 */
  navigation: boolean;
};

/** URL 경로 메타데이터 */
export type UrlMeta = {
  key: UrlKey;
  /** 정적 경로 (예: /home) */
  path: string;
  /** Next.js 라우트 패턴 (다이나믹 세그먼트 포함 가능) */
  pattern: string;
  /** 화면명 */
  label: string;
  layout: LayoutVisibility;
};

/** 다이나믹 라우트 파라미터 */
export type UrlParams = Record<string, string | number>;

const createHeader = (
  visible: boolean,
  logo: boolean,
  backButton: boolean
): HeaderVisibility => ({
  visible,
  logo,
  backButton,
});

const createLayout = (
  header: HeaderVisibility,
  navigation: boolean
): LayoutVisibility => ({
  header,
  navigation,
});

const createMeta = (
  key: UrlKey,
  path: string,
  label: string,
  layout: LayoutVisibility,
  pattern: string = path
): UrlMeta => ({
  key,
  path,
  pattern,
  label,
  layout,
});

/** 경로별 URL 메타데이터 */
export const urlMeta = {
  [UrlKey.HOME]: createMeta(
    UrlKey.HOME,
    "/home",
    "홈",
    createLayout(createHeader(true, true, false), true)
  ),
  [UrlKey.CHAT_ENTRY]: createMeta(
    UrlKey.CHAT_ENTRY,
    "/chat-entry",
    "채팅 시작",
    createLayout(createHeader(false, false, false), false)
  ),
  [UrlKey.CHAT]: createMeta(
    UrlKey.CHAT,
    "/chat",
    "홈",
    createLayout(createHeader(true, false, true), false)
  ),
  [UrlKey.SUMMARY]: createMeta(
    UrlKey.SUMMARY,
    "/summary",
    "의료진 요약",
    createLayout(createHeader(false, false, false), false)
  ),
} as const satisfies Record<UrlKey, UrlMeta>;

/** 전체 URL 키 목록 */
export const urlKeyList = Object.values(UrlKey);

/** 전체 URL 메타데이터 목록 */
export const urlMetaList = Object.values(urlMeta);

/** 정적 path → UrlKey 매핑 */
const pathToKeyMap = Object.fromEntries(
  urlMetaList.map((meta) => [meta.path, meta.key])
) as Record<string, UrlKey>;

/** URL 키에 해당하는 메타데이터 조회 */
export const getUrlMeta = (key: UrlKey): UrlMeta => urlMeta[key];

/** URL 키에 해당하는 정적 경로 조회 (Link href용) */
export const getUrlPath = (key: UrlKey): string => urlMeta[key].path;

/**
 * 다이나믹 라우팅용 경로 생성
 * - pattern의 `[param]` 자리를 params 값으로 치환
 * - params가 없으면 정적 path 반환
 *
 * @example
 * buildUrl(UrlKey.CHAT) // "/chat"
 * buildUrl(UrlKey.CHAT, { id: 1 }) // pattern에 [id]가 있을 때 "/chat/1"
 */
export const buildUrl = (key: UrlKey, params?: UrlParams): string => {
  const meta = urlMeta[key];

  if (!params || Object.keys(params).length === 0) {
    return meta.path;
  }

  return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
    return result
      .replace(`[${paramKey}]`, String(paramValue))
      .replace(`:${paramKey}`, String(paramValue));
  }, meta.pattern);
};

/** 정적 pathname으로 메타데이터 조회 (없으면 undefined) */
export const getUrlMetaByPath = (pathname: string): UrlMeta | undefined => {
  const key = pathToKeyMap[pathname];
  return key ? urlMeta[key] : undefined;
};

/** 정적 pathname으로 레이아웃 노출 설정 조회 */
export const getLayoutByPath = (
  pathname: string
): LayoutVisibility | undefined => getUrlMetaByPath(pathname)?.layout;

/** URL 키로 레이아웃 노출 설정 조회 */
export const getLayoutByKey = (key: UrlKey): LayoutVisibility =>
  urlMeta[key].layout;

export default urlMeta;
