
# Database Schema Documentation

## Overview

The learning platform uses PostgreSQL through Supabase with Row Level Security (RLS) for data isolation. The schema is designed to support a comprehensive learning management system with progress tracking, testing, and adaptive learning features.

## Schema Design Principles

### 1. Security First
- All tables implement Row Level Security (RLS)
- Users can only access their own data
- Foreign key references use UUIDs for auth.users

### 2. Audit Trail
- All tables include `created_at` timestamps
- Update operations tracked with `updated_at` timestamps
- User actions are logged for analytics

### 3. Scalability
- Efficient indexes on frequently queried columns
- Normalized data structure to reduce redundancy
- Optimized for read-heavy workloads

## Core Tables

### Authentication & Users

#### `profiles`
Extends Supabase's auth.users with application-specific data.

```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username text NOT NULL,
  email text NOT NULL,
  name text,
  learning_style text DEFAULT 'balanced',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
```

**Purpose**: Store user profile information and preferences
**Relationships**: 
- `id` → `auth.users.id` (1:1)

**RLS Policies**:
- Users can view and update their own profiles
- No public access

### Learning Progress

#### `user_progress`
Tracks completion of individual lessons.

```sql
CREATE TABLE public.user_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  module_id integer NOT NULL,
  lesson_id integer NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id, module_id, lesson_id)
);
```

**Purpose**: Record lesson completion status
**Indexes**: 
- `(user_id, module_id)` for module progress queries
- `(user_id, lesson_id)` for lesson status checks

**Business Logic**:
- `completed_at` is set when `completed` becomes true
- Unique constraint prevents duplicate progress records

#### `exercise_attempts`
Records all exercise completion attempts.

```sql
CREATE TABLE public.exercise_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  module_id integer NOT NULL,
  lesson_id integer NOT NULL,
  exercise_id integer NOT NULL,
  correct boolean NOT NULL,
  answer text,
  attempt_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
```

**Purpose**: Track exercise attempts and store answers
**Indexes**:
- `(user_id, exercise_id)` for exercise history
- `(user_id, module_id, lesson_id)` for lesson progress

**Business Logic**:
- Multiple attempts allowed per exercise
- `answer` stores user's response for review
- `correct` indicates if attempt was successful

### Testing System

#### `test_results`
Stores test completion results and scores.

```sql
CREATE TABLE public.test_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  module_id integer NOT NULL,
  test_id integer NOT NULL,
  score numeric NOT NULL,
  passed boolean NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
```

**Purpose**: Record test performance and pass/fail status
**Indexes**:
- `(user_id, test_id)` for test history
- `(user_id, module_id)` for module performance

**Business Logic**:
- `score` stored as percentage (0-100)
- `passed` determined by comparing score to test's passing threshold
- Multiple attempts allowed (retakes)

### Adaptive Learning

#### `revision_requirements`
Manages revision requirements triggered by test failures.

```sql
CREATE TABLE public.revision_requirements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  module_id integer NOT NULL,
  test_id integer NOT NULL,
  failed_score numeric NOT NULL,
  required_passing_score numeric NOT NULL,
  revision_completed boolean DEFAULT false,
  revision_completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id, module_id, test_id)
);
```

**Purpose**: Track revision requirements and completion
**Indexes**:
- `(user_id, module_id)` for module-level requirements
- `(user_id, revision_completed)` for pending requirements

**Business Logic**:
- Created automatically when tests are failed
- `revision_completed` must be true before test retakes
- Unique constraint prevents duplicate requirements

#### `revision_modules` (Legacy)
Alternate revision assignment system (currently unused).

```sql
CREATE TABLE public.revision_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  original_module_id integer NOT NULL,
  revision_module_id integer NOT NULL,
  performance_threshold numeric DEFAULT 70.0,
  is_mandatory boolean DEFAULT true,
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
```

#### `user_performance` (Legacy)
Performance analytics table (currently unused).

```sql
CREATE TABLE public.user_performance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  module_id integer NOT NULL,
  average_score numeric DEFAULT 0,
  failed_attempts integer DEFAULT 0,
  needs_revision boolean DEFAULT false,
  revision_assigned_at timestamp with time zone,
  revision_completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id, module_id)
);
```

## Database Functions

### `handle_new_user()`
Automatically creates user profiles when users sign up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;
```

**Trigger**: `on_auth_user_created` on `auth.users` INSERT
**Purpose**: Ensure every authenticated user has a profile record

### `handle_test_failure()`
Creates revision requirements when tests are failed.

```sql
CREATE OR REPLACE FUNCTION public.handle_test_failure()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT NEW.passed THEN
    INSERT INTO public.revision_requirements (
      user_id, 
      module_id, 
      test_id, 
      failed_score, 
      required_passing_score
    ) VALUES (
      NEW.user_id,
      NEW.module_id,
      NEW.test_id,
      NEW.score,
      70.0 -- Default passing score
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;
```

**Trigger**: `on_test_result_insert` on `test_results` INSERT
**Purpose**: Automatically create revision requirements for failed tests

## Row Level Security (RLS) Policies

### Standard User Data Policies
All user data tables implement these standard policies:

```sql
-- View own data
CREATE POLICY "Users can view their own {table}" 
  ON public.{table} 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create own data
CREATE POLICY "Users can create their own {table}" 
  ON public.{table} 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update own data
CREATE POLICY "Users can update their own {table}" 
  ON public.{table} 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Delete own data (where applicable)
CREATE POLICY "Users can delete their own {table}" 
  ON public.{table} 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

### System-level Policies
Some tables have additional policies for system operations:

```sql
-- Allow system to create revision requirements
CREATE POLICY "System can create revision requirements" 
  ON public.revision_requirements 
  FOR INSERT 
  WITH CHECK (true);
```

## Data Relationships

### User-Centric Design
```
auth.users (1) ←→ (1) profiles
auth.users (1) ←→ (∞) user_progress
auth.users (1) ←→ (∞) exercise_attempts
auth.users (1) ←→ (∞) test_results
auth.users (1) ←→ (∞) revision_requirements
```

### Content Relationships
Content data (modules, lessons, exercises, tests) is stored in the application layer (`src/services/mockData.ts`) and referenced by ID in database tables.

```
Module (1) ←→ (∞) Lessons
Lesson (1) ←→ (∞) Exercises
Module (1) ←→ (∞) Tests
Test (1) ←→ (∞) RevisionRequirements
```

## Query Patterns

### Progress Queries
```sql
-- Get user's completed lessons in a module
SELECT lesson_id 
FROM user_progress 
WHERE user_id = $1 AND module_id = $2 AND completed = true;

-- Get user's exercise completion rate
SELECT 
  COUNT(CASE WHEN correct THEN 1 END) as correct_count,
  COUNT(*) as total_attempts
FROM exercise_attempts 
WHERE user_id = $1 AND module_id = $2;
```

### Performance Queries
```sql
-- Get latest test results for a user
SELECT DISTINCT ON (test_id) *
FROM test_results 
WHERE user_id = $1 
ORDER BY test_id, completed_at DESC;

-- Check for pending revision requirements
SELECT * 
FROM revision_requirements 
WHERE user_id = $1 AND revision_completed = false;
```

## Indexing Strategy

### Primary Indexes
- All tables have UUID primary keys with default generation
- Unique constraints on business-critical combinations

### Performance Indexes
```sql
-- Frequently queried user data
CREATE INDEX idx_user_progress_user_module ON user_progress(user_id, module_id);
CREATE INDEX idx_exercise_attempts_user_exercise ON exercise_attempts(user_id, exercise_id);
CREATE INDEX idx_test_results_user_test ON test_results(user_id, test_id);

-- RLS policy optimization
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_exercise_attempts_user_id ON exercise_attempts(user_id);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_revision_requirements_user_id ON revision_requirements(user_id);
```

## Data Migration Considerations

### Schema Evolution
- Use Supabase migrations for schema changes
- Maintain backward compatibility when possible
- Include rollback procedures for major changes

### Data Seeding
- Content data managed in application layer
- User data created through normal application flow
- Development data created through seed scripts

## Backup and Recovery

### Supabase Automatic Backups
- Point-in-time recovery available
- Daily backups retained per Supabase plan
- Manual backups available through dashboard

### Data Export
```sql
-- Export user progress data
COPY (
  SELECT * FROM user_progress 
  WHERE created_at >= '2024-01-01'
) TO 'user_progress_export.csv' WITH CSV HEADER;
```

## Performance Monitoring

### Key Metrics
- Query execution times
- Index usage statistics
- RLS policy performance
- Connection pool utilization

### Optimization Queries
```sql
-- Find slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC;

-- Check index usage
SELECT 
  schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes;
```

## Security Considerations

### Data Encryption
- Data encrypted at rest by Supabase
- TLS encryption for data in transit
- JWT tokens for authentication

### Access Control
- RLS policies enforce data isolation
- Service role access restricted to backend operations
- API keys managed through environment variables

### Audit Trail
- All data modifications tracked with timestamps
- User actions logged through application layer
- Database functions logged through Supabase
