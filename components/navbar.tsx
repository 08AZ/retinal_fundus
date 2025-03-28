"use client"

import { Button } from "@/components/ui/button"
import { Menu, User, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { isAuthenticated, logout, checkAuth } = useAuth()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    if (checkAuth()) {
      router.push(path)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-3">
        {/* Simple logo container */}
        <div className="relative w-20 h-20">
          <Image src="/images/logo.png" alt="致用智联 Logo" fill className="object-contain" />
        </div>
        <span className="text-white font-medium text-xl">致用智联</span>
      </Link>

      <div className="flex items-center space-x-8 ml-8">
        <button
          onClick={() => handleNavigation("/history")}
          className="text-gray-300 hover:text-white transition-colors relative group"
        >
          Historical Diagnoses
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
        </button>
        <NavLink href="/about">About Us</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4 ml-auto">
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="text-white hover:text-purple-400"
              onClick={() => handleNavigation("/profile")}
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" className="text-white hover:text-red-400" onClick={logout}>
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="ghost" className="text-white hover:text-purple-400" onClick={() => router.push("/login")}>
            <User className="w-5 h-5 mr-2" />
            Login
          </Button>
        )}
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  )
}

