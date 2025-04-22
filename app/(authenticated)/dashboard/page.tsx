"use client"

import { ProfileSection } from "./_components/profile-section"
import { RecentNotes } from "./_components/recent-notes"
import { RecentSummaries } from "./_components/recent-summaries"
import { ActivityStats } from "./_components/activity-stats"
import { useRequireAuth } from "@/utils/hooks/use-auth"
import { motion } from "framer-motion"

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const Dashboard = () => {
  const { isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium">Loading dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6 relative">
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-32 left-10 w-64 h-64 bg-blue-600/5 dark:bg-blue-400/5 rounded-full filter blur-3xl -z-10 hidden md:block" 
        animate={{ 
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div 
        className="absolute bottom-32 right-20 w-72 h-72 bg-indigo-600/5 dark:bg-indigo-400/5 rounded-full filter blur-3xl -z-10 hidden md:block" 
        animate={{ 
          x: [0, -10, 0],
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />

      <motion.h1 
        className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={fadeIn}>
          <ActivityStats />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={fadeIn}>
            <ProfileSection />
          </motion.div>
          <div className="space-y-8">
            <motion.div variants={fadeIn}>
              <RecentNotes />
            </motion.div>
            <motion.div variants={fadeIn}>
              <RecentSummaries />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
