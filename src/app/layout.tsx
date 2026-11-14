import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "议场 AGORA · 多智能体决策沙盘",
  description: "让不同意见先充分发生，再把决策变成可解释、可回放的行动。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
