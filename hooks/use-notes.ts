"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { Note } from "@/types"
import { toast } from "sonner"
import { User } from '@supabase/supabase-js';
import { useState } from "react"

const supabase = createClient()

export const useNotes = () => {
  const queryClient = useQueryClient()

  // Get all notes for the current user
  const getNotes = async (): Promise<Note[]> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      toast.error("You must be logged in to view notes")
      throw userError || new Error("Not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user?.id)
      .order("updated_at", { ascending: false })

    if (error) {
      toast.error(error.message)
      throw error
    }

    return data || []
  }

  // Get a single note by ID
  const getNote = async (id: string): Promise<Note> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      toast.error("You must be logged in to view notes")
      throw userError || new Error("Not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user?.id)
      .single()

    if (error) {
      toast.error(error.message)
      throw error
    }

    return data
  }

  // Create a new note
  const createNote = async (note: Omit<Note, "id" | "user_id" | "created_at" | "updated_at">): Promise<Note> => {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      toast.error("You must be logged in to create notes")
      throw userError || new Error("Not authenticated")
    }
    
    // Add the user_id to the note
    const noteWithUserId = {
      ...note,
      user_id: user.id
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([noteWithUserId])
      .select()
      .single()

    if (error) {
      toast.error(error.message)
      throw error
    }

    toast.success("Note created")
    return data
  }

  // Update a note
  const updateNote = async ({ id, ...note }: Partial<Note> & { id: string }): Promise<Note> => {
    const { data, error } = await supabase
      .from("notes")
      .update(note)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      toast.error(error.message)
      throw error
    }

    toast.success("Note updated")
    return data
  }

  // Delete a note
  const deleteNote = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error(error.message)
      throw error
    }

    toast.success("Note deleted")
  }

  // React Query hooks
  const useNotesQuery = () => {
    return useQuery({
      queryKey: ["notes"],
      queryFn: getNotes,
    })
  }

  const useNoteQuery = (id: string) => {
    return useQuery({
      queryKey: ["notes", id],
      queryFn: () => getNote(id),
      enabled: !!id,
    })
  }

  const useCreateNoteMutation = () => {
    return useMutation({
      mutationFn: createNote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] })
      },
    })
  }

  const useUpdateNoteMutation = () => {
    return useMutation({
      mutationFn: updateNote,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["notes"] })
        queryClient.invalidateQueries({ queryKey: ["notes", data.id] })
      },
    })
  }

  const useDeleteNoteMutation = () => {
    return useMutation({
      mutationFn: deleteNote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] })
      },
    })
  }

  return {
    useNotesQuery,
    useNoteQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
  }
} 