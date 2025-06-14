# API Integration Documentation

## Overview

The learning platform integrates with Supabase as the primary backend service, providing authentication, database access, real-time updates, and file storage. This document details the integration patterns and usage.

## Supabase Client Configuration

### Client Setup
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znkqgcbmzwqibbouvfcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Type Safety
Supabase generates TypeScript types automatically based on the database schema:

```typescript
// src/integrations/supabase/types.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      // ... other tables
    }
  }
}
```

## Authentication Integration

### AuthContext Implementation
The `AuthContext` provides a React interface to Supabase authentication:

```typescript
// Key authentication methods
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  // Handle response...
};

const register = async (username: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, name: username }
    }
  });
  // Handle response...
};
```

### Session Management
```typescript
// Listen for auth state changes
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### Row Level Security Integration
Authentication automatically enforces RLS policies:

```typescript
// This query automatically filters by auth.uid()
const { data: progress } = await supabase
  .from('user_progress')
  .select('*')
  .eq('module_id', moduleId);
```

## Database Operations

### Progress Tracking
```typescript
// Mark lesson as complete
const markLessonComplete = async (moduleId: number, lessonId: number) => {
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,module_id,lesson_id'
    });
    
  if (error) throw error;
};
```

### Exercise Attempts
```typescript
// Record exercise attempt
const recordExerciseAttempt = async (
  moduleId: number, 
  lessonId: number, 
  exerciseId: number, 
  correct: boolean,
  answer?: string
) => {
  const { error } = await supabase
    .from('exercise_attempts')
    .insert({
      user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      exercise_id: exerciseId,
      correct,
      answer
    });
    
  if (error) throw error;
};
```

### Test Results
```typescript
// Submit test results
const submitTestResults = async (
  moduleId: number,
  testId: number,
  score: number,
  passed: boolean
) => {
  const { error } = await supabase
    .from('test_results')
    .insert({
      user_id: user.id,
      module_id: moduleId,
      test_id: testId,
      score,
      passed,
      completed_at: new Date().toISOString()
    });
    
  if (error) throw error;
  
  // Database trigger will handle revision requirement creation
};
```

## Real-time Updates

### Subscription Setup
```typescript
// Listen for progress updates
useEffect(() => {
  const channel = supabase
    .channel('progress-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        // Update local state
        updateLocalProgress(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user.id]);
```

### Real-time Revision Requirements
```typescript
// Listen for new revision requirements
const subscribeToRevisionRequirements = () => {
  return supabase
    .channel('revision-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'revision_requirements',
        filter: `user_id=eq.${user.id}`
      },
      handleRevisionUpdate
    )
    .subscribe();
};
```

## Error Handling

### Structured Error Handling
```typescript
// Centralized error handling utility
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  
  if (error.code === 'PGRST116') {
    // No rows returned
    return null;
  }
  
  if (error.code === '23505') {
    // Unique constraint violation
    throw new Error('This record already exists');
  }
  
  if (error.code === '42501') {
    // Insufficient privileges (RLS)
    throw new Error('Access denied');
  }
  
  throw new Error(error.message || 'An unexpected error occurred');
};
```

### Context-Aware Error Handling
```typescript
// In ProgressContext
const markLessonComplete = async (moduleId: number, lessonId: number) => {
  try {
    const { error } = await supabase.from('user_progress').upsert(/* ... */);
    if (error) throw error;
    
    // Update local state on success
    setProgress(/* ... */);
    toast.success("Lesson completed!");
    
  } catch (error) {
    handleSupabaseError(error, 'markLessonComplete');
    toast.error("Failed to save progress");
  }
};
```

## Performance Optimization

### Query Optimization
```typescript
// Efficient progress loading with joins
const loadUserProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      exercise_attempts!inner(exercise_id, correct)
    `)
    .eq('user_id', userId)
    .eq('completed', true);
    
  return data;
};
```

### Caching with React Query
```typescript
// Cache Supabase queries with React Query
export const useUserProgress = (moduleId: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-progress', user?.id, moduleId],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Batch Operations
```typescript
// Batch insert exercise attempts
const batchInsertAttempts = async (attempts: ExerciseAttempt[]) => {
  const { error } = await supabase
    .from('exercise_attempts')
    .insert(attempts);
    
  if (error) throw error;
};
```

## Data Transformation

### API Response Mapping
```typescript
// Transform Supabase data to application models
export const mapProgressData = (rawData: any[]): ModuleProgress => {
  return rawData.reduce((acc, item) => {
    const moduleId = item.module_id;
    
    if (!acc[moduleId]) {
      acc[moduleId] = {
        moduleId,
        completed: false,
        lessonsCompleted: [],
        exercisesCompleted: {},
        testsCompleted: {},
        startedAt: item.created_at
      };
    }
    
    acc[moduleId].lessonsCompleted.push(item.lesson_id);
    return acc;
  }, {});
};
```

### Type-Safe API Calls
```typescript
// Strongly typed API calls
export const getTestResults = async (
  userId: string, 
  moduleId: number
): Promise<TestResult[]> => {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .returns<TestResult[]>();
    
  if (error) throw error;
  return data || [];
};
```

## File Storage Integration

### Avatar Upload
```typescript
const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) throw error;
  
  // Get public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};
```

## Environment Configuration

### Development vs Production
```typescript
// Environment-specific configuration
const isDevelopment = import.meta.env.DEV;

const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': isDevelopment ? 'learning-platform-dev' : 'learning-platform'
      }
    }
  }
};
```

## Rate Limiting and Quotas

### Understanding Supabase Limits
- **Database**: Row-level security adds query overhead
- **Auth**: Rate limited by Supabase plan
- **Storage**: File size and bandwidth limits
- **Real-time**: Connection limits per plan

### Optimization Strategies
```typescript
// Debounced progress updates
const debouncedProgressUpdate = useMemo(
  () => debounce(markLessonComplete, 1000),
  [markLessonComplete]
);

// Batched operations
const flushPendingUpdates = async () => {
  if (pendingUpdates.length > 0) {
    await batchUpdateProgress(pendingUpdates);
    setPendingUpdates([]);
  }
};
```

## Testing Integration

### Mock Supabase Client
```typescript
// Test utilities
export const createMockSupabaseClient = () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null })
  })),
  auth: {
    onAuthStateChange: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn()
  }
});
```

### Integration Testing
```typescript
// Integration test example
describe('Progress Integration', () => {
  it('should mark lesson as complete', async () => {
    const mockUser = { id: 'user-123' };
    const { markLessonComplete } = renderHook(() => useProgress(), {
      wrapper: ({ children }) => (
        <AuthProvider value={{ user: mockUser }}>
          <ProgressProvider>{children}</ProgressProvider>
        </AuthProvider>
      )
    });
    
    await act(async () => {
      await markLessonComplete(1, 1);
    });
    
    // Verify database call was made
    expect(supabase.from).toHaveBeenCalledWith('user_progress');
  });
});
```

## Best Practices

### 1. Always Handle Errors
```typescript
// Good: Explicit error handling
const { data, error } = await supabase.from('table').select('*');
if (error) throw error;

// Bad: Ignoring potential errors
const { data } = await supabase.from('table').select('*');
```

### 2. Use TypeScript Types
```typescript
// Good: Type-safe operations
const insertProfile = async (profile: Database['public']['Tables']['profiles']['Insert']) => {
  return supabase.from('profiles').insert(profile);
};
```

### 3. Implement Proper Loading States
```typescript
// Good: Comprehensive state management
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const performOperation = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    await supabaseOperation();
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Use Transactions for Complex Operations
```typescript
// Good: Atomic operations
const completeModuleWithTest = async (moduleId: number, testScore: number) => {
  const { error } = await supabase.rpc('complete_module_transaction', {
    p_module_id: moduleId,
    p_test_score: testScore,
    p_user_id: user.id
  });
  
  if (error) throw error;
};
```
