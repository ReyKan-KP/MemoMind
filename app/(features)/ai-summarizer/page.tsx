"use client"

import React, { useState } from 'react'
import { useNotes } from '@/hooks/use-notes'
import { useSummarize } from '@/hooks/use-summarize'
import { Note } from '@/types'
import { format } from 'date-fns'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, ExternalLink, FileText } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import AuthDialog from '@/components/auth-dialog'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      duration: 0.5,
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

const skeletonVariants = {
  initial: {
    opacity: 0.5,
  },
  pulse: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const AI_Summarizer = () => {
  const { useNotesQuery } = useNotes()
  const { 
    useSummaryQuery, 
    useGenerateSummaryMutation, 
    useCreateSummaryMutation 
  } = useSummarize()

  const { data: notes, isLoading: isLoadingNotes } = useNotesQuery()
  const [selectedNoteId, setSelectedNoteId] = useState<string>("")
  const { data: existingSummary, isLoading: isLoadingSummary } = useSummaryQuery(selectedNoteId)

  const generateSummaryMutation = useGenerateSummaryMutation()
  const createSummaryMutation = useCreateSummaryMutation()

  const selectedNote = notes?.find(note => note.id === selectedNoteId)

  const handleGenerateSummary = async () => {
    if (!selectedNote) return

    try {
      // Generate the summary with DeepSeek
      const summary = await generateSummaryMutation.mutateAsync(selectedNote.content)
      
      // Save the summary to the database
      await createSummaryMutation.mutateAsync({
        noteId: selectedNoteId,
        content: summary
      })
    } catch (error) {
      console.error("Error generating summary:", error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <motion.h1 
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI Summarizer
      </motion.h1>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="mb-6 hover:shadow-md transition-all duration-300 border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Summarize Your Notes
              </CardTitle>
              <CardDescription>
                Select a note to summarize using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <label htmlFor="note-select">Select a note</label>
                  <Select 
                    value={selectedNoteId} 
                    onValueChange={setSelectedNoteId}
                    disabled={isLoadingNotes || !notes?.length}
                  >
                    <SelectTrigger className="transition-all duration-200 hover:border-primary/60 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select a note to summarize" />
                    </SelectTrigger>
                    <SelectContent>
                      <AnimatePresence>
                        {notes?.map(note => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <SelectItem value={note.id} className="cursor-pointer transition-colors duration-200 hover:bg-primary/10">
                              {note.title}
                            </SelectItem>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </SelectContent>
                  </Select>
                  {isLoadingNotes && (
                    <motion.div 
                      className="flex items-center gap-2 text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading notes...</span>
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {!isLoadingNotes && (!notes || notes.length === 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="mt-2 border-primary/20 bg-primary/5">
                          <AlertTitle className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            No notes found
                          </AlertTitle>
                          <AlertDescription>
                            Create some notes in the Note Creator before using the summarizer.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {selectedNote && (
                    <motion.div 
                      className="grid gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Note Content</h3>
                        <Badge variant="outline" className="bg-primary/5 transition-all duration-200 hover:bg-primary/10">
                          Updated {format(new Date(selectedNote.updated_at), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                      <div className="rounded-md border p-4 bg-muted/50 hover:border-primary/40 transition-all duration-200">
                        <ScrollArea className="h-[200px]">
                          <p className="whitespace-pre-wrap">{selectedNote.content}</p>
                        </ScrollArea>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {selectedNote && (
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <AuthDialog 
                          triggerText={
                            (generateSummaryMutation.isPending || createSummaryMutation.isPending) ?
                            "Generating..." : 
                            existingSummary ? "Regenerate Summary" : "Generate Summary"
                          }
                          featureName="the AI Summarizer"
                        >
                          <Button 
                            onClick={handleGenerateSummary}
                            disabled={
                              !selectedNoteId || 
                              generateSummaryMutation.isPending || 
                              createSummaryMutation.isPending
                            }
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300"
                          >
                            {(generateSummaryMutation.isPending || createSummaryMutation.isPending) ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                <span>
                                  {existingSummary ? "Regenerate Summary" : "Generate Summary"}
                                </span>
                              </>
                            )}
                          </Button>
                        </AuthDialog>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {selectedNoteId && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="text-primary"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      AI Summary
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Generated summary for your note
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isLoadingSummary ? (
                      <motion.div 
                        className="space-y-2"
                        initial="initial"
                        animate="pulse"
                        variants={skeletonVariants}
                      >
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </motion.div>
                    ) : existingSummary ? (
                      <motion.div 
                        className="rounded-md border p-4 bg-primary/5 hover:border-primary/40 transition-all duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      >
                        <ScrollArea className="h-[200px]">
                          <p className="whitespace-pre-wrap">{existingSummary.content}</p>
                        </ScrollArea>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="border-primary/20 bg-primary/5">
                          <AlertTitle className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            No summary yet
                          </AlertTitle>
                          <AlertDescription>
                            Click the "Generate Summary" button to create an AI-powered summary.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <Separator />
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="about" className="border-none">
                      <AccordionTrigger className="hover:bg-primary/5 py-2 px-3 rounded-md transition-all duration-200">
                        About AI Summarization
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground transition-all duration-200">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="mb-4">
                            This feature uses Google's Gemini AI to analyze your notes and generate concise summaries.
                            The AI identifies key points and main ideas to create a shorter version of your content.
                          </p>
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default AI_Summarizer
