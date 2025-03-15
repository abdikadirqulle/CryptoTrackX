import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (!value && value !== 0) return "N/A"

  // For very large numbers (billions+)
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }

  // For large numbers (millions)
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }

  // For values between 1000 and 1M
  if (value >= 1000) {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  // For small values (less than $1)
  if (value < 1) {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 })}`
  }

  // For normal values
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatPercentage(value: number): string {
  if (!value && value !== 0) return "N/A"

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

export function formatNumber(value: number): string {
  if (!value && value !== 0) return "N/A"

  // For very large numbers (billions+)
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }

  // For large numbers (millions)
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }

  // For normal values
  return value.toLocaleString()
}

