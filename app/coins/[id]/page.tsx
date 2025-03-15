"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ExternalLink, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCoinDetails } from "@/lib/api"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils"
import { CoinPriceChart } from "@/components/coin-price-chart"
import { useWatchlist } from "@/hooks/use-watchlist"

export default function CoinDetailPage() {
  const { id } = useParams()
  const coinId = id as string

  const { data: coin, isLoading: isLoadingCoin } = useQuery({
    queryKey: ["coin", coinId],
    queryFn: () => fetchCoinDetails(coinId),
  })

  const { watchlist, toggleWatchlist } = useWatchlist()
  const isWatchlisted = watchlist.includes(coinId)

  if (isLoadingCoin) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!coin) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Coin not found</h1>
        </div>
        <p>The requested cryptocurrency could not be found.</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <img src={coin.image.small || "/placeholder.svg"} alt={coin.name} className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{coin.name}</h1>
          <span className="text-muted-foreground uppercase">{coin.symbol}</span>
          <div
            className={`px-2 py-1 rounded-full text-xs ${
              coin.market_data.price_change_percentage_24h >= 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {formatPercentage(coin.market_data.price_change_percentage_24h)} (24h)
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => toggleWatchlist(coinId)}>
            <Star className={`h-4 w-4 ${isWatchlisted ? "fill-yellow-400 text-yellow-400" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="1d">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">{formatCurrency(coin.market_data.current_price.usd)}</h2>
              <TabsList>
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="1d">
              <CoinPriceChart coinId={coinId} days={1} />
            </TabsContent>
            <TabsContent value="7d">
              <CoinPriceChart coinId={coinId} days={7} />
            </TabsContent>
            <TabsContent value="30d">
              <CoinPriceChart coinId={coinId} days={30} />
            </TabsContent>
            <TabsContent value="1y">
              <CoinPriceChart coinId={coinId} days={365} />
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">About {coin.name}</h3>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: coin.description.en }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Market Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-medium">{formatCurrency(coin.market_data.market_cap.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Trading Volume</span>
                <span className="font-medium">{formatCurrency(coin.market_data.total_volume.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fully Diluted Valuation</span>
                <span className="font-medium">{formatCurrency(coin.market_data.fully_diluted_valuation.usd || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Circulating Supply</span>
                <span className="font-medium">
                  {formatNumber(coin.market_data.circulating_supply)} {coin.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply</span>
                <span className="font-medium">
                  {formatNumber(coin.market_data.total_supply || 0)} {coin.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Supply</span>
                <span className="font-medium">
                  {coin.market_data.max_supply ? formatNumber(coin.market_data.max_supply) : "∞"}{" "}
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Price Change</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h</span>
                <span className={coin.market_data.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
                  {formatPercentage(coin.market_data.price_change_percentage_24h)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">7d</span>
                <span className={coin.market_data.price_change_percentage_7d >= 0 ? "text-green-500" : "text-red-500"}>
                  {formatPercentage(coin.market_data.price_change_percentage_7d)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">30d</span>
                <span className={coin.market_data.price_change_percentage_30d >= 0 ? "text-green-500" : "text-red-500"}>
                  {formatPercentage(coin.market_data.price_change_percentage_30d)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">60d</span>
                <span className={coin.market_data.price_change_percentage_60d >= 0 ? "text-green-500" : "text-red-500"}>
                  {formatPercentage(coin.market_data.price_change_percentage_60d)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">1y</span>
                <span className={coin.market_data.price_change_percentage_1y >= 0 ? "text-green-500" : "text-red-500"}>
                  {formatPercentage(coin.market_data.price_change_percentage_1y)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">All-Time Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">All-Time High</span>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(coin.market_data.ath.usd)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">All-Time Low</span>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(coin.market_data.atl.usd)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(coin.market_data.atl_date.usd).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

