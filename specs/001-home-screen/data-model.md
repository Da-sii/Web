# Data Model: 홈 화면

## Entities

### Banner (배너)

| Field | Type | Description |
| --- | --- | --- |
| id | number | 배너 고유 식별자 |
| title | string | 배너 제목 (오버레이 텍스트) |
| imageUrl | string | 배너 이미지 URL |
| linkUrl | string | 클릭 시 이동할 상세 페이지 경로 |

### Product (제품)

| Field | Type | Description |
| --- | --- | --- |
| id | number | 제품 고유 식별자 |
| name | string | 제품명 |
| companyName | string | 회사명 |
| imageUrl | string | 제품 이미지 URL |
| rating | number | 별점 (0~5) |
| reviewCount | number | 리뷰 수 |
| rank | number | 랭킹 순위 |

### IngredientGuide (성분 가이드)

| Field | Type | Description |
| --- | --- | --- |
| id | number | 성분 가이드 고유 식별자 |
| name | string | 성분명 (태그에 표시) |

### CategoryItem (카테고리)

| Field | Type | Description |
| --- | --- | --- |
| id | number | 카테고리 고유 식별자 |
| name | string | 카테고리명 |
| linkUrl | string | 카테고리 페이지 경로 |

## Relationships

- Banner → Banner Detail Page (1:1, 배너 클릭 시 상세로 이동)
- Product → Product Detail Page (1:1, 카드 클릭 시 상세로 이동)
- IngredientGuide → Ingredient Detail Page (1:1, 태그 클릭 시 상세로 이동)

## State

- 홈 화면은 읽기 전용 (상태 변경 없음)
- 배너 슬라이더: 현재 인덱스 (currentIndex), 자동 전환 타이머
- 카테고리 사이드 네비게이션: 열림/닫힘 (isOpen)
- 하단 바: 현재 활성 탭 (activeTab)
