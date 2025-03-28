"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SparklesCore } from "@/components/sparkles"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 模拟的用户数据（实际应用中应该从API获取）
export default function ProfilePage() {
  const { checkAuth } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "/placeholder.svg?height=200&width=200",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserData({
        name: localStorage.getItem("name") || "",
        phone: localStorage.getItem("phone") || "",
        email: localStorage.getItem("email") || "",
        avatar: "/placeholder.svg?height=200&width=200",
      });
    }
  }, []);
  useEffect(() => {
    // 检查用户是否已登录
    if (!checkAuth()) {
      return
    }

    // 这里可以添加从API获取用户数据的逻辑
    // 例如：fetchUserData().then(data => setUserData(data))

    // 模拟API请求延迟
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [checkAuth, router])

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
        <div className="container mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
              用户
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> 资料</span>
            </h1>

            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-2xl">
                  <User className="mr-2 h-6 w-6 text-purple-400" />
                  个人信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-purple-700/30 h-16 w-16"></div>
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-purple-700/30 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-purple-700/30 rounded"></div>
                          <div className="h-4 bg-purple-700/30 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-24 w-24 border-2 border-purple-500/50">
                        <AvatarImage src={userData.avatar} alt={userData?.name??'?'} />
                        <AvatarFallback className="bg-purple-900 text-white text-2xl">
                          {userData?.name?.charAt(0)??"?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-semibold text-white mb-1">{userData.name}</h2>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                        <div className="flex items-center mb-3">
                          <Phone className="h-5 w-5 text-purple-400 mr-2" />
                          <span className="text-gray-400 text-sm">手机号码</span>
                        </div>
                        <p className="text-white text-lg">{userData.phone}</p>
                      </div>

                      <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                        <div className="flex items-center mb-3">
                          <Mail className="h-5 w-5 text-purple-400 mr-2" />
                          <span className="text-gray-400 text-sm">电子邮箱</span>
                        </div>
                        <p className="text-white text-lg">{userData.email}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 text-center">
                      <p>上次登录时间: 2023-09-15 15:30:45</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

