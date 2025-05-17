"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {useRouter} from "next/navigation"
import {SparklesCore} from "@/components/sparkles"
import Navbar from "@/components/navbar"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Lock, Mail, Phone} from "lucide-react"
import {useAuth} from "@/hooks/use-auth"

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}
const getCsrfToken = async () => {
  const response = await fetch("http://101.37.38.7:8002/csrf-token/",{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });
  console.log("CSRF Response:", response);
  const data = await response.json()
  return data.csrfToken
}
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [loginMethod, setLoginMethod] = useState("phone")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}
  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    setError("")
  }, [activeTab, loginMethod])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    //let csrfToken=await getCsrfToken()
    let csrfToken: string | null =""
    if(getCookie("csrftoken")) {
      csrfToken=getCookie("csrftoken")
      alert("GETCOOKIES")
    }
    else {
      alert("No Csrf Token,fuck!!")
      /*csrfToken = await getCsrfToken()*/
    }
    if(csrfToken) {
      localStorage.setItem("csrfToken", csrfToken)
    }
    try {
      let url = ""
      if (activeTab === "login") {
        url = "http://101.37.38.7:8002/login/"
      } else if (activeTab === "register") {
        url = "http://101.37.38.7:8002/register/"
      } else {
        url = "http://101.37.38.7:8002/reset_password/"
      }
      const headers: HeadersInit = {};
      const csrfToken = getCookie("csrftoken");
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
        headers["Accept"] = "application/json"
      }
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ ...data, way: loginMethod }),
        //credentials: "include"
      })

      if (response.ok) {
        if(activeTab === "register"|| activeTab === "reset_password") {
          window.location.href="/login"
        }
        else {
          const result = await response.json()
          localStorage.setItem("token", result.token)
          localStorage.setItem("phone", result.phone)
          localStorage.setItem("email", result.email)
          localStorage.setItem("avatar", result.avatar)
          localStorage.setItem("name", result.name)
          localStorage.setItem("user_id", result.user_id)
          if (activeTab === "login") {
          // 保存认证令牌并重定向到首页
            login(result.token ) // 使用后端返回的令牌，或者使用假令牌进行测试
            router.push("/")
          }
          else {
            setActiveTab("login")
            setError("操作成功，请登录")
          }
        }
        }
      else {
          const errorData = await response.json()
          setError(errorData.message || "操作失败，请重试")
        }
      }
      catch (error) {
        console.error("Error:", error)
        setError("发生错误，请稍后重试")
      }
    }

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
        <div className="container mx-auto px-6 py-8 flex justify-center items-center min-h-[calc(100vh-76px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.5)] animate-pulse-slow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-white">
                  <motion.span
                    key={activeTab}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === "login" ? "欢迎回来" : activeTab === "register" ? "创建账户" : "重置密码"}
                  </motion.span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/50 border border-purple-500/30">
                     <TabsTrigger
                      value="login"
                      className="text-white data-[state=active]:bg-purple-700 data-[state=active]:text-white transition-all duration-300"
                    >
                      登录
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="text-white data-[state=active]:bg-purple-700 data-[state=active]:text-white transition-all duration-300"
                    >
                      注册
                    </TabsTrigger>
                    <TabsTrigger
                      value="reset"
                      className="text-white data-[state=active]:bg-purple-700 data-[state=active]:text-white transition-all duration-300"
                    >
                      重置密码
                    </TabsTrigger>
                  </TabsList>
                  <div className="mt-4">
                    <div className="flex justify-center space-x-4 mb-6">
                      <Button
                        variant={loginMethod === "phone" ? "default" : "outline"}
                        onClick={() => setLoginMethod("phone")}
                        className="w-1/2 transition-all duration-300 ease-in-out bg-purple-700 hover:bg-purple-600 text-white rounded-full"
                      >
                        <Phone className="mr-2 h-4 w-4" /> 手机号
                      </Button>
                      <Button
                        variant={loginMethod === "email" ? "default" : "outline"}
                        onClick={() => setLoginMethod("email")}
                        className="w-1/2 transition-all duration-300 ease-in-out bg-purple-700 hover:bg-purple-600 text-white rounded-full"
                      >
                        <Mail className="mr-2 h-4 w-4" /> 邮箱
                      </Button>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.form
                        key={`${activeTab}-${loginMethod}`}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <motion.div variants={inputVariants} transition={{ duration: 0.3 }}>
                          <div className="relative">
                            {loginMethod === "phone" ? (
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                            ) : (
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                            )}
                            <Input
                              name={loginMethod}
                              placeholder={loginMethod === "phone" ? "请输入手机号" : "请输入邮箱"}
                              type={loginMethod === "phone" ? "tel" : "email"}
                              required
                              className="pl-10 bg-purple-900/20 border-purple-500/50 text-white placeholder-purple-300/50 rounded-full"
                            />
                          </div>
                        </motion.div>
                        {activeTab !== "reset" && (
                          <motion.div variants={inputVariants} transition={{ duration: 0.3, delay: 0.1 }}>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                              <Input
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                                required
                                className="pl-10 bg-purple-900/20 border-purple-500/50 text-white placeholder-purple-300/50"
                              />
                            </div>
                          </motion.div>
                        )}
                        {(activeTab === "register" || activeTab === "reset") && (
                          <motion.div variants={inputVariants} transition={{ duration: 0.3, delay: 0.2 }}>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                              <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="请确认密码"
                                required
                                className="pl-10 bg-purple-900/20 border-purple-500/50 text-white placeholder-purple-300/50"
                              />
                            </div>
                          </motion.div>
                        )}
                        {activeTab === "reset" && (
                          <motion.div variants={inputVariants} transition={{ duration: 0.3, delay: 0.3 }}>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                              <Input
                                name="oldPassword"
                                type="password"
                                placeholder="请输入原密码"
                                required
                                className="pl-10 bg-purple-900/20 border-purple-500/50 text-white placeholder-purple-300/50"
                              />
                            </div>
                          </motion.div>
                        )}
                        <motion.div variants={buttonVariants} transition={{ duration: 0.3, delay: 0.4 }}>
                          <Button
                            type="submit"
                            className="w-full !bg-purple-700 hover:!bg-purple-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 rounded-full"
                          >
                            {activeTab === "login" ? "登录" : activeTab === "register" ? "注册" : "重置密码"}
                          </Button>
                        </motion.div>
                      </motion.form>
                    </AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-red-500 text-center mt-4"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

