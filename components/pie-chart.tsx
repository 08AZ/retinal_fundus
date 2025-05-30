"use client"

import {useEffect, useRef} from "react"
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js"


// 确保只在客户端注册Chart.js组件
if (typeof window !== "undefined") {
    ChartJS.register(ArcElement, Tooltip, Legend)
}

interface PieChartProps {
  data1: string | { [key: string]: number };
}

export function PieChart({ data1 }: PieChartProps) {
  console.log(data1)

  console.log(typeof data1)
  let validJsonString="";
  if (typeof data1 === 'string') {
     validJsonString = data1.replace(/'/g, '"');
  }
  console.log("validJsonString", validJsonString)
  const data = JSON.parse(typeof data1 === "string" ? validJsonString : JSON.stringify(data1))
    const chartRef = useRef<HTMLCanvasElement>(null)
    const chartInstance = useRef<ChartJS | null>(null)

    useEffect(() => {
      if (!chartRef.current || typeof window === "undefined") return

      // 销毁之前的图表实例
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (!ctx) return

      // 准备数据
      const labels = Object.keys(data)
      const values = Object.values(data).map(v => Number(v)); // ✅ 强制转换成 number[]
      console.log("data1:", typeof (data1));
      console.log(labels)
      console.log(values)
      if (Array.isArray(data1)) {
        console.error("data1 是一个数组，不是对象！");
      }

      //console.log(labels, values)
      // 生成颜色
      const generateColors = (count: number) => {
        const colors = []
        const hueStep = 360 / count

        for (let i = 0; i < count; i++) {
          const hue = (i * hueStep) % 360
          colors.push(`hsla(${hue}, 70%, 60%, 0.8)`)
        }

        return colors
      }

      const backgroundColor = generateColors(labels.length)
      const borderColor = backgroundColor.map((color) => color.replace("0.8", "1"))

      const chartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor,
            borderColor,
            borderWidth: 1,
          },
        ],
      }

      const config = {
        type: "pie" as const,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                color: "rgba(255, 255, 255, 0.7)",
                font: {
                  size: 12,
                },
                padding: 10,
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label || ""
                  const value = context.raw as number
                  const percentage = (value * 100).toFixed(1)
                  return `${label}: ${percentage}%`
                },
              },
            },
          },
        },
      }

      // 创建图表

      chartInstance.current = new ChartJS(ctx, config)

      // 清理函数
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }
      }
    }, [data])

    return <canvas ref={chartRef}/>
  }

