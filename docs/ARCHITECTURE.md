
# Learning Platform Architecture Documentation

## Overview

This learning platform is a modern web application built with React, TypeScript, and Supabase. It provides an interactive learning environment for Python programming with features like lessons, exercises, tests, and adaptive revision courses.

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Shadcn/ui** - High-quality component library built on Radix UI
- **React Router DOM** - Client-side routing
- **TanStack React Query** - Server state management and caching

### Backend & Database
- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication and user management
  - Real-time subscriptions
  - Edge Functions for serverless computing
  - File storage

### State Management
- **React Context API** - Global state management for:
  - Authentication state (`AuthContext`)
  - Learning progress (`ProgressContext`)
- **React Query** - Server state caching and synchronization

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Database      │
│   (React SPA)   │◄──►│   (Backend)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ Router  │             │ Auth    │             │ Tables  │
    │ Guards  │             │ API     │             │ & RLS   │
    └─────────┘             └─────────┘             └─────────┘
```

## Core Features

### 1. Authentication System
- User registration and login
- Profile management with learning preferences
- Row Level Security for data isolation
- Automatic profile creation on signup

### 2. Learning Management
- **Modules**: Organized learning units (e.g., "Python Basics")
- **Lessons**: Individual learning sessions with content blocks
- **Exercises**: Interactive coding and multiple-choice questions
- **Tests**: Assessment tools with passing requirements

### 3. Progress Tracking
- Lesson completion tracking
- Exercise attempt recording
- Test results with pass/fail status
- Module completion calculation

### 4. Adaptive Learning
- **Revision Requirements**: Triggered when tests are failed
- **Revision Courses**: Structured content to improve understanding
- **Prerequisite System**: Prevents progression without completing requirements

## Database Schema

### Core Tables

#### `profiles`
User profile information extending Supabase auth.users
```sql
- id (uuid, PK, FK to auth.users)
- username (text)
- email (text)
- name (text)
- learning_style (text)
- created_at (timestamp)
```

#### `user_progress`
Tracks lesson completion
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- module_id (integer)
- lesson_id (integer)
- completed (boolean)
- completed_at (timestamp)
```

#### `exercise_attempts`
Records exercise completion attempts
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- module_id (integer)
- lesson_id (integer)
- exercise_id (integer)
- correct (boolean)
- answer (text)
- attempt_at (timestamp)
```

#### `test_results`
Stores test performance data
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- module_id (integer)
- test_id (integer)
- score (numeric)
- passed (boolean)
- completed_at (timestamp)
```

#### `revision_requirements`
Manages adaptive learning requirements
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- module_id (integer)
- test_id (integer)
- failed_score (numeric)
- required_passing_score (numeric)
- revision_completed (boolean)
- revision_completed_at (timestamp)
```

### Database Functions & Triggers

#### `handle_new_user()`
Automatically creates user profiles when users sign up
- Triggered on `auth.users` INSERT
- Extracts metadata from signup process

#### `handle_test_failure()`
Creates revision requirements when tests are failed
- Triggered on `test_results` INSERT
- Checks if score is below passing threshold

## Security Model

### Row Level Security (RLS)
All tables implement RLS policies ensuring users can only access their own data:

```sql
-- Example policy
CREATE POLICY "Users can view their own progress" 
  ON user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

### Authentication Flow
1. User registers/logs in through Supabase Auth
2. Frontend receives session token
3. All API calls include authentication headers
4. RLS policies enforce data isolation

## Data Flow

### Learning Progress Flow
```
User Action → Frontend Component → Context Update → Supabase API → Database → RLS Check → Response
```

### Test Completion Flow
```
Test Submission → Score Calculation → test_results INSERT → Trigger Evaluation → 
Revision Requirement Creation (if failed) → Progress Context Update → UI Update
```

## Performance Considerations

### Caching Strategy
- React Query caches server state
- Context provides optimistic updates
- Database queries optimized with indexes

### Real-time Updates
- Supabase real-time subscriptions for live progress updates
- Efficient re-rendering with React.memo and useMemo

### Bundle Optimization
- Code splitting with React.lazy
- Tree shaking with Vite
- Component library optimization with Shadcn/ui

## Scalability Features

### Horizontal Scaling
- Stateless frontend deployable to CDN
- Supabase handles backend scaling automatically
- Database connection pooling through Supabase

### Vertical Scaling
- PostgreSQL optimizations through indexes
- Efficient queries with proper JOINs
- RLS policies prevent data leakage

## Development Patterns

### Component Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── exercises/    # Exercise-specific components
│   ├── revision/     # Revision system components
│   └── layout/       # Layout components
├── contexts/         # React Context providers
├── pages/           # Route components
├── services/        # Data access layer
└── hooks/           # Custom React hooks
```

### Type Safety
- Comprehensive TypeScript types
- Supabase auto-generated types
- Strict type checking enabled

### Error Handling
- Global error boundaries
- Toast notifications for user feedback
- Comprehensive error logging

## Deployment Architecture

### Production Setup
```
Internet → CDN (Vercel/Netlify) → React SPA → Supabase API → PostgreSQL
```

### Environment Configuration
- Environment variables for API keys
- Separate dev/staging/production databases
- CI/CD pipeline integration

## Monitoring & Analytics

### Built-in Monitoring
- Supabase dashboard for database metrics
- Authentication analytics
- Performance monitoring through browser dev tools

### Custom Analytics
- User progress tracking
- Learning effectiveness metrics
- Test performance analytics

## Security Best Practices

### Frontend Security
- No sensitive data in client-side code
- Secure authentication token handling
- XSS protection through React's built-in escaping

### Backend Security
- RLS policies for data isolation
- Prepared statements prevent SQL injection
- Rate limiting through Supabase

### Infrastructure Security
- HTTPS everywhere
- Secure environment variable management
- Regular security updates through dependencies
