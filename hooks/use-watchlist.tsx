"use client"

import { useState, useEffect } from "react"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([])

  useEffect(() => {
    // Load watchlist from localStorage on component mount
    const savedWatchlist = localStorage.getItem("watchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
  }, [])

  useEffect(() => {
    // Save watchlist to localStorage when it changes
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  const toggleWatchlist = (coinId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(coinId)) {
        return prev.filter((id) => id !== coinId)
      } else {
        return [...prev, coinId]
      }
    })
  }

  return { watchlist, toggleWatchlist }
}

