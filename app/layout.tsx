import type { Metadata } from "next";
import "./globals.css";
import Providers from './providers';

export const metadata: Metadata = {
  title: "나루와 취향들 · 나의 취향방",
  description: "좋아하는 것들로 나를 채우는 작은 방. 캐릭터와 대화하고, 나만의 방을 꾸미고, 부산에서 새로운 취향을 발견해요.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
