# Implementation Plan: 홈 화면

**Branch**: `001-home-screen` | **Date**: 2026-05-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-home-screen/spec.md`

## Summary

Dasii 네이티브 앱 유도 웹의 홈 화면 구현. 배너 슬라이더(자동 전환 + 스와이프), 급상승 랭킹 제품 카드(가상화 가로 스크롤), 성분 가이드 태그, 글로벌 네비게이션(헤더 + 하단 바 + 카테고리 사이드 시트)으로 구성. 백엔드 미완성으로 모든 데이터 하드코딩 처리.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4

**Primary Dependencies**: Next.js 16.2.4, shadcn/ui, Radix UI, @tanstack/react-virtual, Tailwind CSS 4

**Storage**: N/A (하드코딩 목 데이터)

**Testing**: TDD Red-Green (사용자 수행) → 코드 리뷰 (Claude)

**Target Platform**: 웹 브라우저 (모바일 뷰포트 중심, 데스크톱 반응형)

**Project Type**: web-app (네이티브 앱 유도 랜딩)

**Performance Goals**: 홈 화면 2초 이내 로드, 랭킹 가상화로 대량 데이터 스크롤 60fps

**Constraints**: 모바일 퍼스트, max-width: lg (기존 레이아웃 유지)

**Scale/Scope**: 단일 홈 화면 + 라우팅 스텁 페이지 8개

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. KISS (Keep It Simple, Stupid)

- [x] 외부 의존성 최소화: 배너는 CSS scroll-snap 또는 shadcn Carousel, 가상화만 @tanstack/react-virtual 추가
- [x] 목 데이터를 단일 파일(`src/lib/mock-data.ts`)에 집중하여 추후 교체 용이
- [x] 카테고리 사이드 네비게이션에 shadcn Sheet 재활용 (커스텀 구현 회피)
- [x] 불필요한 추상화 없음: 각 섹션을 독립 컴포넌트로 분리하되 공통 래퍼 불필요

### II. TDD Red-Green 사이클 및 코드 리뷰

- [x] 사용자가 Red-Green 수행, Claude가 코드 리뷰 역할 확인
- [x] 테스트 가능한 단위: 각 섹션 컴포넌트, 네비게이션 동작, 배너 타이머 로직

### III. 프로젝트 구조 규칙

- [x] `src/app/`: 라우팅 진입점만 (비즈니스 로직 금지)
- [x] `src/components/pages/Home/`: 홈 전용 컴포넌트
- [x] `src/components/commons/`: 공통 네비게이션 (Header, BottomBar)
- [x] `src/lib/mock-data.ts`: 목 데이터 (순수 함수/데이터, 사이드 이펙트 없음)
- [x] `src/types/`: 공유 타입 정의

**GATE 결과**: 모든 원칙 통과 ✅

## Project Structure

### Documentation (this feature)

```text
specs/001-home-screen/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── routes.md
└── tasks.md          # /speckit-tasks에서 생성
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (기존, 수정)
│   ├── page.tsx                      # 홈 페이지 진입점 (기존, 수정)
│   ├── banners/
│   │   └── [id]/
│   │       └── page.tsx              # 배너 상세 (스텁)
│   ├── products/
│   │   ├── page.tsx                  # 제품 리스트 (스텁)
│   │   └── [id]/
│   │       └── page.tsx              # 제품 상세 (스텁)
│   ├── search/
│   │   └── page.tsx                  # 검색 (스텁)
│   ├── ingredients/
│   │   └── guides/
│   │       ├── page.tsx              # 성분 가이드 리스트 (스텁)
│   │       └── [id]/
│   │           └── page.tsx          # 성분 가이드 상세 (스텁)
│   └── mypage/
│       └── page.tsx                  # 마이페이지 (스텁)
├── components/
│   ├── commons/
│   │   ├── Header/
│   │   │   └── Header.tsx            # 상단 헤더 (로고 + 검색)
│   │   ├── BottomBar/
│   │   │   └── BottomBar.tsx         # 하단 네비게이션 바
│   │   ├── CategorySheet/
│   │   │   └── CategorySheet.tsx     # 카테고리 사이드 시트
│   │   └── Placeholder/
│   │       └── Placeholder.tsx       # 에셋 미준비 시 회색 자리표시자 (FR-017)
│   ├── pages/
│   │   └── Home/
│   │       ├── Home.tsx              # 홈 페이지 메인 (기존, 수정)
│   │       └── components/
│   │           ├── BannerSlider.tsx   # 배너 슬라이더
│   │           ├── RankingSection.tsx # 급상승 랭킹 섹션
│   │           ├── RankingCard.tsx    # 제품 랭킹 카드
│   │           └── GuideTagSection.tsx # 성분 가이드 태그 섹션
│   └── ui/                           # shadcn UI (기존)
├── lib/
│   ├── utils.ts                      # 기존 유틸
│   └── mock-data.ts                  # 하드코딩 목 데이터
├── types/
│   └── models.ts                     # Banner, Product, IngredientGuide 타입
├── assets/                           # 에셋 (사용자 추가 예정)
└── styles/                           # 기존 스타일
```

**Structure Decision**: 기존 프로젝트 구조(헌법 원칙 III)를 유지하며, 홈 전용 컴포넌트는 `components/pages/Home/components/`에, 공통 네비게이션은 `components/commons/`에 배치. 목 데이터와 타입은 각각 `lib/`, `types/`에 분리.

## Complexity Tracking

> 헌법 위반 사항 없음 — 이 섹션은 비어 있음
