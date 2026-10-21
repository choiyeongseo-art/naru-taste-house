# 방 캐릭터 이동과 스프라이트

사용자가 선택한 동작은 기본 대기(`idle`), 독서(`read`), 앉기(`sit`), 춤추기(`dance`)입니다. 마이홈에서 캐릭터를 드래그할 수 있고, 방 꾸미기 → 내 캐릭터에서 동작·재생·위치 버튼을 사용할 수 있습니다. 선택한 캐릭터에는 방향키와 Shift+방향키도 적용됩니다.

## 저장과 호환성

`HomeState.character`에 바닥 좌표 `x/y`, `pose`, `animated`, 멈춰 둔 `frame`을 저장합니다. `app/character.ts`가 좌표 변환, 경계 제한, 이전 방의 기본 위치를 관리합니다. 웹 Supabase 저장과 서버 저장은 `lib/character-schema.ts`의 동일한 검증을 사용합니다. 기존 방에 이 필드가 없으면 기존 표시 위치와 기본 대기를 사용합니다. JSON 방 데이터 안의 추가 필드이므로 테이블 변경은 필요하지 않습니다.

캐릭터와 가구는 같은 바닥 깊이 순서로 표시하며 러그는 바닥에 먼저 그립니다. 드래그는 잡은 지점의 오프셋을 유지하고 SVG의 화면 변환을 역산하므로 확대된 방에서도 좌표가 일치합니다. 캐릭터를 옮기거나 포즈를 바꿔도 가구 목록은 변경하지 않습니다.

## 제작 도구와 기본 선택

사용자 지정 도구: [aldegad/sprite-gen](https://github.com/aldegad/sprite-gen), 설치 버전 2.45.2.

- 프로젝트 전용 설치: `vendor/skills/sprite-gen/`
- 실행 환경: `vendor/skills/sprite-gen/.venv/Scripts/python.exe`
- 설정: `outputs/sprite-gen-config/preferences.json` (`SPRITE_GEN_CONFIG_DIR`로 지정)
- 사용자가 저장하도록 선택한 기본값: `gpt-rows`, `curation: skip`, Codex 이용 불가 시 `ask`
- 생성 원본과 추출·검수 자료: `outputs/character-motion/naru-{base,pink,lilac,mint}/`

새 제작 작업은 해당 스킬의 `SKILL.md`와 `docs/user-workflow.md`를 읽고 시작합니다. 프로젝트 설치와 가상환경은 Git에서 제외되며 공개 웹 빌드에는 필요하지 않습니다.

공식 파이프라인 `prepare → gen-set --provider codex → extract → compose-atlas → compose-gif → inspect`로 네 가지 기존 기본 착장에 각각 17프레임을 만들었습니다. 독서·앉기는 바닥에 앉는 동작이며 가구에 자동 결합하는 동작은 아닙니다. 원본 렌더러의 미완성 착장 번호 4–6은 기존과 동일하게 기본 착장으로 표시됩니다.

## 런타임 파일

`scripts/package-room-sprites.mjs`는 공식 합성 아틀라스를 `public/art/motions/`로 복사하고, `manifest.json.frame_layout`과 원래 프레임 시간을 `app/character-motion.json`으로 옮깁니다. 프레임을 다시 자르거나 아틀라스를 재구성하지 않습니다.

`scripts/measure-room-sprite-heads.py`는 합성 아틀라스에서 두 눈의 위치와 기울기를 측정해 기존 SVG 액세서리의 부착 좌표를 만듭니다. 이미지와 모션은 수정하지 않습니다. 앉은 동작의 `.9` 배율은 방 안의 표시 크기 보정이며 프레임이나 재생 속도 보정이 아닙니다. 재생은 원래 manifest의 시간표를 사용하고, 재생 중인 모든 프레임을 저장하지 않고 일시정지 시 선택된 프레임만 저장합니다. 모션 감소 설정에서는 자동 재생을 멈춥니다.

PNG 내보내기는 현재 위치와 현재 표시 프레임을 복사하며 편집용 선택 테두리와 히트 영역을 제외합니다.

## 검증

```powershell
node --experimental-strip-types --test scripts/character-placement.test.mjs scripts/character-storage.test.mjs
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vite/bin/vite.js build --config vite.public.config.ts
```

브라우저에서 드래그, 방향키·위치 버튼, 포즈 선택, 일시정지, 새로고침 후 위치·포즈·정지 프레임 복원, PNG 내보내기를 확인했습니다. 모바일 390px에서는 가로 넘침 없이 포즈 패널이 표시되고 위치 버튼은 44×44px입니다. 실제 로그인된 계정으로 원격 데이터베이스에 테스트 데이터를 저장하지는 않았으며, 회원 저장 스키마의 왕복 검증은 자동 테스트에 포함됩니다.

작은 모션의 시각 검수와 공식 경고는 각 생성 폴더의 `qa-notes.md`에 기록합니다. Windows에서는 개발 서버가 생성 폴더를 감시하지 않도록 Vite 감시에서 `outputs/`와 `vendor/skills/`를 제외합니다.
