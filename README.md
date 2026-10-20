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
- ChatGPT 로그인과 회원별 서버 저장, 브라우저 게스트 임시 보관
- Supabase PostgreSQL 저장 어댑터와 RLS 마이그레이션 (서버 환경변수로 연결)
- 데스크톱·태블릿·모바일 반응형 레이아웃

캐릭터 대화는 집필된 선택형 콘텐츠입니다. 심리 진단이나 자유 입력 AI 채팅이 아닙니다. 장소 일러스트는 실제 건축물 사진이 아니며, 코스 소요시간과 예산은 편집 제안입니다. 실제 제휴·결제·쿠폰·예약은 구현 범위에 포함하지 않았습니다.

## 계정과 저장

Sites의 로그인 경계가 제공하는 사용자 ID를 서버에서 읽습니다. 클라이언트가 전달하는 사용자 ID로 저장하지 않습니다. `taste_homes` 테이블에 별명·방·아바타·테스트 기록·보관 목록을 저장합니다. 저장 API는 로그인, 동일 출처 요청, 스키마와 길이 제한을 검사합니다. 서버 저장 실패는 화면에 알립니다. 방 불러오기 실패 시 기존 계정 기록을 덮어쓰지 않습니다.

저장소 선택은 `HOME_DATABASE_PROVIDER` 환경변수로 결정합니다. `supabase`이면 Supabase PostgreSQL을 사용하고, 지정하지 않으면 기존 Cloudflare D1을 사용합니다. Supabase 연결 오류 시 D1으로 자동 전환하지 않으므로 두 저장소에 기록이 나뉘지 않습니다.

### Supabase 연결

1. 무료 프로젝트에서 `supabase/migrations/202610190001_taste_homes.sql`을 실행합니다.
2. 호스팅 서비스의 **서버 환경변수**에 `.env.example`의 세 항목을 등록합니다.
3. `SUPABASE_SECRET_KEY`에는 해당 프로젝트의 서버용 secret key를 지정합니다. 실제 값을 Git에 커밋하거나 `NEXT_PUBLIC_` 변수로 전달하지 않습니다.
4. 기존 데이터가 있으면 서비스 전환 전에 옮긴 뒤 서버를 다시 배포합니다.

브라우저용 `anon`·`authenticated` 역할에는 이 테이블의 권한을 주지 않습니다. RLS를 켠 상태에서 서버용 키로만 접근하며, 서버 API가 로그인한 사용자의 ID로 조회·저장 범위를 제한합니다. 인증은 현재 Sites의 ChatGPT 로그인을 유지합니다. Supabase Auth로 바꾼 구현은 아닙니다.

**2026-10-20 상태:** Supabase 무료 프로젝트와 테이블 생성, 저장 어댑터 구현까지 완료했습니다. 실제 서비스의 Supabase 서버 비밀키 설정과 기존 기록 이전은 아직 완료되지 않았으며, 기존 배포의 저장 대상은 D1입니다. 무료 플랜 범위에서 작업하며 유료 업그레이드를 요구하지 않습니다.

현재 배포는 소유자 비공개입니다. 일반 회원 모집용 공개 서비스로 전환하려면 별도로 사이트 접근 범위 변경, 운영용 장소 데이터 확장, 이용약관·개인정보 처리와 회원 탈퇴 절차 등을 준비해야 합니다. 비밀번호 방식 대신 ChatGPT 로그인으로 회원을 구분합니다.

## 개발

Node 22.13 이상, pnpm 11.25.0. 의존성 빌드 승인은 `pnpm-workspace.yaml`에 명시되어 있습니다.

```sh
pnpm install
pnpm dev
pnpm exec tsc --noEmit
pnpm build
```

로컬 미리보기는 `http://127.0.0.1:5173`입니다. `/signin-with-chatgpt?return_to=/`는 로컬 전용 테스트 계정으로 연결됩니다. 이 모의 인증은 프로덕션 빌드에 포함되지 않습니다.

D1 로컬 테이블을 처음 만들 때 빌드 후 다음 명령을 한 번 실행합니다.

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_parallel_wraith.sql
```

배포는 Sites 소스 동기화·빌드·패키징 도우미로 진행하며 원격 마이그레이션은 Sites가 적용합니다. 로컬 DB와 실제 배포 DB는 분리됩니다.

## 주요 파일

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
