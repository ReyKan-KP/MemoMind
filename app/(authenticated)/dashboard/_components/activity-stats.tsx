"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecentNotes } from "@/utils/hooks/use-notes"
import { useRecentSummaries } from "@/utils/hooks/use-summaries"
import { useUser } from "@/utils/hooks/use-user"
import { Skeleton } from "../../../../components/ui/skeleton"
import { FileText, BrainCircuit, Clock } from "lucide-react"
import { motion } from "framer-motion"

export function ActivityStats() {
  const { notes, isLoading: isLoadingNotes } = useRecentNotes(100)
  const { summaries, isLoading: isLoadingSummaries } = useRecentSummaries(100)
  const { user, isLoading: isLoadingUser } = useUser()

  // Calculate time since last activity
  const getLastActivityTime = () => {
    if (!user?.last_active) return "Unknown"
    
    const lastActive = new Date(user.last_active)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  const isLoading = isLoadingNotes || isLoadingSummaries || isLoadingUser

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card/50 to-card">
      <CardHeader className="pb-2">
        <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Activity Stats</CardTitle>
        <CardDescription>Your activity statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <motion.div 
            className="group relative rounded-xl p-4 border border-primary/10 bg-card hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <motion.div 
                  className="rounded-full p-3 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                  whileHover={{ rotate: 10 }}
                >
                  <FileText className="h-6 w-6 text-primary" />
                </motion.div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">Total Notes</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{notes.length}</p>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="group relative rounded-xl p-4 border border-primary/10 bg-card hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <motion.div 
                  className="rounded-full p-3 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                  whileHover={{ rotate: 10 }}
                >
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </motion.div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">Total Summaries</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{summaries.length}</p>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="group relative rounded-xl p-4 border border-primary/10 bg-card hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <motion.div 
                  className="rounded-full p-3 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <Clock className="h-6 w-6 text-primary" />
                </motion.div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">Last Active</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <p className="text-lg font-semibold">{getLastActivityTime()}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
} 