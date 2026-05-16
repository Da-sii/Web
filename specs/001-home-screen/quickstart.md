# Quickstart: 홈 화면

## 사전 요구사항

- Node.js 20.9.0+
- pnpm

## 설치

```bash
cd /Users/bangdayeon/Desktop/Projects/Web
pnpm install
pnpm add @tanstack/react-virtual
```

## 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3000 에서 홈 화면 확인

## 검증 체크리스트

1. `/` 접속 시 홈 화면이 표시되는가
2. 배너 슬라이더가 자동으로 전환되는가
3. 배너 클릭 시 `/banners/[id]` 페이지로 이동하는가
4. 랭킹 카드가 가로 스크롤로 표시되는가
5. 제품 카드 클릭 시 `/products/[id]` 페이지로 이동하는가
6. 성분 태그 클릭 시 `/ingredients/guides/[id]` 페이지로 이동하는가
7. 하단 바 카테고리 탭 → 사이드 네비게이션 열림/닫힘
8. 하단 바 마이페이지 탭 → `/mypage` 이동
9. 로고 클릭 → `/` 이동
10. 검색 아이콘 클릭 → `/search` 이동
