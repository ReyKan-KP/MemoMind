"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecentSummaries } from "@/utils/hooks/use-summaries"
import { Skeleton } from "../../../../components/ui/skeleton"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowRight, BrainCircuit, Calendar, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function RecentSummaries() {
  const { summaries, isLoading } = useRecentSummaries()

  return (
    <Card className="shadow-md bg-gradient-to-br from-card/50 to-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className="rounded-full p-1 bg-primary/10 flex items-center justify-center mr-2"
              animate={{ 
                rotate: [0, 10, 0, -10, 0], 
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
            >
              <BrainCircuit className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Summaries</span>
          </div>
          <motion.div whileHover={{ scale: 1.05, x: 3 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/summaries"
              className="text-sm font-medium text-primary flex items-center hover:underline"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>
        </CardTitle>
        <CardDescription>Your recent AI-generated note summaries</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : summaries.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="rounded-full p-3 bg-primary/10 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
              >
                <BrainCircuit className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
            <p className="text-lg font-medium mb-2">No AI summaries yet</p>
            <p className="text-muted-foreground text-center mb-4">Create notes and generate AI summaries to see them here</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/notes/create">
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300">
                  Create a Note
                </button>
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <motion.div 
                key={summary.id} 
                className="group rounded-xl border border-primary/10 p-3 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -2, backgroundColor: 'rgba(var(--card), 0.8)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="text-primary/30"
                  >
                    <Sparkles className="h-12 w-12" />
                  </motion.div>
                </div>
                
                {summary.note && (
                  <Link href={`/ai-summarizer`} className="hover:underline block relative">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors duration-300">
                        {summary.note.title}
                      </h3>
                    </div>
                  </Link>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 relative">
                  <span className="text-primary font-medium">"</span>
                  {summary.content}
                  <span className="text-primary font-medium">"</span>
                </p>
                
                <div className="flex justify-between mt-2 text-xs text-muted-foreground items-center">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(summary.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <motion.div 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Link href={summary.note ? `/ai-summarizer` : "#"} className="text-primary hover:underline flex items-center">
                      View Original <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 