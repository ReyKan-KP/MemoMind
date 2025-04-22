import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Note } from "./use-notes";

export type Summary = {
  id: string;
  note_id: string;
  content: string;
  created_at: string;
  note?: Note;
};

export const useRecentSummaries = (limit = 5) => {
  const supabase = createClient();

  const fetchRecentSummaries = async (): Promise<Summary[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    // First get notes by the user
    const { data: userNotes } = await supabase
      .from("notes")
      .select("id")
      .eq("user_id", user.id);
    
    if (!userNotes || userNotes.length === 0) return [];
    
    const noteIds = userNotes.map(note => note.id);
    
    // Then get summaries for those notes
    const { data, error } = await supabase
      .from("summaries")
      .select(`
        *,
        note:notes(*)
      `)
      .in("note_id", noteIds)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  };

  const summariesQuery = useQuery({
    queryKey: ["summaries", "recent", limit],
    queryFn: fetchRecentSummaries,
  });

  return {
    summaries: summariesQuery.data || [],
    isLoading: summariesQuery.isLoading,
    isError: summariesQuery.isError,
  };
}; 