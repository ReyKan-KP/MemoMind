# MemoMind

A modern note-taking application with AI summarization capabilities, built with Next.js and Supabase.

![MemoMind App](https://iili.io/3GMcRB2.png) <!-- Replace with your app screenshot -->

## Features

- **Dashboard**: User-friendly dashboard with recent activity and statistics
- **Note Management**: Create, edit, delete, and view notes with a modern UI
- **AI Summarization**: Generate concise summaries of your notes using Gemini AI
- **Note Enhancement**: AI-powered tools to enhance and improve your note content
- **User Authentication**: Secure user authentication with Supabase Auth and Google OAuth
- **Profile Management**: Edit profile details and upload profile pictures
- **Responsive Design**: Beautiful UI that works across all devices

## Tech Stack

- **Frontend**:
  - Next.js 15 with App Router
  - React 18 with React Hooks
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn UI components (built on Radix UI)
  - Framer Motion for animations

- **State Management**:
  - TanStack Query (React Query) for data fetching and state management

- **Backend & Infrastructure**:
  - Supabase for authentication and PostgreSQL database
  - Gemini API for AI summarization
  - Supabase Storage for file uploads and avatar images

- **UI/UX**:
  - Modern, clean interface with smooth animations
  - Dark mode support
  - Toast notifications for user feedback

## Application Structure

The application follows a clear structure with route groups for different features:

```
/app
├── (authenticated) - Protected routes for logged-in users
├── (auth) - Authentication routes
├── (features) - Feature-specific routes
│   ├── note-creator - Note management
│   └── ai-summarizer - AI summarization
├── (legal) - Legal pages
├── providers - Application providers
└── api - API endpoints
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- Supabase account
- Gemini API key
- Google Cloud project (for OAuth)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ReyKan-KP/MemoMind
   cd memomind
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials
   - Add your Gemini API key

4. Create database tables:
   - Use the SQL in `supabase/schema.sql` to create your database tables

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Setting Up Google OAuth

### 1. Create and Configure a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Configure the OAuth consent screen:
   - Set user type (External or Internal)
   - Add app name, support email, and developer contact info
   - Add scopes for `email` and `profile`
   - Save the configuration

### 2. Create OAuth Client Credentials

1. In Google Cloud Console, go to "Credentials" tab
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Add authorized JavaScript origins:
   - `https://your-supabase-project.supabase.co`
   - `http://localhost:3000` (for development)
5. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
6. Click "Create" and note the generated Client ID and Client Secret

### 3. Configure Supabase Auth Provider

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find and enable "Google"
4. Enter the OAuth Client ID and Client Secret you obtained from Google Cloud
5. Save the configuration

### 4. Implement Google Sign-In in Your App

Add a Google Sign-In button to your authentication pages:

```tsx
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Google } from 'lucide-react';

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
```

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

## Key Components

- **Dashboard**: View recent activity, statistics, and profile information
- **Note Creator**: Create, edit, and manage your notes
- **AI Summarizer**: Generate AI-powered summaries of your notes
- **Authentication**: Sign up, sign in, and protected routes
- **Profile Manager**: Edit profile details and upload avatar images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Gemini AI](https://ai.google.dev/)
