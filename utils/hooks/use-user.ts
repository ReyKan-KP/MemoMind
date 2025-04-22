import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type User = {
  id: string;
  name: string | null;
  email: string;
  created_at: string | null;
  phone: string | null;
  avatar_url: string | null;
  last_active: string | null;
};

export type UserUpdateData = {
  name?: string;
  phone?: string;
  avatar_url?: string;
};

export const useUser = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const fetchUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    
    return data;
  };

  const updateUser = async (userData: UserUpdateData): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");
    
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  };

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    updateUser: updateUserMutation.mutate,
    isPending: updateUserMutation.isPending,
  };
}; 