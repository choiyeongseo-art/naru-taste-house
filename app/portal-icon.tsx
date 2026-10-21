import { useId } from 'react';

type PortalKind = 'home' | 'test' | 'room' | 'closet' | 'courses' | 'collection' | 'plaza';

/** Small original glass-and-chrome illustrations, kept vector-sharp at menu sizes. */
export default function PortalIcon({ kind, className = '' }: { kind: PortalKind; className?: string }) {
  const id = useId().replace(/:/g, '');
  const ice = `url(#${id}-ice)`, chrome = `url(#${id}-chrome)`, lime = `url(#${id}-lime)`;
  const shape = { fill: ice, stroke: '#3572a8', strokeWidth: 1.3, strokeLinejoin: 'round' as const };
  return <svg className={`portal-icon ${className}`} viewBox='0 0 48 48' aria-hidden='true' focusable='false'>
    <defs>
      <linearGradient id={`${id}-ice`} x1='0' y1='0' x2='.3' y2='1' gradientUnits='objectBoundingBox'><stop stopColor='#ffffff'/><stop offset='.35' stopColor='#c3f1ff'/><stop offset='.52' stopColor='#68c9ee'/><stop offset='.56' stopColor='#259bdd'/><stop offset='1' stopColor='#c9f7ff'/></linearGradient>
      <linearGradient id={`${id}-chrome`} x1='0' y1='0' x2='.5' y2='1'><stop stopColor='#fff'/><stop offset='.35' stopColor='#d6e2eb'/><stop offset='.5' stopColor='#7b91a7'/><stop offset='.56' stopColor='#f6fbff'/><stop offset='1' stopColor='#9caec1'/></linearGradient>
      <linearGradient id={`${id}-lime`} x1='0' y1='0' x2='0' y2='1'><stop stopColor='#f6ffcb'/><stop offset='.45' stopColor='#d6fa8a'/><stop offset='1' stopColor='#94c843'/></linearGradient>
    </defs>
    <ellipse cx='24' cy='42' rx='15' ry='2' fill='#426d9620'/>
    {kind === 'plaza' && <><path d='m6 29 18-10 18 10-18 11Z' fill={lime} stroke='#659dac'/><path d='m24 19 18 10-7 4-18-10Z' {...shape}/><path d='M9 14q7-9 14 0Z' fill={ice} stroke='#557c9c'/><path d='M16 14v14' stroke='#7790a5' strokeWidth='2'/><path d='M24 27q4-4 8 0t8 0' fill='none' stroke='#fff' strokeWidth='2'/><circle cx='33' cy='10' r='5' fill={chrome}/></>}
    {kind === 'home' && <><path d='M10 23 24 10 38 23v16H10Z' {...shape}/><path d='M6 24 24 7 42 24l-4 4L24 15 10 28Z' fill={chrome} stroke='#657e97' strokeWidth='1.2' strokeLinejoin='round'/><path d='M21 28h8v11h-8Z' fill='#2677c4' stroke='#f1fcff'/><path d='M14 25h5v5h-5Z' fill={lime} stroke='#fff'/><path d='M12 35V24l12-11' fill='none' stroke='#fff' strokeWidth='1.5'/></>}
    {kind === 'test' && <><path d='m28 30 12 10' stroke='#48759c' strokeWidth='8' strokeLinecap='round'/><path d='m29 30 11 9' stroke={chrome} strokeWidth='5' strokeLinecap='round'/><circle cx='21' cy='21' r='15' fill={chrome} stroke='#4c7399' strokeWidth='1.1'/><circle cx='21' cy='21' r='11.6' {...shape}/><path d='m21 12 2.5 6.2L30 21l-6.5 2.5L21 30l-2.5-6.5L12 21l6.5-2.8Z' fill={lime} stroke='#fff' strokeWidth='1'/><path d='M11 19a11 11 0 0 1 9-9' fill='none' stroke='#fff' strokeWidth='2' strokeLinecap='round'/></>}
    {kind === 'room' && <><path d='m8 16 16-8 16 8v21l-16 7-16-7Z' {...shape}/><path d='m8 16 16 8 16-8M24 24v20' fill='none' stroke='#fff' strokeWidth='1.3'/><path d='m13 32 11 5 11-5v-8l-11 5-11-5Z' fill={chrome} stroke='#6382a0' strokeWidth='1'/><path d='m13 24 11 5 11-5-11-5Z' fill={lime} stroke='#f8ffde' strokeWidth='1'/><path d='M11 18v16' stroke='#fff' strokeWidth='1.5'/></>}
    {kind === 'closet' && <><path d='M20 13a5 5 0 1 1 7 4l-3 2v5' fill='none' stroke='#607d98' strokeWidth='5' strokeLinecap='round'/><path d='M20 13a5 5 0 1 1 7 4l-3 2v5' fill='none' stroke={chrome} strokeWidth='3' strokeLinecap='round'/><path d='m24 21 18 13a3 3 0 0 1-2 5H8a3 3 0 0 1-2-5Z' {...shape}/><path d='m24 26 11 8H13Z' fill='#f0faff'/><path d='m10 34 14-10 14 10' fill='none' stroke='#fff' strokeWidth='1.3'/><path d='M33 10h5v5h-5Z' fill={lime} stroke='#fff'/></>}
    {kind === 'courses' && <><circle cx='24' cy='24' r='17' {...shape}/><ellipse cx='24' cy='24' rx='8' ry='17' fill='none' stroke='#f0fcff' strokeWidth='1.1'/><path d='M8 19h32M8 29h32M24 7v34' stroke='#d8f6ff' strokeWidth='1'/><ellipse cx='24' cy='25' rx='23' ry='6.5' transform='rotate(-26 24 25)' fill='none' stroke={chrome} strokeWidth='3'/><path d='m30 9 9 1-3 8-2-4-5-1Z' fill={lime} stroke='#fff' strokeWidth='1'/></>}
    {kind === 'collection' && <><path d='M5 14V9h15l4 5h19v25H5Z' fill={chrome} stroke='#667f98' strokeWidth='1.2' strokeLinejoin='round'/><path d='M7 18h36l-4 22H4Z' {...shape}/><path d='M9 21h29' stroke='#fff' strokeWidth='1.6'/><path d='M23 24c-5-6-12 2-5 7l5 5 5-5c7-5 0-13-5-7Z' fill={lime} stroke='#fff' strokeWidth='1.1'/></>}
    <path d='M40 4v7M36.5 7.5h7' stroke='#fff' strokeWidth='1.7'/>
  </svg>;
}
