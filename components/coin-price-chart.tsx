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

interface CoinPriceChartProps {
  coinId: string
  days: number
}

export function CoinPriceChart({ coinId, days }: CoinPriceChartProps) {
  const { data, isLoading } = useQuery({
    queryKey: [`${coinId}-chart-${days}`],
    queryFn: () => fetchCoinMarketChart(coinId, days),
  })

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (!data) {
    return <div className="flex h-[400px] items-center justify-center">Failed to load chart data</div>
  }

  const chartData = data.prices.map(([timestamp, price]) => ({
    x: new Date(timestamp),
    y: price,
  }))

  const priceChange = chartData[chartData.length - 1].y - chartData[0].y
  const isPositive = priceChange >= 0

  return (
    <div className="h-[400px]">
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
                    <div className="text-sm font-medium">{new Date(point.x).toLocaleString()}</div>
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
    </div>
  )
}

