"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Home, User, UserPlus, PenTool, Zap, LogIn, LogOut, ChevronDown, Settings } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function Navbar() {
  const [navItems, setNavItems] = useState<NavItem[]>([
    { name: 'Home', url: '/', icon: Home },
    { name: 'Note Creator', url: '/note-creator', icon: PenTool },
    { name: 'AI Summarizer', url: '/ai-summarizer', icon: Zap },
    { name: 'Sign In', url: '/sign-in', icon: LogIn },
    { name: 'Sign Up', url: '/sign-up', icon: UserPlus },
  ])
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  
  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      setLoading(false)
      
      if (user) {
        setUser(user)
        // Replace Sign In and Sign Up with Profile when logged in
        setNavItems([
          { name: 'Home', url: '/', icon: Home },
          { name: 'Note Creator', url: '/note-creator', icon: PenTool },
          { name: 'AI Summarizer', url: '/ai-summarizer', icon: Zap },
        ])
      }
    }
    
    getUser()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        setNavItems([
          { name: 'Home', url: '/', icon: Home },
          { name: 'Note Creator', url: '/note-creator', icon: PenTool },
          { name: 'AI Summarizer', url: '/ai-summarizer', icon: Zap },
        ])
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setNavItems([
          { name: 'Home', url: '/', icon: Home },
          { name: 'Note Creator', url: '/note-creator', icon: PenTool },
          { name: 'AI Summarizer', url: '/ai-summarizer', icon: Zap },
          { name: 'Sign In', url: '/sign-in', icon: LogIn },
          { name: 'Sign Up', url: '/sign-up', icon: UserPlus },
        ])
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Error signing out")
      console.error(error)
    } else {
      toast.success("Signed out successfully")
      router.push("/")
      router.refresh()
    }
  }

  return (
    <NavBarComponent 
      items={navItems} 
      user={user} 
      onSignOut={handleSignOut} 
      loading={loading} 
    />
  )
}

function NavBarComponent({ 
  items, 
  className, 
  user, 
  onSignOut, 
  loading 
}: NavBarProps & { 
  user: any; 
  onSignOut: () => void; 
  loading: boolean; 
}) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const supabase = createClient()

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAvatar() {
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single()
      
      if (data && !error) {
        setAvatarUrl(data.avatar_url)
      }
    }
    
    if (user?.id) {
      fetchAvatar()
    }
  }, [user, supabase])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav
      className={cn(
        "fixed z-30 w-full transition-all duration-300",
        isMobile ? "bottom-0 left-0 pb-4" : "top-0 left-0 pt-4 px-4",
        className,
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-screen-xl">
        <div 
          className={cn(
            "flex items-center justify-between bg-background/80 border border-border backdrop-blur-xl rounded-full shadow-lg",
            "px-4 py-2 transition-all duration-300 hover:shadow-xl",
            isMobile ? "max-w-md mx-auto" : ""
          )}
        >
          {!isMobile && (
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              {/* <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Notes AI
              </span> */}
              <Image src="/logo.png" alt="Logo" width={50} height={50} />
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MemoMind</span>
            </Link>
          )}

          <div className="flex items-center gap-1 md:gap-2 flex-1 md:flex-none md:ml-6 justify-center">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.url

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  className={cn(
                    "relative group flex items-center justify-center md:justify-start gap-2",
                    "px-3 py-2 md:px-4 rounded-full transition-all duration-200",
                    "text-foreground/70 hover:text-primary",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-background/80",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon 
                    size={isMobile ? 20 : 18} 
                    className={cn(
                      "transition-all duration-200",
                      isActive ? "stroke-primary" : "stroke-foreground/70 group-hover:stroke-primary"
                    )} 
                  />
                  <span className={cn(
                    "hidden md:inline whitespace-nowrap text-sm",
                    isActive && "font-medium"
                  )}>
                    {item.name}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-primary/5 rounded-full -z-10 border border-primary/20"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-2 p-1 rounded-full group overflow-hidden transition-all hover:bg-muted">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                      {user.user_metadata?.avatar_url ? (
                        <Image 
                          src={avatarUrl || user.user_metadata.avatar_url } 
                          alt="Profile" 
                          width={32} 
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-teal-500/30 to-teal-500 text-white text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <ChevronDown size={16} className="text-foreground/60 hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-1">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b">
                    {user.email}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center gap-2">
                      <User size={16} />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={onSignOut}
                    className="text-red-500 focus:text-red-500 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            
            <div className="h-9 w-9 p-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
