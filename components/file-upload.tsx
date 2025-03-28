"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Send, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { checkAuth } = useAuth()

  // 检查用户是否已登录
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      // 检查文件类型，只接受图片
      const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"))
      if (imageFiles.length !== fileArray.length) {
        toast({
          title: "文件类型错误",
          description: "请只上传图片文件",
          variant: "destructive",
        })
      }
      setFiles((prev) => [...prev, ...imageFiles])
    }
  }

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async () => {
    // 检查用户是否已登录
    if (!checkAuth()) {
      return
    }

    if (files.length === 0) {
      toast({
        title: "请选择文件",
        description: "请先选择要上传的图片文件",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    try {
      const headers: HeadersInit = {};
       const csrfToken=localStorage.getItem("csrfToken");
// 如果 csrfToken 存在，才将其添加到 headers 中
      if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
      }
      console.log(headers);
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
        headers:headers,
        credentials: "include",
      })
      if (response.ok) {
        const result = await response.json()
        localStorage.setItem("ids",JSON.stringify(result["file_ids"]))
        // 传递文件数量到处理页面
        router.push(`/processing?id=${result["task_id"]}&count=${files.length}`)
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "上传失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col items-center">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

      <div className="flex items-center justify-center gap-4">
        <Button
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          onClick={handleUpload}
          disabled={uploading}
        >
          <Upload className="mr-2 h-5 w-5" />
          选择文件
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="text-white border-purple-500 hover:bg-purple-500/20 bg-purple-500/10"
          onClick={handleSubmit}
          disabled={uploading || files.length === 0}
        >
          <Send className="mr-2 h-5 w-5" />
          提交
        </Button>
      </div>

      {files.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <div className="flex items-center mb-2">
            <Info className="mr-2 h-4 w-4 text-purple-400" />
            <span className="text-purple-400">已选择 {files.length} 个文件</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-black/30 rounded-lg">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-purple-900/20 p-2 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-800/30 rounded flex items-center justify-center mr-3">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="w-8 h-8 object-cover rounded"
                    />
                  </div>
                  <div className="truncate max-w-[200px] text-gray-400">{file.name}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && <div className="mt-4 text-purple-400">正在上传文件...</div>}
    </div>
  )
}

