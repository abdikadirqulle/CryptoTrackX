"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { ArrowUpDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCoins } from "@/lib/api"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { useWatchlist } from "@/hooks/use-watchlist"

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist } = useWatchlist()

  const { data: coins, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
  })

  const watchlistCoins = coins?.filter((coin) => watchlist.includes(coin.id)) || []

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Watchlist</h1>

      {watchlist.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Watchlist is Empty</CardTitle>
            <CardDescription>Add cryptocurrencies to your watchlist to track them here</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button asChild>
              <Link href="/">Browse Cryptocurrencies</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-semibold flex items-center">
                    Price <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-semibold flex items-center">
                    24h % <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-semibold flex items-center">
                    Market Cap <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-6 w-6" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[180px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                      </TableRow>
                    ))
                : watchlistCoins.map((coin, index) => (
                    <TableRow key={coin.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleWatchlist(coin.id)}
                          className="h-8 w-8"
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </Button>
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Link href={`/coins/${coin.id}`} className="flex items-center gap-2 hover:underline">
                          <div className="w-6 h-6">
                            <img
                              src={coin.image || "/placeholder.svg"}
                              alt={coin.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="font-medium">{coin.name}</span>
                          <span className="text-muted-foreground uppercase">{coin.symbol}</span>
                        </Link>
                      </TableCell>
                      <TableCell>{formatCurrency(coin.current_price)}</TableCell>
                      <TableCell className={coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </TableCell>
                      <TableCell>{formatCurrency(coin.market_cap)}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

