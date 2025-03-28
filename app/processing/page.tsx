"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { SparklesCore } from "@/components/sparkles"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Eye, Download, AlertCircle } from "lucide-react"
import { PieChart } from "@/components/pie-chart"
import {ArcElement, Chart, Legend, PieController, Tooltip} from "chart.js";

interface DiagnosisResult {
  originalImage: string
  processedImage: string
  probabilities: {
    [disease: string]: number
  }
  diagnosis: string
  confidence: number
}

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<DiagnosisResult[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  Chart.register(PieController, ArcElement, Tooltip, Legend)
  const searchParams = useSearchParams()
  const count = Number.parseInt(searchParams.get("count") || "1")
  const [ids, setIds] = useState<Array<number>|null>(null);
  const id=searchParams.get("id")
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const ids=localStorage.getItem("ids")
        if(ids){

          const parsedIds: number[] = JSON.parse(ids).map((id: any) =>
        typeof id === "string" ? parseInt(id, 10) : id
      );
          setIds(parsedIds);
        }
        try {
        const headers: HeadersInit = {};
        const csrfToken=localStorage.getItem("csrfToken");
// 如果 csrfToken 存在，才将其添加到 headers 中
      if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
      }
        const response = await fetch("http://localhost:8000/progress/",{
          method: "POST",
          body:JSON.stringify({
            "ids":ids,
            "task_id":id,
              }
              ),
          headers:headers,
          credentials: "include",
        })
        if (response.ok) {
          console.log(response.body)
          const data = await response.json()
          setProgress(data.progress)
          if (data.progress === 100) {
            setResults(data.results)
            setLoading(false)
            if (interval) clearInterval(interval);
          }
        }
      }catch(error) {
        console.log(error)}
      }
        catch (error) {
        console.error("Error fetching progress:", error)
        setError("获取诊断结果失败")
        setLoading(false)
      }
    }

    const interval = setInterval(fetchProgress, 1000)
    return () => clearInterval(interval)
  },[id])

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < results.length - 1 ? prev + 1 : prev))
  }

  const currentResult = results[currentPage]

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
              诊断
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> 结果</span>
            </h1>

            {loading ? (
              <Card className="bg-black/50 border-purple-500/30 rounded-lg p-6 mb-8">
                <CardHeader>
                  <CardTitle className="text-white">处理中...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">进度</span>
                      <span className="text-white text-sm">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-black/50 border-red-500/30 rounded-lg p-6 mb-8">
                <CardContent className="flex items-center justify-center py-8">
                  <AlertCircle className="text-red-500 mr-2 h-5 w-5" />
                  <p className="text-red-400">{error}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {results.length > 1 && (
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentPage === 0}
                      variant="outline"
                      className="border-purple-500/30 text-white"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      上一张
                    </Button>
                    <span className="text-white">
                      {currentPage + 1} / {results.length}
                    </span>
                    <Button
                      onClick={handleNext}
                      disabled={currentPage === results.length - 1}
                      variant="outline"
                      className="border-purple-500/30 text-white"
                    >
                      下一张
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {currentResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-black/50 border-purple-500/30 rounded-lg overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-white">图像分析</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 mb-2 text-sm">原始图像</p>
                            <div className="relative aspect-square bg-black/30 rounded-lg overflow-hidden">
                              <img
                                src={currentResult.originalImage || "/placeholder.svg"}
                                alt="原始图像"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-2 text-sm">预处理图像</p>
                            <div className="relative aspect-square bg-black/30 rounded-lg overflow-hidden">
                              <img
                                src={currentResult.processedImage || "/placeholder.svg"}
                                alt="预处理图像"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/50 border-purple-500/30 rounded-lg overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-white">诊断结果</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold text-white mb-2">{currentResult.diagnosis}</h3>
                          <div className="mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-400 text-sm">AI 置信度</span>
                              <span className="text-white text-sm">{(currentResult.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${currentResult.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="h-64">
                          <p className="text-gray-400 mb-2 text-sm">疾病概率分布</p>
                          <PieChart data={currentResult.probabilities} />
                        </div>

                        <div className="flex gap-2 mt-6">
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-white">
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </Button>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-white">
                            <Download className="mr-2 h-4 w-4" />
                            下载报告
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}

