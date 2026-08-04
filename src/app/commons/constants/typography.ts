/**
 * Typography design tokens (Figma: Typography / 2025:3390)
 * - ko: 국문 기본 타이포그래피
 * - en: 영문 타이포그래피 (추후 별도 값으로 분기 가능)
 */

export type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

export type TypographyVariant = {
  lg: TypographyToken;
  md: TypographyToken;
  sm: TypographyToken;
};

export type TypographyScale = {
  h1: TypographyVariant;
  h2: TypographyVariant;
  sub01: TypographyVariant;
  sub02: TypographyVariant;
  body01: TypographyVariant;
  body02: TypographyVariant;
  caption01: TypographyVariant;
  caption02: TypographyVariant;
};

export type TypographyLocale = "ko" | "en";

const PRETENDARD = "Pretendard";

const WEIGHT = {
  semibold: 600,
  medium: 500,
  regular: 400,
} as const;

const createToken = (
  fontSize: number,
  fontWeight: number,
  lineHeight: number,
  fontFamily: string = PRETENDARD,
  letterSpacing: number = 0
): TypographyToken => ({
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
});

const createVariant = (
  fontSize: number,
  lineHeight: number,
  fontFamily: string = PRETENDARD
): TypographyVariant => ({
  lg: createToken(fontSize, WEIGHT.semibold, lineHeight, fontFamily),
  md: createToken(fontSize, WEIGHT.medium, lineHeight, fontFamily),
  sm: createToken(fontSize, WEIGHT.regular, lineHeight, fontFamily),
});

/** 국문 타이포그래피 스케일 (Pretendard) */
const typographyKo: TypographyScale = {
  h1: createVariant(28, 46),
  h2: createVariant(24, 46),
  sub01: createVariant(22, 38),
  sub02: createVariant(20, 38),
  body01: createVariant(18, 26),
  body02: createVariant(16, 26),
  caption01: createVariant(14, 22),
  caption02: createVariant(12, 22),
};

/**
 * 영문 타이포그래피 스케일
 * 현재는 국문과 동일한 값이며, 추후 영문 전용 값으로 교체 가능
 */
const typographyEn: TypographyScale = {
  h1: createVariant(28, 46),
  h2: createVariant(24, 46),
  sub01: createVariant(22, 38),
  sub02: createVariant(20, 38),
  body01: createVariant(18, 26),
  body02: createVariant(16, 26),
  caption01: createVariant(14, 22),
  caption02: createVariant(12, 22),
};

export const typography = {
  ko: typographyKo,
  en: typographyEn,
} as const satisfies Record<TypographyLocale, TypographyScale>;

export type Typography = typeof typography;

/** 로케일에 해당하는 타이포그래피 스케일 반환 */
export const getTypography = (locale: TypographyLocale = "ko"): TypographyScale =>
  typography[locale];

/** 단일 토큰 조회 헬퍼 */
export const getTypographyToken = (
  locale: TypographyLocale,
  category: keyof TypographyScale,
  variant: keyof TypographyVariant
): TypographyToken => typography[locale][category][variant];

export const fontFamily = {
  ko: PRETENDARD,
  en: PRETENDARD,
} as const;

export const fontWeight = WEIGHT;
