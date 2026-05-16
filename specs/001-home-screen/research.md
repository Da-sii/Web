# Research: 홈 화면

## Decision 1: 가로 스크롤 가상화 라이브러리

**Decision**: @tanstack/react-virtual v3

**Rationale**:
- React 19와 완전 호환
- 네이티브 horizontal 가상화 지원 (`useVirtualizer` + `horizontal: true`)
- Headless/unstyled 방식으로 shadcn/ui와 잘 어울림
- 번들 크기 ~4kb로 경량
- TypeScript 지원 우수

**Alternatives considered**:
- react-window: 가로 스크롤 네이티브 미지원, 업데이트 빈도 낮음
- CSS 네이티브 스크롤: 소규모 데이터셋에만 적합, 가상화 불가

## Decision 2: 배너 슬라이더 구현 방식

**Decision**: CSS scroll-snap + 커스텀 자동 전환 로직

**Rationale**:
- KISS 원칙: 외부 캐러셀 라이브러리 없이 CSS scroll-snap으로 스와이프 지원
- 자동 전환은 setInterval + 타이머 리셋 로직으로 간단 구현
- shadcn/ui의 Carousel이 Embla 기반이므로 이를 활용해도 무방

**Alternatives considered**:
- Embla Carousel (shadcn/ui 내장): 기능 풍부하나 추가 의존성
- Swiper.js: 오버킬, KISS 위반

## Decision 3: Next.js 16 라우팅 구조

**Decision**: App Router 사용, 페이지별 폴더 구조

**Rationale**:
- Next.js 16에서 params가 Promise로 변경됨 (Breaking Change)
- Turbopack이 기본 번들러
- 동적 라우트: `[id]` 폴더 방식

**Key breaking changes**:
- `params`는 반드시 `await` 해야 함
- `searchParams`도 Promise
- Node.js 20.9.0+ 필수

## Decision 4: 카테고리 사이드 네비게이션

**Decision**: shadcn/ui Sheet 컴포넌트 활용

**Rationale**:
- shadcn/ui의 Sheet 컴포넌트가 side="left" 옵션 지원
- 오버레이 + X 버튼 닫기 기본 제공
- 추가 구현 없이 요구사항 충족 (KISS)

**Alternatives considered**:
- 커스텀 구현: 불필요한 복잡도
- Radix Dialog: Sheet가 이미 Radix 기반

## Decision 5: 데이터 하드코딩 전략

**Decision**: `src/lib/mock-data.ts`에 타입 정의된 목 데이터 집중

**Rationale**:
- 백엔드 개발 전이므로 모든 데이터 하드코딩
- 타입 정의를 함께 두어 추후 API 연동 시 타입 재사용
- 단일 파일에 집중하여 나중에 API 연동 시 교체 용이

**Alternatives considered**:
- 각 컴포넌트에 인라인: 관리 어려움, 중복 위험
- JSON 파일: 타입 안전성 부족
