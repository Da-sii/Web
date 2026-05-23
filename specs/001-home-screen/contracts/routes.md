# Routes Contract: 홈 화면

## 페이지 라우트 (Next.js App Router)

| Route | Page | Description |
| --- | --- | --- |
| `/` | 홈 | 메인 홈 화면 (배너 + 랭킹 + 성분 가이드) |
| `/banners/[id]` | 배너 상세 | 배너 클릭 시 상세 페이지 |
| `/products` | 제품 리스트 | 랭킹 헤더 클릭 시 이동 |
| `/products/[id]` | 제품 상세 | 제품 카드 클릭 시 이동 |
| `/search` | 검색 | 검색 아이콘 클릭 시 이동 |
| `/ingredients/guides` | 성분 가이드 리스트 | 성분 가이드 헤더 클릭 시 이동 |
| `/ingredients/guides/[id]` | 성분 가이드 상세 | 성분 태그 클릭 시 이동 |
| `/mypage` | 마이페이지 | 하단 바 마이페이지 탭 클릭 시 이동 |

## 백엔드 API 엔드포인트 (추후 연동용, 현재 하드코딩)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `https://dasii.kr/` | 홈 배너 데이터 조회 |
| GET | `https://dasii.kr/banners/` | 메인 배너 목록 조회 |
| GET | `https://dasii.kr/products/ranking/` | 급상승 랭킹 제품 조회 |
| GET | `https://dasii.kr/products/{id}/` | 제품 상세 조회 |
| GET | `https://dasii.kr/products/search/` | 제품 검색 |
| GET | `https://dasii.kr/ingredients/guides/{id}` | 성분 가이드 상세 조회 |
