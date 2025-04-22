import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export const useRecentNotes = (limit = 5) => {
  const supabase = createClient();

  const fetchRecentNotes = async (): Promise<Note[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  };

  const notesQuery = useQuery({
    queryKey: ["notes", "recent", limit],
    queryFn: fetchRecentNotes,
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    isError: notesQuery.isError,
  };
}; 