const descriptions: Record<string,string> = {
 cafe:'전포 카페 골목 · 파스텔 윤곽선과 크롬 별 일러스트',
 book:'남포·보수의 시장 골목과 부산타워 · 파스텔 저녁 일러스트',
 game:'서면 상점가 · 파스텔 네온과 크롬 장식 일러스트',
 market:'남포 시장 골목과 부산타워 · 파스텔 저녁 일러스트',
 sea:'영도 흰여울 해안 골목 · 파스텔 낮 풍경 일러스트',
 bridge:'광안리와 광안대교 · 파스텔 저녁 일러스트',
};
const scenes:Record<string,string>={cafe:'jeonpo',book:'nampo',market:'nampo',game:'seomyeon',sea:'yeongdo',bridge:'gwangalli'};
export default function PlaceArt({kind='cafe'}:{kind?:string}) {
 const key=kind in descriptions?kind:'cafe';
 return <svg viewBox='0 0 400 220' role='img' aria-label={descriptions[key]} xmlns='http://www.w3.org/2000/svg'>
  <image href={'./art/destinations/'+scenes[key]+'-v2.png'} width='400' height='220' preserveAspectRatio='xMidYMid meet'/>
 </svg>;
}
