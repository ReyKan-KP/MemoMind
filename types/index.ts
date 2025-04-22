export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Summary = {
  id: string;
  note_id: string;
  content: string;
  created_at: string;
}; 