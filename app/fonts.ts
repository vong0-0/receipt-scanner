import { Geist, Geist_Mono, Noto_Sans_Lao } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao", "latin"],
  variable: "--font-noto-lao",
});
