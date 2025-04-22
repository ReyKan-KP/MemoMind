"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
const SignUpForm: React.FC = () => {
  return (
    <div className="py-20 text-zinc-800 dark:text-zinc-200 selection:bg-zinc-300 dark:selection:bg-zinc-600">
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
        <RegisterForm />
        <TermsAndConditions />
      </motion.div>
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
        className="relative rounded-full-1 bg-transparent transform transition-transform duration-300 group-hover:scale-105"
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
    <h1 className="text-2xl font-semibold">Create an account</h1>
    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
      Already have an account?{" "}
      <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:underline">
        Sign in.
      </Link>
    </p>
  </div>
)

const SocialButtons: React.FC = () => {
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleSignUp = async () => {
    try {
      // Generate and store code verifier for PKCE
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false // Ensure this is false to allow proper redirection
        }
      })

      if (error) {
        toast.error("Failed to sign up with Google")
        console.error(error)
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <SocialButton fullWidth onClick={handleGoogleSignUp}>Sign up with Google</SocialButton>
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

const RegisterForm: React.FC = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Sign up successful! Redirecting to Dashboard")
      router.push("/dashboard")
      
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
          htmlFor="name-input"
          className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
        >
          Full Name
        </label>
        <input
          id="name-input"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
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
      <div className="mb-3">
        <label
          htmlFor="password-input"
          className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
        >
          Password
        </label>
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
      <div className="mb-6">
        <label
          htmlFor="confirm-password-input"
          className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password-input"
          type="password"
          placeholder="••••••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}

const TermsAndConditions: React.FC = () => (
  <p className="mt-9 text-xs text-zinc-500 dark:text-zinc-400">
    By signing up, you agree to our{" "}
    <Link href="/terms" className="text-blue-600 dark:text-blue-400">
      Terms & Conditions
    </Link>{" "}
    and{" "}
    <Link href="/privacy" className="text-blue-600 dark:text-blue-400">
      Privacy Policy.
    </Link>
  </p>
)

export default SignUpForm
