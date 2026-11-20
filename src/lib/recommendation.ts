export type RecommendationSurveyPayload = {
  goals: string[];
  age_range: string;
  gender: string;
  exercise_frequency: string;
  caffeine_sensitivity: string;
  sleep_hours: string;
  meal_regularity: string;
  alcohol_frequency: string;
  smoking_status: string;
};

export type RecommendedProduct = {
  id: number;
  name: string;
  company: string;
  thumbnail: string | null;
};

export type RecommendationItem = {
  ingredient_id: number;
  ingredient_name: string;
  intro: string;
  reason: string;
  fit_score: number;
  products: RecommendedProduct[];
};

export type RecommendationResponse = {
  count: number;
  recommendations: RecommendationItem[];
};

type Question = {
  id: number;
  title: string;
  subtitle?: string;
  options: string[];
  multiple?: boolean;
};

export const questions: Question[] = [
  {
    id: 1,
    title: '주요 건강 목표가 무엇인가요?',
    subtitle: '중복 선택 가능해요',
    options: [
      '체지방 감소',
      '근육 증가',
      '피로 회복',
      '면역 강화',
      '소화 개선',
      '혈당 관리',
      '기타',
    ],
    multiple: true,
  },
  {
    id: 2,
    title: '나이대를 알려주세요.',
    options: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
  },
  {
    id: 3,
    title: '성별을 알려주세요.',
    options: ['여성', '남성', '선택 안 함'],
  },
  {
    id: 4,
    title: '운동을 얼마나 자주 하나요?',
    options: ['거의 안 함', '주 1~2회', '주 3회 이상'],
  },
  {
    id: 5,
    title: '카페인에 민감한 편인가요?',
    options: ['예민한 편', '보통', '상관 없음'],
  },
  {
    id: 6,
    title: '수면은 충분한 편인가요?',
    options: ['8시간 이상', '5~7시간', '1~4시간'],
  },
  {
    id: 7,
    title: '식사는 규칙적으로 하나요?',
    options: ['규칙적', '불규칙적', '다이어트 중 (식이 제한)'],
  },
  {
    id: 8,
    title: '음주 빈도는 어떻게 되나요?',
    options: ['아예 안 하거나 거의 안 함', '주 1~2회', '주 3회 이상'],
  },
  {
    id: 9,
    title: '흡연 여부를 알려주세요.',
    options: ['비흡연', '흡연', '금연 중'],
  },
];

const answerCodeMaps: Record<number, Record<string, string>> = {
  2: {
    '10대': '10s',
    '20대': '20s',
    '30대': '30s',
    '40대': '40s',
    '50대': '50s',
    '60대 이상': '60s+',
  },
  3: { 여성: 'F', 남성: 'M', '선택 안 함': 'N' },
  4: { '거의 안 함': 'none', '주 1~2회': '1_2', '주 3회 이상': '3_plus' },
  5: { '예민한 편': 'sensitive', 보통: 'normal', '상관 없음': 'none' },
  6: { '8시간 이상': '8_plus', '5~7시간': '5_7', '1~4시간': '1_4' },
  7: {
    규칙적: 'regular',
    불규칙적: 'irregular',
    '다이어트 중 (식이 제한)': 'diet',
  },
  8: {
    '아예 안 하거나 거의 안 함': 'none',
    '주 1~2회': '1_2',
    '주 3회 이상': '3_plus',
  },
  9: { 비흡연: 'none', 흡연: 'smoking', '금연 중': 'quitting' },
};

export function buildSurveyPayload(
  answers: Record<number, string | string[]>,
): RecommendationSurveyPayload {
  const code = (questionId: number) =>
    answerCodeMaps[questionId][answers[questionId] as string];

  return {
    goals: answers[1] as string[],
    age_range: code(2),
    gender: code(3),
    exercise_frequency: code(4),
    caffeine_sensitivity: code(5),
    sleep_hours: code(6),
    meal_regularity: code(7),
    alcohol_frequency: code(8),
    smoking_status: code(9),
  };
}

