"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, UserUpdateData, useUser } from "@/utils/hooks/use-user"
import { Skeleton } from "../../../../components/ui/skeleton"
import { motion } from "framer-motion"
import { UserRound, Mail, Phone, CalendarDays, Clock, Camera } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ProfileSection() {
  const { user, isLoading, updateUser, isPending } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserUpdateData>({
    name: "",
    phone: "",
    avatar_url: "",
  })

  if (isLoading) {
    return (
      <Card className="h-full border shadow-md">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[300px]" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="h-full border shadow-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>You need to be logged in to view your profile.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const startEditing = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      avatar_url: user.avatar_url || "",
    })
    setImagePreview(null)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setImagePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(formData)
    setIsEditing(false)
    setImagePreview(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
  
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  
    try {
      setIsUploading(true);
      const supabase = createClient();
  
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
  
      if (uploadError) throw uploadError;
  
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
  
      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));
      
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="h-full border shadow-md bg-gradient-to-br from-card/50 to-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Profile
        </CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage 
                    src={imagePreview || formData.avatar_url || ""} 
                    alt={formData.name || ""} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                            <Camera className="h-4 w-4" />
                          </div>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload a new profile picture</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
              <div className="space-y-2 flex-1">
                {isUploading && (
                  <p className="text-sm text-primary">Uploading image...</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>
          </motion.form>
        ) : (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={user.avatar_url || ""} alt={user.name || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -inset-1 rounded-full border border-primary/20"
                  animate={{ 
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {user.name || "No name set"}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-primary/10 p-4 bg-card/50">
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last active</p>
                  <p className="text-sm font-medium">
                    {user.last_active ? new Date(user.last_active).toLocaleString() : "Unknown"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-primary/10">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="text-sm font-medium">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={cancelEditing} disabled={isPending || isUploading}>
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleSubmit} 
                disabled={isPending || isUploading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={startEditing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Edit Profile
            </Button>
          </motion.div>
        )}
      </CardFooter>
    </Card>
  )
} 