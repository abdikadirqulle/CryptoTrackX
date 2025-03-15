"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpDown, Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCoins } from "@/lib/api"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { useWatchlist } from "@/hooks/use-watchlist"

export function CoinList() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: coins, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
  })
  const { watchlist, toggleWatchlist } = useWatchlist()

  const filteredCoins =
    coins?.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cryptocurrencies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
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
              ? Array(10)
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
              : filteredCoins.map((coin, index) => (
                  <TableRow key={coin.id}>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => toggleWatchlist(coin.id)} className="h-8 w-8">
                        <Star
                          className={`h-4 w-4 ${watchlist.includes(coin.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
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
            {!isLoading && filteredCoins.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

