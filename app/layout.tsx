import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/app/providers"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CryptoTrackX - Cryptocurrency Tracking App",
  description:
    "Track cryptocurrency prices, market data, and manage your portfolio with Web3 integration",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />

          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"
import { Navbar } from "@/components/Navbar"
