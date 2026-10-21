import type { FurnitureRotation } from './furniture-rotation';
import { DEFAULT_CHARACTER, type CharacterPlacement } from './character';

export const friends = [
 {name:'나루',key:'naru',color:'#A9D8F3',tag:'발견하는 즐거움',line:'저기, 네가 좋아할 것 같은데?'},
 {name:'달리',key:'dalli',color:'#F6CFE2',tag:'깊이 빠지는 즐거움',line:'한 번만 더. 이번엔 진짜.'},
 {name:'모래',key:'morae',color:'#FFF2C8',tag:'소중히 간직하는 즐거움',line:'이건 아껴두고… 하나 더 쓸까?'},
 {name:'부크',key:'buke',color:'#D8F0E6',tag:'쉬어가는 즐거움',line:'좋아. 잠깐 쉬었다 갈까?'},
];
export const results = [
 {title:'반짝이는 발견의 방',subtitle:'호기심이 데려온 작은 보물들',friend:0,tags:['취향 탐험가','작은 발견','골목 산책'],text:'낯선 골목에서도 너만의 반짝임을 발견하는 사람이야. 처음 보는 물건과 이야기가 새로운 즐거움으로 이어져. 모두 담으려 애쓰지 않아도 괜찮아. 오늘 마음에 남는 하나면 충분해.',tip:'평소 지나치던 골목에서 마음에 드는 색 하나를 찾아봐.',mood:'blue' as const},
 {title:'푹 빠져드는 상상의 방',subtitle:'좋아하는 세계는 끝이 없으니까',friend:1,tags:['세계관 탐험','깊은 몰입','게임과 이야기'],text:'좋아하는 것을 만나면 작은 설정까지 알고 싶어지는 사람이야. 너의 책상에는 아직 끝나지 않은 이야기가 가득해. 몰입하는 즐거움 사이에 쉬는 자리도 하나 남겨두자.',tip:'좋아하는 작품에서 새롭게 발견한 디테일 하나를 적어봐.',mood:'lavender' as const},
 {title:'아껴둔 반짝임의 방',subtitle:'작은 물건에도 마음이 머무는 곳',friend:2,tags:['소중한 수집','문구와 소품','추억 보관'],text:'좋아하는 순간을 오래 곁에 두고 싶은 사람이야. 작은 스티커에도 그날의 기분이 남아 있지. 아껴두는 것도 애정이지만, 가끔은 써보는 즐거움도 너의 것이야.',tip:'아껴둔 스티커 하나를 오늘의 페이지에 붙여봐.',mood:'pink' as const},
 {title:'느긋한 파도의 방',subtitle:'나만의 속도로 좋아하는 하루',friend:3,tags:['여유로운 산책','음악과 바다','편안한 시간'],text:'좋아하는 음악과 편한 자리만 있어도 하루가 달라지는 사람이야. 바쁘게 많이 보기보다 마음이 머무는 곳에서 천천히 즐기는 걸 좋아해. 너의 속도로 걸어도 좋은 발견은 찾아와.',tip:'좋아하는 노래 한 곡을 들으며 잠깐 창밖을 바라봐.',mood:'mint' as const},
];
export const questions = [
 {f:0,q:'쉬는 날, 처음 가본 골목에서 작은 가게를 발견했어. 우리 어떻게 할까?',a:['일단 들어가 보자! 어떤 보물이 있을까?','창밖의 작은 디테일부터 살펴볼래.','예쁜 물건이 있으면 하나 간직하고 싶어.','오늘은 걷다가 편한 곳에서 쉬고 싶어.'],r:['역시! 새로운 발견에는 문을 열어봐야지.','작은 디테일까지 보는구나. 달리도 좋아하겠다!','그날의 기분까지 함께 데려오는 거네.','좋아. 천천히 걸어도 발견은 찾아오니까.']},
 {f:2,q:'마음에 쏙 드는 스티커를 샀어. 첫 장은 어디로 갈까?',a:['새로 꾸미는 여행 지도에 붙일래.','최애 노트에 주제별로 정리할래.','아직 못 고르겠어. 우선 소중히 보관!','지금 쓰는 다이어리에 편하게 붙일래.'],r:['다음 모험의 표시가 되겠다!','좋아하는 세계가 한눈에 보이겠네.','나도 그래… 그래도 언젠가 꼭 써보자.','오늘을 예쁘게 만드는 것도 좋지.']},
 {f:1,q:'내일 일찍 나가야 하는데, 최애 작품의 숨겨진 설정을 발견했어.',a:['관련된 새로운 작품도 찾아볼래.','이것만 확인하고 잔다. 진짜로.','일단 저장! 오래 곱씹어볼래.','내일의 즐거움으로 남겨두고 잘래.'],r:['발견이 또 다른 발견으로 이어지네.','이것만… 나도 자주 하는 말인데.','좋은 이야기는 다시 꺼내보게 되지.','좋아. 푹 쉬어야 더 즐길 수 있어.']},
 {f:3,q:'친구와 부산에 놀러 왔어. 오후 두 시간이 비었는데 뭘 할까?',a:['안 가본 골목을 탐험해보자.','게임이나 전시 하나를 제대로 즐기자.','문구와 소품 가게에서 보물찾기!','바다 보이는 곳에서 음악 들으며 쉬자.'],r:['나루한테 연락해야겠네.','두 시간이 모자랄지도 모르겠다.','작은 기념품 하나 남겨도 좋겠다.','그게 내가 제일 좋아하는 시간이야.']},
 {f:0,q:'네 방에 빈 선반 하나가 생겼어. 가장 먼저 놓고 싶은 건?',a:['앞으로 가보고 싶은 곳들의 지도','좋아하는 작품의 책과 게임','추억이 담긴 소품과 사진','식물 하나와 작은 스피커'],r:['곧 새로운 핀이 꽂히겠네!','너만의 세계를 모아두는 자리구나.','볼 때마다 기분이 좋아지는 선반이겠다.','편하게 숨 쉴 수 있는 공간이네.']},
 {f:2,q:'여행에서 돌아왔어. 가장 오래 남기고 싶은 건 뭐야?',a:['뜻밖에 발견한 장소 이야기','마음에 남은 작품과 새로운 지식','그날의 티켓과 작은 기념품','천천히 보낸 하루의 기분'],r:['그 이야기, 나한테도 들려줘!','여행이 끝나도 이야기는 이어지는구나.','작은 물건에 하루가 담겨 있지.','그 기분을 꺼내 쉴 수 있으면 좋겠다.']},
 {f:1,q:'친구가 네 취향을 물어봤어. 어떤 얘기를 가장 먼저 할까?',a:['요즘 새롭게 발견한 것들!','내가 푹 빠진 세계관 이야기','오래 모아온 나만의 컬렉션','나를 편안하게 해주는 것들'],r:['다음에 같이 구경하자고 할 것 같은데.','시간 넉넉할 때 물어봐야겠네.','물건마다 사연이 있겠구나.','좋은 취향이네. 같이 쉬자.']},
 {f:3,q:'오늘의 방에 마지막으로 이름을 붙여보자. 어떤 마음이 좋아?',a:['언제든 새로운 문을 여는 마음','좋아하는 세계에 푹 빠지는 마음','작은 반짝임을 간직하는 마음','내 속도로 편안히 쉬는 마음'],r:['이제 너의 방을 열어볼까?','너만의 세계가 준비됐어.','네가 아끼는 마음들을 모아봤어.','편하게 머물 수 있는 방이 되었으면 해.']},
];
export type FurnitureKind='sofa'|'desk'|'plant'|'lamp'|'shelf'|'rug'|'cat'|'stereo'|'flowers';
export type Item={id:string;kind:FurnitureKind;x:number;y:number;flip?:boolean;rotation?:FurnitureRotation};
export type HomeState={nickname:string;bio:string;mood:'blue'|'pink'|'lavender'|'mint';avatar:{hair:number;outfit:number;accessory:number;face?:number};character?:CharacterPlacement;items:Item[];result:number|null;history:{type:number;date:string}[];saved:string[];visited:string[];rewards:string[];points:number};
export const initialState:HomeState={nickname:'취향 여행자',bio:'좋아하는 것들을 차곡차곡 모으는 중 ♡',mood:'blue',avatar:{hair:0,outfit:0,accessory:0},character:{...DEFAULT_CHARACTER},items:[{id:'sofa',kind:'sofa',x:1,y:3.7},{id:'desk',kind:'desk',x:4,y:1},{id:'rug',kind:'rug',x:2.5,y:2.7},{id:'plant',kind:'plant',x:4.7,y:4},{id:'shelf',kind:'shelf',x:.5,y:.8},{id:'lamp',kind:'lamp',x:.4,y:4.5},{id:'stereo',kind:'stereo',x:4.5,y:2.2}],result:null,history:[],saved:[],visited:[],rewards:[],points:0};
export const furniture:{kind:FurnitureKind;name:string;cost:number}[]=[{kind:'sofa',name:'구름 소파',cost:0},{kind:'desk',name:'취향 책상',cost:0},{kind:'plant',name:'초록 친구',cost:0},{kind:'lamp',name:'달빛 조명',cost:0},{kind:'shelf',name:'보물 선반',cost:0},{kind:'rug',name:'조개 러그',cost:0},{kind:'stereo',name:'레트로 오디오',cost:0},{kind:'cat',name:'낮잠 고양이',cost:30},{kind:'flowers',name:'여행의 꽃',cost:30}];
export type Place={id:string;name:string;area:string;address:string;tag:string;desc:string;hours:string;url:string;type:number;art:string};
export const places:Place[]=[
 {id:'brena',name:'부산이스포츠경기장 BRENA',area:'전포·서면',address:'부산 부산진구 중앙대로 672 삼정타워 15·16층',tag:'e스포츠 · 게임 문화',desc:'좋아하는 게임을 다른 사람들과 함께 만나는 공간. 경기 관람과 체험은 공식 일정·예약 가능 여부를 먼저 확인해 주세요.',hours:'대회·체험 일정에 따라 운영 · 공식 일정 확인',url:'https://brena.or.kr/',type:1,art:'game'},
 {id:'jeonpo',name:'전포카페거리',area:'전포·서면',address:'부산 부산진구 전포동 일대',tag:'골목 탐험 · 카페',desc:'골목마다 다른 분위기의 카페와 작은 가게를 발견하는 즐거움. 마음에 드는 색과 간판을 찾아 걸어봐요.',hours:'거리 상시 개방 · 개별 매장 운영시간 확인',url:'https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=&vcontsId=192977',type:0,art:'cafe'},
 {id:'samjung',name:'삼정타워',area:'전포·서면',address:'부산 부산진구 중앙대로 672',tag:'복합문화 · 쇼핑',desc:'서면에서 쇼핑과 휴식을 함께 즐기는 실내 공간. 입점 매장과 행사 여부는 공식 안내에서 확인해 주세요.',hours:'층별·매장별 상이 · 공식 안내 확인',url:'https://www.samjungtower.com/main/16',type:1,art:'game'},
 {id:'bosu',name:'보수동 책방골목',area:'남포·보수',address:'부산 중구 책방골목길 일대',tag:'헌책 · 이야기 수집',desc:'책등 사이에서 우연히 만나는 문장들. 오래된 책과 작은 기록을 좋아하는 취향에게 어울려요.',hours:'골목 상시 개방 · 책방별 영업시간 상이',url:'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=e410927d-57d0-469d-8bf9-92ebdff284a3',type:2,art:'book'},
 {id:'gukje',name:'국제시장',area:'남포·보수',address:'부산 중구 신창동4가 일대',tag:'시장 · 소품 탐색',desc:'오래된 물건과 생활 소품을 천천히 둘러보는 산책. 구매하지 않아도 골목의 이야기를 모을 수 있어요.',hours:'구역·점포별 운영시간과 휴무 상이',url:'https://www.visitbusan.net/',type:0,art:'market'},
 {id:'huinnyeoul',name:'흰여울문화마을',area:'영도',address:'부산 영도구 흰여울길 일대',tag:'바다 · 사진 · 산책',desc:'바다를 따라 이어지는 골목에서 나만의 속도로 걷는 시간. 주민의 일상이 있는 마을이니 조용히 둘러봐요.',hours:'골목 상시 개방 · 주거지 방문 배려',url:'https://www.ydculture.com/',type:3,art:'sea'},
 {id:'gwangalli',name:'광안리해수욕장',area:'광안리',address:'부산 수영구 광안해변로 일대',tag:'바다 · 음악 · 휴식',desc:'파도 소리를 들으며 잠깐 쉬어가는 코스. 좋아하는 노래 한 곡과 오늘의 기분을 남겨보세요.',hours:'해변 산책 가능 · 행사·시설 운영 별도 확인',url:'https://www.suyeong.go.kr/tour/index.suyeong',type:3,art:'bridge'},
];
export const courses=[
 {id:'course-jeonpo',name:'전포에서 찾은 작은 반짝임',area:'전포·서면',type:0,ids:['jeonpo','samjung'],duration:'약 2–3시간',budget:20000,budgetLabel:'2만원 안팎',desc:'골목의 작은 발견에서 시작해, 실내에서 취향 구경까지.',art:'cafe'},
 {id:'course-game',name:'서면, 좋아하는 세계 속으로',area:'전포·서면',type:1,ids:['brena','samjung','jeonpo'],duration:'약 2–3시간',budget:20000,budgetLabel:'2만원 안팎',desc:'BRENA의 공식 일정을 확인하고, 서면 구경과 전포에서 취향 이야기.',art:'game'},
 {id:'course-book',name:'책갈피에 끼워둔 부산',area:'남포·보수',type:2,ids:['bosu','gukje'],duration:'약 2시간',budget:10000,budgetLabel:'1만원 안팎',desc:'헌책의 문장과 시장 골목의 보물을 차곡차곡 모으는 하루.',art:'book'},
 {id:'course-sea',name:'파도 소리에 잠깐 쉬어가기',area:'영도',type:3,ids:['huinnyeoul'],duration:'약 1–2시간',budget:0,budgetLabel:'산책 무료',desc:'흰여울 골목에서 바다를 따라 천천히 걷는 시간.',art:'sea'},
 {id:'course-bridge',name:'광안리의 느긋한 플레이리스트',area:'광안리',type:3,ids:['gwangalli'],duration:'약 1시간',budget:0,budgetLabel:'산책 무료',desc:'좋아하는 음악과 광안대교를 바라보는 나만의 쉼표.',art:'bridge'},
];
