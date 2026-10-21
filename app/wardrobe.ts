import type { HomeState } from './data';

export const tasteLooks: {name:string;avatar:HomeState['avatar']}[] = [
 {name:'발견 · 나루',avatar:{hair:6,outfit:4,accessory:1,face:0}},
 {name:'몰입 · 달리',avatar:{hair:4,outfit:5,accessory:4,face:1}},
 {name:'수집 · 모래',avatar:{hair:5,outfit:6,accessory:5,face:2}},
 {name:'휴식 · 민트',avatar:{hair:0,outfit:3,accessory:3,face:0}},
];

export const wardrobeGroups = [
 {key:'face',title:'얼굴 표정',labels:['나루의 미소','달리의 시크함','모래의 설렘'],colors:['#e5f4fa','#f4dce6','#fff4cf']},
 {key:'hair',title:'헤어 스타일',labels:['블루 장발','밀크티 장발','피치 장발','라일락 장발','달리의 로즈 장발','모래의 사이드 포니','나루의 웨이브 단발'],colors:['#c2e4f6','#d8c6bd','#f6d9e3','#e4d8f3','#e3b0c2','#fff0b4','#c6e5f5']},
 {key:'outfit',title:'오늘의 옷',labels:['화이트 베이스','핑크 원피스','라일락 가디건','민트 스트라이프','나루의 바다 원피스','달리의 웨이브 니트','모래의 리본 가디건'],colors:['#fffdf5','#ffd7f2','#ecd7ff','#d2fad3','#daedf8','#f0cfdf','#fff3d8']},
 {key:'accessory',title:'작은 포인트',labels:['가볍게, 없이','파도 머리핀','독서 안경','구름 헤드폰','달리의 블랙 안경','모래의 초코 머리핀'],colors:['#faf6ef','#d2e9f5','#e0d6f1','#fff2c8','#e6e1e8','#f0e4cd']},
] as const;
