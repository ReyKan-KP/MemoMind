-- Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  phone TEXT,
  avatar_url TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Summaries Table  
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS (Row Level Security) for Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Add RLS (Row Level Security) for Notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes" 
  ON notes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" 
  ON notes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON notes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON notes FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS for Summaries
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view summaries of their notes" 
  ON summaries FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM notes 
    WHERE notes.id = summaries.note_id AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert summaries for their notes" 
  ON summaries FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM notes 
    WHERE notes.id = summaries.note_id AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete summaries of their notes" 
  ON summaries FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM notes 
    WHERE notes.id = summaries.note_id AND notes.user_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_summaries_note_id ON summaries(note_id); 