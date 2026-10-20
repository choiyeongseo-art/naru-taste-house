# 나루와 취향들 · 나의 취향방

파스텔블루 `#A9D8F3`를 중심으로 만든 React 미니홈피 서비스입니다. Astryx 0.7.1의 빌드된 테마와 버튼, 직접 제작한 2D SVG 취향방·아바타·장소 일러스트를 사용합니다.

## 구현한 흐름

- 캐릭터 4명과 나누는 선택형 대화 8개 → 발견·몰입·수집·휴식 결과 4종
- 결과 테마를 방에 적용하거나 자유롭게 벽·바닥 테마 변경
- 가구 9종: 기본 소품 7종과 반짝이로 얻는 보상 소품 2종
- 포인터 드래그, 방향키 이동, 가구 추가·뒤집기·제거, 확대·축소
- 헤어 4종 × 옷 4종 × 액세서리 4종의 아바타 꾸미기
- 부산 코스 5개·장소 7개, 지역·취향·코스 예산 필터, 검색, 지도·공식 링크
- 코스와 장소 보관, 테스트 결과 이력, 직접 남기는 방문 메모
- 취향방과 결과를 PNG 이미지로 다운로드
- 일회성 작은 미션 3개, 반짝이 보상과 꾸미기 소비
- 로그인 없이 공개 접속, 브라우저 게스트 임시 보관
- Google 소셜 로그인 UI와 Supabase Auth 기반 회원별 방 저장
- 데스크톱·태블릿·모바일 반응형 레이아웃

캐릭터 대화는 집필된 선택형 콘텐츠입니다. 심리 진단이나 자유 입력 AI 채팅이 아닙니다. 장소 일러스트는 실제 건축물 사진이 아니며, 코스 소요시간과 예산은 편집 제안입니다. 실제 제휴·결제·쿠폰·예약은 구현 범위에 포함하지 않았습니다.

## 공개 웹 호스팅과 계정 저장

공개 사이트: https://choiyeongseo-art.github.io/naru-taste-house/

GitHub Pages에서 React/Vite 정적 앱을 제공합니다. ChatGPT 계정이나 Sites 호스팅이 필요하지 않습니다. `main`에 푸시하면 GitHub Actions가 `pnpm build:public`으로 빌드하여 배포합니다. Pages 설정의 배포 소스는 GitHub Actions입니다.

Google 소셜 로그인을 Supabase Auth에 연결합니다. 브라우저에는 공개용 publishable key만 포함합니다. `web/supabase.ts`의 키는 비밀키가 아니며, 서비스 역할 키나 Google Client Secret은 소스·빌드·GitHub에 넣지 않습니다. Google OAuth의 비밀키는 Supabase 대시보드에만 설정합니다.

- Supabase: `izdkmewsfuhbrrfkzopd` / Free
- 테이블: `public.member_homes`; `user_id`는 Supabase Auth 사용자 UUID
- RLS: 로그인한 계정의 `auth.uid() = user_id`인 행만 조회·생성·수정
- 비회원은 이 테이블을 읽거나 쓸 수 없고, 현재 브라우저에만 임시 보관
- 로그인할 때 기존 계정 방이 있으면 우선 불러오며, 없으면 이 브라우저의 게스트 방을 계정에 저장
- 불러오기 실패 시 자동 저장을 막고, 저장 실패는 화면에 표시
- 계정 전환 시 화면과 저장 대기열을 분리

Supabase 설정 순서:

1. `supabase/migrations/202610200001_member_homes.sql` 실행 (최초 1회).
2. Authentication → URL Configuration에서 Site URL과 허용 Redirect URL을 공개 사이트 주소로 설정.
3. Google Cloud OAuth 웹 클라이언트에 callback `https://izdkmewsfuhbrrfkzopd.supabase.co/auth/v1/callback` 등록.
4. Supabase Authentication → Sign In / Providers → Google에 Client ID와 Secret 등록하고 활성화.
5. Google 앱 대상을 외부·프로덕션으로 전환해야 테스트 사용자 외에도 로그인할 수 있습니다.

외부 SMTP나 Brevo는 사용하지 않습니다. 이메일 로그인은 제공하지 않고 Google 소셜 로그인만 사용합니다. 유료 결제·카드 등록·요금제 업그레이드는 필요하지 않습니다.

### 기존 Sites 버전

기존 ChatGPT Sites 배포와 D1 데이터는 보존합니다. 그 배포의 `/api/home`과 `db/home-store.ts`는 기존 서버 구현입니다. `taste_homes`의 Sites 사용자 ID와 `member_homes`의 Supabase Auth UUID는 서로 다르므로 자동 계정 연결이나 기존 기록 이전은 하지 않습니다. 이전 방은 기존 사이트에서 계속 확인할 수 있습니다. 기존 서버용 Supabase 환경변수 예시는 `.env.example`이며 공개 Pages 빌드에는 사용하지 않습니다.

## 개발

Node 22.13 이상, pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev:public
pnpm exec tsc --noEmit
pnpm build:public
```

로컬 주소: `http://127.0.0.1:5173/naru-taste-house/`. OAuth 검증은 허용 Redirect URL로 등록된 실제 HTTPS 공개 주소에서 진행합니다. 다른 정적 호스팅에 배포할 때는 `PUBLIC_BASE_PATH=/`로 빌드할 수 있습니다. 기존 Sites 개발·빌드는 `pnpm dev`, `pnpm build`로 유지합니다.

## 주요 파일

- `web/main.tsx`: 공개 앱 진입점과 Google 로그인
- `web/home-storage.ts`: Supabase 회원별 저장
- `vite.public.config.ts`, `.github/workflows/pages.yml`: 일반 공개 호스팅 빌드와 배포
- `app/taste-house.tsx`: 화면·내비게이션·상태·상호작용
- `app/room.tsx`: 쿼터뷰 방, 가구와 레이어형 아바타
- `app/data.ts`: 캐릭터·테스트·결과·가구·장소·코스 데이터
- `app/place-art.tsx`: 직접 제작한 장소 분위기 일러스트
- `app/api/home/route.ts`: 계정별 조회·저장 API
- `db/home-store.ts`: Supabase REST API 및 기존 D1 저장 어댑터
- `supabase/migrations/`: Supabase PostgreSQL 테이블과 접근 제한 SQL
- `.env.example`: 비밀값을 포함하지 않는 서버 환경변수 예시
- `db/schema.ts`, `drizzle/`: 회원 데이터 스키마와 마이그레이션
- `astryx-themes.ts`: CLI가 생성한 Astryx 테마 연결
- `outputs/`: 로컬 시각 검증 이미지 (배포 소스에서 제외)

## 참고

사용자가 첨부한 PDF의 미니홈피·OS 창 무드, 파스텔 팔레트, 나루와 취향들 삼면도를 참고했습니다. 삼면도 원본은 `public/characters/`에 복사하고 CSS로 정면을 보여줍니다. 외부 서비스의 화면·아이콘·게임 리소스는 복제하지 않았습니다.

- Pinterest Y2K/Aero: https://www.pinterest.com/ideas/y2k-aero-aesthetic/935792476976/
- Pinterest digital Y2K: https://www.pinterest.com/aesthetics/digital-y2k-aesthetic/
- Three.js 직교 투영 개념: https://threejs.org/docs/pages/OrthographicCamera.html
- 한국관광공사 전포카페거리: https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=&vcontsId=192977
- 한국관광공사 보수동 책방골목: https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=e410927d-57d0-469d-8bf9-92ebdff284a3
- 부산 공식 관광 포털: https://www.visitbusan.net/

Three.js의 직교 투영을 참고하되, 이번 버전의 실제 렌더링은 WebGL 없이 SVG로 구현했습니다.

Google OAuth 공급자 설정이 완료되기 전에는 로그인 창에서 준비 중임을 표시합니다. 공개 열람과 브라우저 임시 저장은 독립적으로 사용할 수 있습니다.
