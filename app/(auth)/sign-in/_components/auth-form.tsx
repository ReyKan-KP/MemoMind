"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

const SignInForm: React.FC = () => {
  return (
    <div className=" py-20 text-zinc-800 dark:text-zinc-200 selection:bg-zinc-300 dark:selection:bg-zinc-600">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.25, ease: "easeInOut" }}
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <Logo />
        <Header />
        <SocialButtons />
        <Divider />
        <LoginForm />
        <TermsAndConditions />
      </motion.div>
      {/* <BackgroundDecoration /> */}
      {/* <OneTapComponent /> */} 
    </div>
  )
}

const BackButton: React.FC = () => (
  <SocialButton icon={<ChevronLeft size={16} />}>Go back</SocialButton>
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 
    ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 
    transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Logo: React.FC = () => (
  <motion.div 
    className="mb-8 flex flex-col items-center justify-center"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
  >
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition duration-500"></div>
      <Image
        src="/logo.png"
        alt="MemoMind Logo"
        className="relative rounded-full-1 bg-transparent  transform transition-transform duration-300 group-hover:scale-105"
        width={90}
        height={90}
        priority
      />
    </div>
    <motion.span 
      className="mt-4 text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      MemoMind
    </motion.span>
  </motion.div>
)

const Header: React.FC = () => (
  <div className="mb-6 text-center">
    <h1 className="text-2xl font-semibold">Sign in to your account</h1>
    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
      Don't have an account?{" "}
      <Link href="/sign-up" className="text-blue-600 dark:text-blue-400 hover:underline">
        Create one.
      </Link>
    </p>
  </div>
)

const SocialButtons: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/dashboard"
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`
        }
      })

      

      if (error) {
        toast.error("Failed to sign in with Google")
        console.error(error)
      }
      // else {
      //   toast.success("Signed in with Google")
      // }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <SocialButton fullWidth onClick={handleGoogleSignIn}>Sign in with Google</SocialButton>
      </div>
    </div>
  )
}

const SocialButton: React.FC<{
  icon?: React.ReactNode
  fullWidth?: boolean
  children?: React.ReactNode
  onClick?: () => void
}> = ({ icon, fullWidth, children, onClick }) => (
  <button
    onClick={onClick}
    className={`relative z-0 flex items-center justify-center gap-2 overflow-hidden rounded-md 
    border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 
    px-4 py-2 font-semibold text-zinc-800 dark:text-zinc-200 transition-all duration-500
    before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
    before:rounded-[100%] before:bg-zinc-800 dark:before:bg-zinc-200 before:transition-transform before:duration-1000 before:content-[""]
    hover:scale-105 hover:text-zinc-100 dark:hover:text-zinc-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95
    ${fullWidth ? "col-span-2" : ""}`}
  >
    {icon}
    <span>{children}</span>
  </button>
)

const Divider: React.FC = () => (
  <div className="my-6 flex items-center gap-3">
    <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
    <span className="text-zinc-500 dark:text-zinc-400">OR</span>
    <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
  </div>
)

const LoginForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const supabase = createClient()
  
  // Get redirect URL from query parameters
  const redirectUrl = searchParams.get("redirect") || "/dashboard"
  
  // Check for error parameters
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  
  // Show error toast if there's an error in the URL
  useEffect(() => {
    if (error && errorDescription) {
      toast.error(decodeURIComponent(errorDescription))
    }
  }, [error, errorDescription])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Signed in successfully!")
      
      // Redirect to the intended destination or dashboard
      router.push(redirectUrl)
      router.refresh()
      
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label
          htmlFor="email-input"
          className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
        >
          Email
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="your.email@provider.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label
            htmlFor="password-input"
            className="block text-zinc-500 dark:text-zinc-400"
          >
            Password
          </label>
          <Link href="/reset-password" className="text-sm text-blue-600 dark:text-blue-400">
            Forgot?
          </Link>
        </div>
        <input
          id="password-input"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

const TermsAndConditions: React.FC = () => (
  <p className="mt-9 text-xs text-zinc-500 dark:text-zinc-400">
    By signing in, you agree to our{" "}
    <Link href="/terms" className="text-blue-600 dark:text-blue-400">
      Terms & Conditions
    </Link>{" "}
    and{" "}
    <Link href="/privacy" className="text-blue-600 dark:text-blue-400">
      Privacy Policy.
    </Link>
  </p>
)

// const BackgroundDecoration: React.FC = () => {
//   const { theme } = useTheme()
//   const isDarkTheme = theme === "dark"

//   return (
//     <div
//       className="absolute right-0 top-0 z-0 size-[50vw]"
//       // style={{
//       //   backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
//       // }}
//     >
//       <div
//         className="absolute inset-0"
//         // style={{
//         //   backgroundImage: isDarkTheme
//         //     ? "radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))"
//         //     : "radial-gradient(100% 100% at 100% 0%, rgba(255,255,255,0), rgba(255,255,255,1))",
//         // }}
//       />
//     </div>
//   )
// }

export default SignInForm
