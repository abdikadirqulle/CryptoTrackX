import Link from "next/link"
import { CoinList } from "@/components/coin-list"
import { MarketOverview } from "@/components/market-overview"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-6">
        <MarketOverview />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Top Cryptocurrencies</h2>
          <CoinList />
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CryptoTrackX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
