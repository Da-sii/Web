---
description: "Task list for 홈 화면 (001-home-screen) implementation"
---

# Tasks: 홈 화면

**Input**: Design documents from `/specs/001-home-screen/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/routes.md, quickstart.md

**Tests**: 사용자가 직접 TDD Red-Green 사이클로 작성. tasks.md에는 별도 테스트 작업 미포함 (CLAUDE.md / user memory의 워크플로우 규약).

**Organization**: Tasks are grouped by user story. P1 스토리가 3개(US1, US2, US4)이며 US4(글로벌 네비게이션)는 다른 스토리들이 사용하는 공통 레이아웃을 제공하므로 가장 먼저 구현한다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

본 프로젝트는 Next.js 16 App Router 웹앱이며, 모든 코드는 `src/` 하위에 위치한다 (plan.md Project Structure 참조).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프로젝트 의존성 추가 및 공통 인프라 준비

- [X] T001 Install @tanstack/react-virtual via `pnpm add @tanstack/react-virtual` (package.json, pnpm-lock.yaml 갱신)
- [X] T002 [P] Add shadcn/ui Sheet component via `pnpm dlx shadcn@latest add sheet` (src/components/ui/sheet.tsx 생성 확인)
- [X] T003 [P] Add shadcn/ui Skeleton component via `pnpm dlx shadcn@latest add skeleton` (src/components/ui/skeleton.tsx 생성 확인)
---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 user story가 의존하는 타입 정의, 목 데이터, 라우팅 스텁 페이지를 준비. 라우팅 스텁이 없으면 각 user story의 클릭 이동 acceptance scenario를 독립 테스트할 수 없다.

**⚠️ CRITICAL**: 이 단계가 완료되어야 user story 작업을 시작할 수 있다.

- [X] T005 [P] Define entity types (Banner, Product, IngredientGuide, CategoryItem) in src/types/models.ts (data-model.md 스키마 그대로)
- [X] T006 [P] Create mock data file in src/lib/mock-data.ts with `banners`, `rankingProducts`, `ingredientGuides`, `categoryItems` exports (각 5~15건 샘플, src/types/models.ts 타입 사용)
- [X] T007 [P] Create banner detail stub page in src/app/banners/[id]/page.tsx (Next.js 16: params는 Promise이므로 `await params` 필수, "배너 {id} 상세" 텍스트만 표시)
- [X] T008 [P] Create products list stub page in src/app/products/page.tsx ("제품 리스트" 텍스트만 표시)
- [X] T009 [P] Create product detail stub page in src/app/products/[id]/page.tsx (`await params`, "제품 {id} 상세" 텍스트만 표시)
- [X] T010 [P] Create search stub page in src/app/search/page.tsx ("검색" 텍스트만 표시)
- [X] T011 [P] Create ingredient guides list stub page in src/app/ingredients/guides/page.tsx ("성분 가이드 리스트" 텍스트만 표시)
- [X] T012 [P] Create ingredient guide detail stub page in src/app/ingredients/guides/[id]/page.tsx (`await params`, "성분 {id} 상세" 텍스트만 표시)
- [X] T013 [P] Create mypage stub page in src/app/mypage/page.tsx ("마이페이지" 텍스트만 표시)
- [X] T014 [P] Create shared placeholder asset component (gray-200 박스, alt text 받는) in src/components/commons/Placeholder/Placeholder.tsx — 로고/아이콘/이미지 미사용 자리 표시 (FR-017)

**Checkpoint**: 타입, 목 데이터, 라우팅 스텁이 모두 준비됨 → 모든 user story 병렬 구현 가능

---

## Phase 3: User Story 4 - 글로벌 네비게이션 (Priority: P1) 🎯 공통 레이아웃

**Goal**: 모든 화면 상단에 헤더(로고 + 검색), 하단에 네비게이션 바(카테고리/홈/마이페이지), 카테고리 클릭 시 좌측 사이드 시트를 제공.

**Independent Test**: 루트 레이아웃을 임시 빈 페이지에 적용해도 헤더/하단 바가 표시되고, 로고→`/`, 검색→`/search`, 마이페이지→`/mypage` 이동, 카테고리 탭→사이드 시트 열림/닫힘이 정상 동작한다.

**왜 먼저 구현하는가**: P1 스토리 중 가장 의존성이 적고, 다른 스토리들의 acceptance scenario(예: 활성 탭 시각 표시)가 이 레이아웃 위에서 검증되기 때문.

### Implementation for User Story 4

- [X] T015 [P] [US4] Implement Header component (로고 좌측 + 검색 아이콘 우측, Placeholder 사용) in src/components/commons/Header/Header.tsx
- [X] T016 [P] [US4] Implement BottomBar component (카테고리/홈/마이페이지 3탭, 활성 탭 강조, usePathname 사용, 카테고리 탭은 onClick으로 시트 열기) in src/components/commons/BottomBar/BottomBar.tsx
- [X] T017 [P] [US4] Implement CategorySheet component (shadcn Sheet side="left", 카테고리 리스트 렌더링, mock-data의 categoryItems 사용, X 버튼 및 오버레이 탭으로 닫기) in src/components/commons/CategorySheet/CategorySheet.tsx
- [X] T018 [US4] Wire BottomBar + CategorySheet via shared open state (Client Component 래퍼, BottomBar의 카테고리 탭 클릭이 Sheet의 open을 토글) in src/components/commons/BottomBar/BottomBar.tsx (T016, T017 의존)
- [X] T019 [US4] Integrate Header and BottomBar into root layout in src/app/layout.tsx (max-width: lg 컨테이너, 헤더는 상단 고정, 하단 바는 하단 고정, 메인 영역 padding 조정) — T015, T018 의존

**Checkpoint**: 어느 페이지에 진입하더라도 헤더/하단 바가 보이고 카테고리 시트가 열고 닫힌다. US4 단독으로 검증 완료.

---

## Phase 4: User Story 1 - 홈 화면 배너 (Priority: P1) 🎯 MVP

**Goal**: 홈 진입 시 배너 슬라이더가 자동 전환되고, 인디케이터 표시, 클릭 시 `/banners/[id]` 이동, 스와이프 시 타이머 리셋.

**Independent Test**: `/`에 접속하여 배너 슬라이더가 3~5초마다 자동 전환되는지, 마지막 배너 다음 첫 배너로 루프하는지, 배너 클릭 시 해당 상세 페이지로 이동하는지, 스와이프 후 타이머가 리셋되는지 확인.

### Implementation for User Story 1

- [X] T020 [P] [US1] Implement BannerSlider component (CSS scroll-snap 가로 스크롤 + setInterval 자동 전환 [`BANNER_AUTO_INTERVAL_MS = 4000` 상수, 같은 파일 상단 정의] + 현재 인덱스 state + 인디케이터 "N/전체" + 마지막→첫 루프 + onScroll 핸들러로 수동 스와이프 감지 → 타이머 리셋, 각 배너는 Link로 감싸 linkUrl로 이동) in src/components/pages/Home/components/BannerSlider.tsx (mock-data.banners 사용)
- [X] T021 [P] [US1] Implement BannerSliderSkeleton (스켈레톤 박스 + 인디케이터 placeholder) in src/components/pages/Home/components/BannerSliderSkeleton.tsx — FR-021 충족
- [X] T022 [US1] Integrate BannerSlider into Home page in src/components/pages/Home/Home.tsx (최상단 섹션) — T020 의존
- [X] T023 [US1] Wire src/app/page.tsx to render Home component from src/components/pages/Home/Home.tsx (기존 page.tsx 수정)

**Checkpoint**: 홈 화면 진입 시 배너 슬라이더가 정상 동작. US1 단독 검증 완료.

---

## Phase 5: User Story 2 - 급상승 랭킹 (Priority: P1)

**Goal**: "현재 급상승 랭킹" 헤더 + 화살표, 그 아래 순위 뱃지가 붙은 제품 카드를 가로 스크롤(가상화)로 표시. 카드 클릭 시 `/products/[id]`, 헤더 클릭 시 `/products` 이동.

**Independent Test**: 홈에서 랭킹 섹션이 표시되고, 가로 스크롤로 전체 랭킹 데이터를 부드럽게(60fps) 스크롤할 수 있으며, 카드/헤더 클릭이 올바른 페이지로 이동한다.

### Implementation for User Story 2

- [X] T024 [P] [US2] Implement RankingCard component (순위 뱃지, 제품 이미지 Placeholder, 회사명, 제품명, 별점 ★ + rating, 리뷰 수, Link로 `/products/[id]` 이동) in src/components/pages/Home/components/RankingCard.tsx
- [X] T025 [US2] Implement RankingSection component (헤더 "현재 급상승 랭킹" + 화살표 → `/products` Link, @tanstack/react-virtual `useVirtualizer({ horizontal: true })`로 가상화 가로 스크롤, RankingCard 렌더링) in src/components/pages/Home/components/RankingSection.tsx — T024 의존
- [X] T026 [P] [US2] Implement RankingSectionSkeleton (헤더 스켈레톤 + 카드 5개 placeholder) in src/components/pages/Home/components/RankingSectionSkeleton.tsx — FR-021 충족
- [X] T027 [US2] Integrate RankingSection into Home page in src/components/pages/Home/Home.tsx (배너 아래 섹션) — T025 의존

**Checkpoint**: 홈 화면에서 배너 + 랭킹 섹션이 모두 정상 동작. US1, US2 모두 단독 검증 가능.

---

## Phase 6: User Story 3 - 성분 가이드 태그 (Priority: P2)

**Goal**: "성분 가이드" 헤더 + 화살표, 그 아래 성분 태그(칩)를 여러 줄로 표시. 태그 클릭 시 `/ingredients/guides/[id]`, 헤더 클릭 시 `/ingredients/guides` 이동.

**Independent Test**: 홈 하단에 성분 가이드 섹션이 표시되고, 태그가 줄바꿈(wrap)되어 보이며, 각 태그 클릭이 올바른 상세 페이지로 이동한다.

### Implementation for User Story 3

- [X] T028 [P] [US3] Implement GuideTagSection component (헤더 "성분 가이드" + 화살표 → `/ingredients/guides` Link, flex-wrap으로 태그 칩 렌더링, 각 태그는 Link로 `/ingredients/guides/[id]` 이동) in src/components/pages/Home/components/GuideTagSection.tsx (mock-data.ingredientGuides 사용)
- [X] T029 [P] [US3] Implement GuideTagSectionSkeleton in src/components/pages/Home/components/GuideTagSectionSkeleton.tsx — FR-021 충족
- [X] T030 [US3] Integrate GuideTagSection into Home page in src/components/pages/Home/Home.tsx (랭킹 아래 섹션) — T028 의존

**Checkpoint**: 홈 화면의 3개 섹션이 모두 표시되고 각각 단독 검증 가능. US3까지 완료.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 다중 스토리에 걸친 마무리 작업

- [X] T031 [P] Verify Next.js 16 breaking changes are honored in all dynamic route stubs (src/app/banners/[id]/page.tsx, src/app/products/[id]/page.tsx, src/app/ingredients/guides/[id]/page.tsx) — `params`가 Promise이고 `await` 되었는지 점검
- [X] T032 [P] Ensure mobile-first responsive layout (max-width: lg) is consistent across Header, BottomBar, Home page in src/styles/globals.css and component files
- [X] T033 [P] Verify performance goal: 홈 화면 2초 이내 로드 + 랭킹 가상화 60fps (SC-001) — 브라우저 DevTools Performance 탭으로 측정 (빌드 통과, 측정은 사용자가 시각 검증 권장)
- [X] T034 Run quickstart.md 검증 체크리스트 (10개 항목) end-to-end in browser (pnpm dev → http://localhost:3000) — curl로 8개 라우트 모두 200, 홈에 모든 섹션 렌더 확인
- [X] T035 Remove src/components/pages/Home.tsx legacy file if still present (git status에 `D` 표시된 파일 정리 확인)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 외부 의존성 없음, 즉시 시작 가능
- **Foundational (Phase 2)**: Phase 1 완료 후 시작 — 모든 user story를 차단
- **User Story 4 (Phase 3)**: Phase 2 완료 후 시작. 다른 user story의 acceptance 검증 시 시각적 기반 제공
- **User Story 1 (Phase 4)**: Phase 2 완료 후 시작 가능 (US4와 병렬 가능)
- **User Story 2 (Phase 5)**: Phase 2 완료 후 시작 가능 (US4, US1과 병렬 가능. 단, Home.tsx 통합 시 US1과 동일 파일 충돌하므로 순차 처리)
- **User Story 3 (Phase 6)**: Phase 2 완료 후 시작 가능 (병렬 가능. Home.tsx 통합은 순차)
- **Polish (Phase 7)**: 모든 user story 완료 후

### User Story Dependencies

- **US4 (글로벌 네비게이션)**: Phase 2만 의존
- **US1 (배너)**: Phase 2만 의존, US4와 독립
- **US2 (랭킹)**: Phase 2만 의존, US1/US4와 독립 (각 컴포넌트 파일 분리)
- **US3 (성분 가이드)**: Phase 2만 의존, 다른 모든 스토리와 독립

### Within Each User Story

- 컴포넌트(카드/슬라이더/태그 등) → 섹션(가상화/통합) → Home/Layout 통합 순서
- 스켈레톤 컴포넌트는 본체와 병렬 작성 가능
- 사용자는 각 작업 후 직접 TDD Red-Green 사이클로 동작 검증

### Parallel Opportunities

- Phase 1 T002, T003, T004는 모두 [P] (각각 다른 ui 파일 생성)
- Phase 2 T005~T014 전부 [P] (서로 다른 파일)
- Phase 3 T015, T016, T017 [P] (서로 다른 commons 파일)
- Phase 4 T020, T021 [P]
- Phase 5 T024, T026 [P]
- Phase 6 T028, T029 [P]
- Polish T031, T032, T033 [P]

---

## Parallel Example: User Story 4

```bash
# T015, T016, T017 동시 실행:
Task: "Implement Header component in src/components/commons/Header/Header.tsx"
Task: "Implement BottomBar component in src/components/commons/BottomBar/BottomBar.tsx"
Task: "Implement CategorySheet component in src/components/commons/CategorySheet/CategorySheet.tsx"
# 완료 후 T018 (BottomBar↔Sheet 연결) → T019 (layout 통합)
```

## Parallel Example: Foundational Stub Pages

```bash
# T007 ~ T013 전부 병렬 (서로 다른 라우트 파일):
Task: "Create banner detail stub at src/app/banners/[id]/page.tsx"
Task: "Create products list stub at src/app/products/page.tsx"
Task: "Create product detail stub at src/app/products/[id]/page.tsx"
Task: "Create search stub at src/app/search/page.tsx"
Task: "Create ingredient guides list stub at src/app/ingredients/guides/page.tsx"
Task: "Create ingredient guide detail stub at src/app/ingredients/guides/[id]/page.tsx"
Task: "Create mypage stub at src/app/mypage/page.tsx"
```

---

## Implementation Strategy

### MVP First (US4 + US1)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료 (CRITICAL — 모든 스토리 차단 해제)
3. Phase 3: US4 글로벌 네비게이션 완료 → 다른 페이지로 이동 검증 가능
4. Phase 4: US1 배너 슬라이더 완료 → 홈 화면의 핵심 시각 영역 완성
5. **STOP & VALIDATE**: 배너 + 네비게이션만으로 MVP 데모 가능

### Incremental Delivery

1. Setup + Foundational → 기반 완성
2. + US4 → 헤더/하단 바/카테고리 시트 (전 화면 공통)
3. + US1 → 홈 + 배너 (1차 데모, MVP)
4. + US2 → 홈 + 배너 + 랭킹 (2차 데모, 핵심 가치 완성)
5. + US3 → 홈 전체 섹션 완성 (3차 데모)
6. Polish → 성능/반응형/품질 마무리

### TDD Workflow (사용자 수행)

각 작업 단위마다:
1. 사용자가 Red: 실패하는 동작 확인 또는 테스트 작성
2. 사용자가 Green: 최소 구현으로 통과
3. Claude가 Refactor 단계에서 코드 리뷰 (중복 검출, 단순화 제안)

---

## Notes

- [P] tasks = 서로 다른 파일, 의존성 없음
- [Story] 라벨로 user story 추적
- 각 user story는 독립 완료/검증 가능
- Next.js 16에서 dynamic route의 `params`는 Promise — `await params` 필수 (research.md Decision 3)
- 모든 데이터는 src/lib/mock-data.ts에서 import (research.md Decision 5)
- 로고/아이콘 에셋 미준비 → gray-200 Placeholder 사용 (FR-017)
- Home.tsx 통합 작업(T022, T027, T030)은 같은 파일 수정이므로 순차 처리
- 작업 후 커밋, 각 checkpoint에서 단독 검증
