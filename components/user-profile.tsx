"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Calendar, Edit, Shield, LogOut, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState({
    name: "Zhang Wei",
    email: "zhang.wei@example.com",
    phone: "+86 123 4567 8901",
    dateJoined: "2024-09-15",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [formData, setFormData] = useState({ ...userData })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setUserData({ ...formData })
    setEditMode(false)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          User{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Profile</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-black/50 border-purple-500/30 md:col-span-1">
            <CardHeader className="pb-0">
              <CardTitle className="text-white text-xl">Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-6">
              <div className="relative mb-6">
                <Avatar className="w-32 h-32 border-2 border-purple-500">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-purple-900 text-white text-2xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {editMode && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-purple-600 border-none hover:bg-purple-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <h2 className="text-white text-2xl font-semibold mb-1">{userData.name}</h2>
              <p className="text-gray-400 mb-6">Patient ID: P-20240915-001</p>

              <div className="w-full space-y-4">
                <div className="flex items-center">
                  <Mail className="text-purple-400 mr-3 h-5 w-5" />
                  <span className="text-gray-300">{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-purple-400 mr-3 h-5 w-5" />
                  <span className="text-gray-300">{userData.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-purple-400 mr-3 h-5 w-5" />
                  <span className="text-gray-300">Joined {userData.dateJoined}</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Card className="bg-black/50 border-purple-500/30 md:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="bg-black/50 border border-purple-500/30 mb-6">
                  <TabsTrigger value="account" className="data-[state=active]:bg-purple-600 text-white">
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-purple-600 text-white">
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600 text-white">
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-white text-lg font-medium mb-4">Account Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={editMode ? formData.name : userData.name}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="bg-black/50 border-purple-500/30 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editMode ? formData.email : userData.email}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="bg-black/50 border-purple-500/30 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={editMode ? formData.phone : userData.phone}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="bg-black/50 border-purple-500/30 text-white"
                        />
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex justify-end mt-6">
                        <Button
                          variant="outline"
                          className="mr-2 border-purple-500/30 text-white"
                          onClick={() => {
                            setFormData({ ...userData })
                            setEditMode(false)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSave}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-white text-lg font-medium mb-4">Security Settings</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Two-Factor Authentication</Label>
                          <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Biometric Login</Label>
                          <p className="text-gray-400 text-sm">Use fingerprint or face recognition to log in</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="pt-4">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          <Shield className="mr-2 h-4 w-4" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-white text-lg font-medium mb-4">Notification Preferences</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Email Notifications</Label>
                          <p className="text-gray-400 text-sm">Receive diagnosis results via email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">SMS Notifications</Label>
                          <p className="text-gray-400 text-sm">Get text messages for important updates</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">App Notifications</Label>
                          <p className="text-gray-400 text-sm">Push notifications in the mobile app</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

