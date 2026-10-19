'use client';
import { Theme } from '@astryxdesign/core/theme';
import { themes, defaultThemeSlug } from '../astryx-themes';
export default function Providers({children}:{children:React.ReactNode}) {
 return <Theme theme={themes[defaultThemeSlug]} mode='light'>{children}</Theme>;
}
