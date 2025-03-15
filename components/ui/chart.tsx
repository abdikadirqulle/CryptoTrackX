"use client"

import * as React from "react"

const ChartContext = React.createContext<{
  isTooltipActive: boolean
  setIsTooltipActive: React.Dispatch<React.SetStateAction<boolean>>
  tooltipX: number
  setTooltipX: React.Dispatch<React.SetStateAction<number>>
} | null>(null)

const useChartContext = () => {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChartContext must be used within a ChartContainer")
  }
  return context
}

interface ChartContainerProps {
  children: React.ReactNode
}

const ChartContainer = ({ children }: ChartContainerProps) => {
  const [isTooltipActive, setIsTooltipActive] = React.useState(false)
  const [tooltipX, setTooltipX] = React.useState(0)

  return (
    <ChartContext.Provider value={{ isTooltipActive, setIsTooltipActive, tooltipX, setTooltipX }}>
      <div className="relative">{children}</div>
    </ChartContext.Provider>
  )
}

interface ChartProps {
  children: React.ReactNode
}

const Chart = ({ children }: ChartProps) => {
  return <svg className="w-full h-full">{children}</svg>
}

interface ChartLineProps {
  data: { x: Date; y: number }[]
  stroke: string
  strokeWidth: number
}

const ChartLine = ({ data, stroke, strokeWidth }: ChartLineProps) => {
  const pathData = data.map((point) => `${point.x},${point.y}`).join(" L ")
  return <path d={`M ${pathData}`} stroke={stroke} strokeWidth={strokeWidth} fill="none" />
}

interface ChartAreaProps {
  data: { x: Date; y: number }[]
  fill: string
  stroke: string
  strokeWidth: number
}

const ChartArea = ({ data, fill, stroke, strokeWidth }: ChartAreaProps) => {
  if (!data || data.length < 2) return null

  const pathData = data.map((point) => `${point.x},${point.y}`).join(" L ")
  const firstPoint = data[0]
  const lastPoint = data[data.length - 1]

  return (
    <path
      d={`M ${pathData} L ${lastPoint.x},0 L ${firstPoint.x},0 Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

const ChartTooltip = ({ children }) => {
  const { isTooltipActive } = useChartContext()

  return isTooltipActive ? <>{children}</> : null
}

const ChartTooltipContent = ({ children }) => {
  return <div className="absolute z-10 rounded-md border bg-popover p-4 shadow-md">{children}</div>
}

const ChartLinearScale = () => {
  return null
}

const ChartTimeScale = () => {
  return null
}

export {
  ChartLine,
  ChartArea,
  ChartLinearScale,
  ChartTimeScale,
  ChartContainer,
  Chart,
  ChartTooltip,
  ChartTooltipContent,
}

