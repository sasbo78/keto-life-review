import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Traffic Monster — Profit Engine",
  description: "AI-Powered Affiliate Profit Engine. Discover golden keywords, auto-generate content, and scale your earnings.",
  icons: { icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg" },
  verification: { google: "kJgFJDWv--Rvmivh638UOBZkRqN3Cd9Bd97MJ8QdThk" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-D3TRLNGNW" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date()); gtag('config', 'G-D3TRLNGNW');`}
        </Script>
      </body>
    </html>
  )
}
