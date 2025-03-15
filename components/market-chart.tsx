"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchCoinMarketChart } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLine,
  ChartArea,
  ChartLinearScale,
  ChartTimeScale,
} from "@/components/ui/chart"

export function MarketChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["bitcoin-chart"],
    queryFn: () => fetchCoinMarketChart("bitcoin", 7),
  })

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (!data) {
    return <div className="flex h-[300px] items-center justify-center">Failed to load chart data</div>
  }

  const chartData = data.prices.map(([timestamp, price]) => ({
    x: new Date(timestamp),
    y: price,
  }))

  const minPrice = Math.min(...chartData.map((point) => point.y))
  const maxPrice = Math.max(...chartData.map((point) => point.y))
  const priceChange = chartData[chartData.length - 1].y - chartData[0].y
  const isPositive = priceChange >= 0

  return (
    <ChartContainer>
      <Chart>
        <ChartTimeScale />
        <ChartLinearScale />
        <ChartArea
          data={chartData}
          fill={isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"}
          stroke={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
          strokeWidth={2}
        />
        <ChartLine data={chartData} stroke={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"} strokeWidth={2} />
        <ChartTooltip>
          {({ point }) => {
            if (!point) return null
            return (
              <ChartTooltipContent>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">{new Date(point.x).toLocaleDateString()}</div>
                  <div className="text-sm font-bold">
                    ${point.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </ChartTooltipContent>
            )
          }}
        </ChartTooltip>
      </Chart>
    </ChartContainer>
  )
}

