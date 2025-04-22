# MemoMind - Documentation

## Application Overview
MemoMind is a modern note-taking application that leverages artificial intelligence to provide smart summarization features. The application allows users to create, edit, and manage their notes while offering AI-powered summaries to help users quickly extract the key points from their longer notes.

## Application Structure

### Core Components
- **Authentication System**: Secure user authentication system built with Supabase Auth
- **Notes Management**: Complete CRUD operations for user notes
- **AI Summarization**: Integration with Gemini AI for generating summaries of notes
- **Dashboard**: User dashboard displaying recent activities and statistics
- **Profile Management**: User profile editing with avatar upload using Supabase Storage

### Directory Structure
```
/app
├── api/                     # API routes
│   └── enhance-note/        # API endpoint for enhancing notes
├── (authenticated)/         # Route group for authenticated users
│   ├── dashboard/           # Dashboard page and components
│   └── layout.tsx           # Layout wrapper for authenticated routes
├── (auth)/                  # Route group for authentication
│   ├── sign-in/             # Sign-in page
│   └── sign-up/             # Sign-up page
├── auth/                    # Auth-related functionality
│   └── callback/            # Auth callback handling
├── (features)/              # Feature-specific routes
│   ├── note-creator/        # Note creation and management
│   └── ai-summarizer/       # AI summarization feature
├── (legal)/                 # Legal pages
│   ├── privacy/             # Privacy policy
│   └── terms/               # Terms of service
├── providers/               # React context providers
│   ├── query-provider.tsx   # TanStack Query provider
│   └── toaster-provider.tsx # Toast notification provider
├── page.tsx                 # Landing page
├── layout.tsx               # Root layout
└── globals.css              # Global styles
```

## Features in Detail

### Authentication
The application uses Supabase Authentication for secure user management:
- User sign-up and sign-in
- Session management
- Protected routes for authenticated users
- Auth state persistence
- OAuth with Google for social sign-in

### Notes Management
A complete note-taking system with:
- Create new notes with title and content
- View list of all notes
- Edit existing notes
- Delete notes
- Responsive UI for all operations

### AI Summarization
AI-powered summarization capabilities:
- Integration with Gemini AI
- Generate concise summaries from note content
- Save and display summaries
- Regenerate summaries as needed

### Dashboard
User dashboard showing:
- User profile information
- Activity statistics
- Recent notes
- Recent summaries
- Animated UI components

### Profile Management
User profile management features:
- View and edit profile information
- Upload and update profile avatar using Supabase Storage
- Edit personal details (name, email, phone)
- Track user activity and last active timestamp

## Technical Implementation

### Frontend
- **Framework**: Next.js with App Router
- **UI Component Library**: Shadcn UI (built on Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion

### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **API Integration**: Gemini API for AI summarization
- **File Storage**: Supabase Storage for avatar images

### Key Hooks and Utilities

#### `useNotes`
Manages all note-related operations:
- `useNotesQuery` - Fetches all notes for the current user
- `useNoteQuery` - Fetches a single note by ID
- `useCreateNoteMutation` - Creates a new note
- `useUpdateNoteMutation` - Updates an existing note
- `useDeleteNoteMutation` - Deletes a note

#### `useSummarize`
Handles AI summarization functionality:
- `useSummaryQuery` - Fetches existing summary for a note
- `useGenerateSummaryMutation` - Generates a new summary using AI
- `useCreateSummaryMutation` - Saves a summary to the database
- `useDeleteSummaryMutation` - Deletes a summary

#### `useProfile`
Manages user profile operations:
- `useProfileQuery` - Fetches user profile data
- `useUpdateProfileMutation` - Updates user profile information
- `useUploadAvatarMutation` - Uploads and updates user avatar image

#### Other Utilities
- `useRequireAuth` - Hook for protecting routes
- `createClient` - Supabase client utilities
- `uploadImage` - Helper for image upload to Supabase Storage

## Database Schema

### Notes Table
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Summaries Table
```sql
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Users Table
```sql
CREATE TABLE users (
  id UUID NOT NULL,
  name TEXT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
  phone TEXT NULL,
  avatar_url TEXT NULL,
  last_active TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id)
);
```

## Supabase Storage Configuration

The application uses Supabase Storage for handling user avatar uploads:

1. Bucket Configuration:
   - Public bucket named `avatars` for storing user profile images
   - RLS (Row Level Security) policies to ensure users can only access their own images

2. Storage Policies:
   ```sql
   -- Allow users to upload their own avatar
   CREATE POLICY "Users can upload their own avatar" 
   ON storage.objects 
   FOR INSERT 
   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow users to update/delete their own avatar
   CREATE POLICY "Users can update their own avatar" 
   ON storage.objects 
   FOR UPDATE 
   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow public read access to avatars
   CREATE POLICY "Avatars are publicly accessible" 
   ON storage.objects 
   FOR SELECT 
   USING (bucket_id = 'avatars');
   ```

## Google OAuth Configuration

### Setting Up Google OAuth Provider in Supabase

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"

2. **Configure OAuth Consent Screen**:
   - Select "External" user type (or "Internal" if only for your organization)
   - Fill in the required app information:
     - App name: "MemoMind"
     - User support email: Your email
     - Developer contact information: Your email
   - Add required scopes:
     - `email`
     - `profile`
   - Save and continue

3. **Create OAuth Client ID**:
   - Go to "Credentials" tab
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Name: "MemoMind Web Client"
   - Add authorized JavaScript origins:
     - `https://your-supabase-project.supabase.co`
     - `http://localhost:3000` (for development)
   - Add authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)
   - Click "Create"
   - Note the generated Client ID and Client Secret

4. **Configure Supabase Auth**:
   - Go to your Supabase project dashboard
   - Navigate to "Authentication" > "Providers"
   - Find and enable "Google"
   - Enter the OAuth Client ID and Client Secret from Google Cloud
   - Set the Redirect URL to match what you configured in Google Cloud
   - Save changes

### Implementing Google Sign-In in Your App

1. **Adding the Sign-In Button**:
   ```tsx
   import { createClient } from '@/utils/supabase/client';
   import { Button } from '@/components/ui/button';
   import { Google } from 'lucide-react'; // Using Lucide icon

   const GoogleSignIn = () => {
     const supabase = createClient();

     const handleGoogleSignIn = async () => {
       await supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
           redirectTo: `${window.location.origin}/auth/callback`,
         },
       });
     };

     return (
       <Button 
         variant="outline" 
         className="flex items-center gap-2 w-full" 
         onClick={handleGoogleSignIn}
       >
         <Google size={16} />
         <span>Continue with Google</span>
       </Button>
     );
   };

   export default GoogleSignIn;
   ```

2. **Handling Auth Callback**:
   
   Create a callback handler in `/app/auth/callback/page.tsx`:
   ```tsx
   import { redirect } from 'next/navigation';
   import { createClient } from '@/utils/supabase/server';

   export default async function AuthCallbackPage() {
     const supabase = createClient();
     const { searchParams } = new URL(request.url);
     const code = searchParams.get('code');

     if (code) {
       await supabase.auth.exchangeCodeForSession(code);
     }

     // Redirect to the dashboard after successful login
     return redirect('/dashboard');
   }
   ```

3. **Update the Sign-In Page**:
   Add the Google Sign-In component to your existing sign-in page.

## Development and Deployment

### Environment Variables
Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_GEMINI_API_KEY` - Gemini API key for AI summarization

### Development Setup
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server with `npm run dev`

### Deployment
The application can be deployed to Vercel for optimal Next.js performance:
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy through the Vercel dashboard

## Future Enhancements
Potential features for future development:
- Note categorization and tagging
- Additional AI features (auto-categorization, sentiment analysis)
- Collaborative note editing
- Enhanced formatting options
- Export/import functionality
