
# Τεκμηρίωση Ενσωμάτωσης API

## Επισκόπηση

Η πλατφόρμα μάθησης ενσωματώνεται με το Supabase ως κύρια υπηρεσία backend, παρέχοντας πιστοποίηση, πρόσβαση σε βάση δεδομένων, real-time ενημερώσεις και αποθήκευση αρχείων. Αυτό το έγγραφο λεπτομερεί τα μοτίβα ενσωμάτωσης και χρήσης.

## Διαμόρφωση Supabase Client

### Εγκατάσταση Client
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znkqgcbmzwqibbouvfcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Type Safety
Το Supabase δημιουργεί αυτόματα τύπους TypeScript βάσει του σχήματος βάσης δεδομένων:

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
      // ... άλλοι πίνακες
    }
  }
}
```

## Ενσωμάτωση Πιστοποίησης

### Υλοποίηση AuthContext
Το `AuthContext` παρέχει React interface στην πιστοποίηση Supabase:

```typescript
// Βασικές μέθοδοι πιστοποίησης
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  // Χειρισμός απόκρισης...
};

const register = async (username: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, name: username }
    }
  });
  // Χειρισμός απόκρισης...
};
```

### Διαχείριση Συνεδρίας
```typescript
// Ακρόαση για αλλαγές κατάστασης auth
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

### Ενσωμάτωση Row Level Security
Η πιστοποίηση επιβάλλει αυτόματα πολιτικές RLS:

```typescript
// Αυτό το ερώτημα φιλτράρει αυτόματα βάσει auth.uid()
const { data: progress } = await supabase
  .from('user_progress')
  .select('*')
  .eq('module_id', moduleId);
```

## Λειτουργίες Βάσης Δεδομένων

### Παρακολούθηση Προόδου
```typescript
// Σήμανση μαθήματος ως ολοκληρωμένου
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

### Προσπάθειες Ασκήσεων
```typescript
// Καταγραφή προσπάθειας άσκησης
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

### Αποτελέσματα Τεστ
```typescript
// Υποβολή αποτελεσμάτων τεστ
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
  
  // Ο trigger βάσης δεδομένων θα χειριστεί τη δημιουργία απαίτησης επανάληψης
};
```

## Real-time Ενημερώσεις

### Εγκατάσταση Subscription
```typescript
// Ακρόαση για ενημερώσεις προόδου
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
        // Ενημέρωση τοπικής κατάστασης
        updateLocalProgress(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user.id]);
```

### Real-time Απαιτήσεις Επανάληψης
```typescript
// Ακρόαση για νέες απαιτήσεις επανάληψης
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

## Χειρισμός Σφαλμάτων

### Δομημένος Χειρισμός Σφαλμάτων
```typescript
// Κεντρικό utility χειρισμού σφαλμάτων
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  
  if (error.code === 'PGRST116') {
    // Καμία γραμμή δεν επιστράφηκε
    return null;
  }
  
  if (error.code === '23505') {
    // Παραβίαση unique constraint
    throw new Error('Αυτή η εγγραφή υπάρχει ήδη');
  }
  
  if (error.code === '42501') {
    // Ανεπαρκή δικαιώματα (RLS)
    throw new Error('Δεν επιτρέπεται η πρόσβαση');
  }
  
  throw new Error(error.message || 'Παρουσιάστηκε απροσδόκητο σφάλμα');
};
```

### Context-Aware Χειρισμός Σφαλμάτων
```typescript
// Στο ProgressContext
const markLessonComplete = async (moduleId: number, lessonId: number) => {
  try {
    const { error } = await supabase.from('user_progress').upsert(/* ... */);
    if (error) throw error;
    
    // Ενημέρωση τοπικής κατάστασης σε επιτυχία
    setProgress(/* ... */);
    toast.success("Μάθημα ολοκληρώθηκε!");
    
  } catch (error) {
    handleSupabaseError(error, 'markLessonComplete');
    toast.error("Αποτυχία αποθήκευσης προόδου");
  }
};
```

## Βελτιστοποίηση Απόδοσης

### Βελτιστοποίηση Ερωτημάτων
```typescript
// Αποδοτική φόρτωση προόδου με joins
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

### Caching με React Query
```typescript
// Cache ερωτημάτων Supabase με React Query
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
    staleTime: 5 * 60 * 1000, // 5 λεπτά
  });
};
```

### Batch Operations
```typescript
// Batch insert προσπαθειών ασκήσεων
const batchInsertAttempts = async (attempts: ExerciseAttempt[]) => {
  const { error } = await supabase
    .from('exercise_attempts')
    .insert(attempts);
    
  if (error) throw error;
};
```

## Μετασχηματισμός Δεδομένων

### Mapping Αποκρίσεων API
```typescript
// Μετασχηματισμός δεδομένων Supabase σε μοντέλα εφαρμογής
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

### Type-Safe Κλήσεις API
```typescript
// Έντονα τυποποιημένες κλήσεις API
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

## Ενσωμάτωση Αποθήκευσης Αρχείων

### Upload Avatar
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
  
  // Λήψη public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};
```

## Διαμόρφωση Περιβάλλοντος

### Development vs Production
```typescript
// Διαμόρφωση συγκεκριμένη περιβάλλοντος
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

## Rate Limiting και Quotas

### Κατανόηση Ορίων Supabase
- **Βάση Δεδομένων**: Το row-level security προσθέτει overhead ερωτημάτων
- **Auth**: Rate limited από πλάνο Supabase
- **Storage**: Όρια μεγέθους αρχείου και εύρους ζώνης
- **Real-time**: Όρια συνδέσεων ανά πλάνο

### Στρατηγικές Βελτιστοποίησης
```typescript
// Debounced ενημερώσεις προόδου
const debouncedProgressUpdate = useMemo(
  () => debounce(markLessonComplete, 1000),
  [markLessonComplete]
);

// Batched λειτουργίες
const flushPendingUpdates = async () => {
  if (pendingUpdates.length > 0) {
    await batchUpdateProgress(pendingUpdates);
    setPendingUpdates([]);
  }
};
```

## Testing Ενσωμάτωσης

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
// Παράδειγμα integration test
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
    
    // Επιβεβαίωση ότι έγινε κλήση βάσης δεδομένων
    expect(supabase.from).toHaveBeenCalledWith('user_progress');
  });
});
```

## Βέλτιστες Πρακτικές

### 1. Πάντα να Χειρίζεστε Σφάλματα
```typescript
// Καλό: Ρητός χειρισμός σφαλμάτων
const { data, error } = await supabase.from('table').select('*');
if (error) throw error;

// Κακό: Αγνόηση πιθανών σφαλμάτων
const { data } = await supabase.from('table').select('*');
```

### 2. Χρήση TypeScript Types
```typescript
// Καλό: Type-safe λειτουργίες
const insertProfile = async (profile: Database['public']['Tables']['profiles']['Insert']) => {
  return supabase.from('profiles').insert(profile);
};
```

### 3. Υλοποίηση Κατάλληλων Loading States
```typescript
// Καλό: Περιεκτική διαχείριση κατάστασης
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

### 4. Χρήση Transactions για Πολύπλοκες Λειτουργίες
```typescript
// Καλό: Ατομικές λειτουργίες
const completeModuleWithTest = async (moduleId: number, testScore: number) => {
  const { error } = await supabase.rpc('complete_module_transaction', {
    p_module_id: moduleId,
    p_test_score: testScore,
    p_user_id: user.id
  });
  
  if (error) throw error;
};
```
