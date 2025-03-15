import Link from "next/link"
import React from "react"
import { WalletConnect } from "./wallet-connect"

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CryptoTrackX
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/portfolio"
            className="font-medium transition-colors hover:text-primary"
          >
            Portfolio
          </Link>
          <Link
            href="/watchlist"
            className="font-medium transition-colors hover:text-primary"
          >
            Watchlist
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}
