"use client"

import React, { useState, useEffect } from 'react'
import { useNotes } from '@/hooks/use-notes'
import { useEnhance, EnhanceType } from '@/hooks/use-enhance'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash, Plus, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import AuthDialog from '@/components/auth-dialog'
import { createClient } from '@/utils/supabase/client'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      duration: 0.6,
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

const NoteCreator = () => {
  const { 
    useNotesQuery, 
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation 
  } = useNotes()

  const { data: notes, isLoading: isLoadingNotes } = useNotesQuery()
  const createNoteMutation = useCreateNoteMutation()
  const updateNoteMutation = useUpdateNoteMutation()
  const deleteNoteMutation = useDeleteNoteMutation()
  const { enhanceContent, isEnhancing, error: enhanceError } = useEnhance()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const getUser = async () => {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    return user
  }

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      setUser(userData)
    }
    fetchUser()
  }, [])

  const handleCreateNote = async () => {
    if (!title || !content) return

    try {
      await createNoteMutation.mutateAsync({ title, content })
      setTitle("")
      setContent("")
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.title || !editingNote.content) return

    try {
      await updateNoteMutation.mutateAsync({
        id: editingNote.id,
        title: editingNote.title,
        content: editingNote.content
      })
      setEditingNote(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const handleDeleteNote = async () => {
    if (!deleteNoteId) return

    try {
      await deleteNoteMutation.mutateAsync(deleteNoteId)
      setDeleteNoteId(null)
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setIsEditDialogOpen(true)
  }

  const handleEnhanceContent = async (enhanceType: EnhanceType, isEditMode: boolean) => {
    try {
      if (isEditMode && editingNote) {
        const enhancedContent = await enhanceContent(editingNote.content, enhanceType)
        setEditingNote(prev => prev ? { ...prev, content: enhancedContent } : null)
      } else {
        const enhancedContent = await enhanceContent(content, enhanceType)
        setContent(enhancedContent)
      }
    } catch (error) {
      console.error("Error enhancing content:", error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Notes</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <AuthDialog 
                triggerText="Create Note" 
                featureName="create notes"
              >
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300">
                  <Plus size={16} />
                  <span>Create Note</span>
                </Button>
              </AuthDialog>
            </motion.div>
          </DialogTrigger>
          {user && (
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Create a new note</DialogTitle>
              <DialogDescription>
                Enter the title and content for your new note.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 flex-grow overflow-hidden">
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-2 flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                  <label htmlFor="content">Content</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        disabled={isEnhancing || !content}
                      >
                        {isEnhancing ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            <span>Enhancing...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3 mr-1" />
                            <span>Enhance</span>
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEnhanceContent("grammar", false)}>
                        Improve Grammar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhanceContent("elaborate", false)}>
                        Make Elaborate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhanceContent("concise", false)}>
                        Make Concise
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhanceContent("professional", false)}>
                        Make Professional
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEnhanceContent("general", false)}>
                        General Enhancement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here..."
                  className="min-h-[30vh] transition-colors duration-200 resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="transition-all duration-200 hover:bg-muted"
              >
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleCreateNote}
                  disabled={createNoteMutation.isPending || !title || !content || isEnhancing}
                  className="transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {createNoteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Note
                    </>
                  )}
                </Button>
              </motion.div>
            </DialogFooter>
          </DialogContent>
          )}
        </Dialog>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoadingNotes ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </motion.div>
        ) : notes && notes.length > 0 ? (
          <motion.div 
            key="notes"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {notes.map((note, index) => (
                          <motion.tr 
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ 
                              duration: 0.3,
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 300, 
                              damping: 24
                            }}
                            className="group"
                          >
                            <TableCell className="font-medium">{note.title}</TableCell>
                            <TableCell className="max-w-md">
                              <ScrollArea className="h-[100px] transition-all duration-200 hover:border-primary/50 rounded-md">
                                <div className="whitespace-pre-wrap">{note.content}</div>
                              </ScrollArea>
                            </TableCell>
                            <TableCell>
                              {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button 
                                          size="icon" 
                                          variant="ghost" 
                                          onClick={() => openEditDialog(note)}
                                          className="opacity-70 hover:opacity-100 hover:bg-primary/10 transition-all duration-200"
                                        >
                                          <Pencil size={16} />
                                        </Button>
                                      </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit Note</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <AlertDialog
                                  open={deleteNoteId === note.id}
                                  onOpenChange={(open) => {
                                    if (!open) setDeleteNoteId(null)
                                  }}
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                          <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="text-destructive opacity-70 hover:opacity-100 hover:bg-destructive/10 transition-all duration-200"
                                            onClick={() => setDeleteNoteId(note.id)}
                                          >
                                            <Trash size={16} />
                                          </Button>
                                        </motion.div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete Note</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <AlertDialogContent
                                    className="transition-all duration-200"
                                    asChild
                                  >
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this note? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="transition-all duration-200">Cancel</AlertDialogCancel>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                          <AlertDialogAction 
                                            onClick={handleDeleteNote}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-200"
                                          >
                                            {deleteNoteMutation.isPending ? (
                                              <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Deleting...
                                              </>
                                            ) : (
                                              "Delete"
                                            )}
                                          </AlertDialogAction>
                                        </motion.div>
                                      </AlertDialogFooter>
                                    </motion.div>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-dashed hover:border-primary/50 transition-colors duration-300">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Plus size={24} className="text-primary" />
                  </div>
                </motion.div>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any notes yet. Create your first note to get started.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <AuthDialog 
                    triggerText="Create Note" 
                    featureName="create notes"
                  >
                    <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300">
                      <Plus size={16} />
                      <span>Create Note</span>
                    </Button>
                  </AuthDialog>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Edit note</DialogTitle>
              <DialogDescription>
                Make changes to your note.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 flex-grow overflow-hidden">
              <div className="grid gap-2">
                <label htmlFor="edit-title">Title</label>
                <Input
                  id="edit-title"
                  value={editingNote?.title || ""}
                  onChange={(e) => 
                    setEditingNote(prev => 
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  placeholder="Note title"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-2 flex-grow">
                <div className="flex justify-between items-center">
                  <label htmlFor="edit-content">Content</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        disabled={isEnhancing || !editingNote?.content}
                      >
                        {isEnhancing ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            <span>Enhancing...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3 mr-1" />
                            <span>Enhance</span>
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEnhanceContent("grammar", true)}>
                        Improve Grammar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhanceContent("elaborate", true)}>
                        Make Elaborate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhanceContent("concise", true)}>
                        Make Concise
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhanceContent("professional", true)}>
                        Make Professional
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEnhanceContent("general", true)}>
                        General Enhancement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea
                  id="edit-content"
                  value={editingNote?.content || ""}
                  onChange={(e) => 
                    setEditingNote(prev => 
                      prev ? { ...prev, content: e.target.value } : null
                    )
                  }
                  placeholder="Write your note here..."
                  className="h-[30vh] resize-none transition-colors duration-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingNote(null)
                  setIsEditDialogOpen(false)
                }}
                className="transition-all duration-200 hover:bg-muted"
              >
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleUpdateNote}
                  disabled={
                    updateNoteMutation.isPending || 
                    !editingNote?.title || 
                    !editingNote?.content ||
                    isEnhancing
                  }
                  className="transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {updateNoteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Update Note
                    </>
                  )}
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NoteCreator
