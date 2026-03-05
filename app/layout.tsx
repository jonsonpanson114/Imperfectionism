import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Imperfectionism — 不完全主義を受け入れる",
  description: "人生は4000週間しかありません。全部はできないと受け入れましょう。",
  manifest: "/manifest.json",
  themeColor: "#1a1a2e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Imperfectionism",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
