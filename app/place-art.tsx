const descriptions: Record<string,string> = {
 cafe:'전포 골목을 상상한 파스텔 카페 일러스트',
 book:'보수동 골목을 상상한 파스텔 책방 일러스트',
 game:'게임 문화 공간을 상상한 파스텔 일러스트',
 market:'시장 골목을 상상한 파스텔 일러스트',
 sea:'흰여울 해안 골목을 상상한 파스텔 일러스트',
 bridge:'광안리 바다와 다리를 상상한 파스텔 일러스트',
};
export default function PlaceArt({kind='cafe'}:{kind?:string}) {
 const key=kind in descriptions?kind:'cafe';
 return <svg viewBox='0 0 400 220' role='img' aria-label={descriptions[key]} xmlns='http://www.w3.org/2000/svg'>
  <image href={'./art/place-'+key+'.webp'} width='400' height='220' preserveAspectRatio='xMidYMid slice'/>
 </svg>;
}
