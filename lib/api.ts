// API functions for fetching cryptocurrency data from CoinGecko

export async function fetchCoins() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en",
  )

  if (!response.ok) {
    throw new Error("Failed to fetch coins")
  }

  return response.json()
}

export async function fetchCoinDetails(id: string) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch details for coin: ${id}`)
  }

  return response.json()
}

export async function fetchCoinMarketChart(id: string, days: number) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${days > 30 ? "daily" : "hourly"}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch market chart for coin: ${id}`)
  }

  return response.json()
}

export async function fetchGlobalData() {
  const response = await fetch("https://api.coingecko.com/api/v3/global")

  if (!response.ok) {
    throw new Error("Failed to fetch global data")
  }

  const data = await response.json()
  return data.data
}

