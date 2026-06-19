# Linguistic Analysis Workspace
 
A structured note-taking tool for comparative linguistic and stylometric analysis.
 
## What It Does
 
- Create analysis projects and attach source documents to them
- Log observations by document and linguistic feature category (Syntax, Lexicon, Register, Style, Cohesion, etc.)
- View all observations in one organized workspace — no tab-switching required
## Tech Stack
 
- **Frontend:** Next.js, generated with v0 by Vercel
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
## Database Setup
 
Run the following SQL in your Supabase SQL Editor to set up the database:
 
```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- Observations table
CREATE TABLE observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
