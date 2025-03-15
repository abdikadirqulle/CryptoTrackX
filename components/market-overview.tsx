"use client"

import { useQuery } from "@tanstack/react-query"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchGlobalData } from "@/lib/api"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils"
import { MarketChart } from "@/components/market-chart"

export function MarketOverview() {
  const { data: globalData, isLoading } = useQuery({
    queryKey: ["globalData"],
    queryFn: fetchGlobalData,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Market Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[160px]" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(globalData?.total_market_cap.usd)}</div>
            )}
            {!isLoading && globalData && (
              <p
                className={`text-xs ${globalData.market_cap_change_percentage_24h_usd >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {formatPercentage(globalData.market_cap_change_percentage_24h_usd)} (24h)
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[160px]" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(globalData?.total_volume.usd)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{formatPercentage(globalData?.market_cap_percentage.btc)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cryptocurrencies</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{formatNumber(globalData?.active_cryptocurrencies)}</div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Market Trend</CardTitle>
          <CardDescription>Bitcoin price over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <MarketChart />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

