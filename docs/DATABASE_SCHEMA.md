
# Τεκμηρίωση Σχήματος Βάσης Δεδομένων

## Επισκόπηση

Η πλατφόρμα μάθησης χρησιμοποιεί PostgreSQL μέσω Supabase με Row Level Security (RLS) για απομόνωση δεδομένων. Το σχήμα είναι σχεδιασμένο να υποστηρίζει ένα περιεκτικό σύστημα διαχείρισης μάθησης με παρακολούθηση προόδου, testing και χαρακτηριστικά προσαρμοστικής μάθησης.

## Αρχές Σχεδιασμού Σχήματος

### 1. Ασφάλεια Πρώτα
- Όλοι οι πίνακες υλοποιούν Row Level Security (RLS)
- Οι χρήστες μπορούν να προσπελάσουν μόνο τα δικά τους δεδομένα
- Οι αναφορές foreign key χρησιμοποιούν UUIDs για auth.users

### 2. Ίχνος Ελέγχου
- Όλοι οι πίνακες συμπεριλαμβάνουν timestamps `created_at`
- Οι λειτουργίες ενημέρωσης παρακολουθούνται με timestamps `updated_at`
- Οι ενέργειες χρήστη καταγράφονται για αναλυτικά

### 3. Επεκτασιμότητα
- Αποδοτικά ευρετήρια σε συχνά ερωτούμενες στήλες
- Κανονικοποιημένη δομή δεδομένων για μείωση πλεονασμού
- Βελτιστοποιημένη για read-heavy workloads

## Βασικοί Πίνακες

### Πιστοποίηση & Χρήστες

#### `profiles`
Επεκτείνει το auth.users του Supabase με δεδομένα συγκεκριμένα της εφαρμογής.

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

**Σκοπός**: Αποθήκευση πληροφοριών προφίλ χρήστη και προτιμήσεων
**Σχέσεις**: 
- `id` → `auth.users.id` (1:1)

**Πολιτικές RLS**:
- Οι χρήστες μπορούν να δουν και να ενημερώσουν τα δικά τους προφίλ
- Καμία δημόσια πρόσβαση

### Πρόοδος Μάθησης

#### `user_progress`
Παρακολουθεί ολοκλήρωση μεμονωμένων μαθημάτων.

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

**Σκοπός**: Καταγραφή κατάστασης ολοκλήρωσης μαθημάτων
**Ευρετήρια**: 
- `(user_id, module_id)` για ερωτήματα προόδου ενότητας
- `(user_id, lesson_id)` για ελέγχους κατάστασης μαθημάτων

**Επιχειρησιακή Λογική**:
- Το `completed_at` ορίζεται όταν το `completed` γίνεται true
- Unique constraint αποτρέπει διπλότυπες εγγραφές προόδου

#### `exercise_attempts`
Καταγράφει όλες τις προσπάθειες ολοκλήρωσης ασκήσεων.

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

**Σκοπός**: Παρακολούθηση προσπαθειών ασκήσεων και αποθήκευση απαντήσεων
**Ευρετήρια**:
- `(user_id, exercise_id)` για ιστορικό ασκήσεων
- `(user_id, module_id, lesson_id)` για πρόοδο μαθημάτων

**Επιχειρησιακή Λογική**:
- Επιτρέπονται πολλαπλές προσπάθειες ανά άσκηση
- Το `answer` αποθηκεύει την απόκριση του χρήστη για αναθεώρηση
- Το `correct` δείχνει αν η προσπάθεια ήταν επιτυχής

### Σύστημα Testing

#### `test_results`
Αποθηκεύει αποτελέσματα ολοκλήρωσης τεστ και βαθμολογίες.

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

**Σκοπός**: Καταγραφή απόδοσης τεστ και κατάστασης επιτυχίας/αποτυχίας
**Ευρετήρια**:
- `(user_id, test_id)` για ιστορικό τεστ
- `(user_id, module_id)` για απόδοση ενότητας

**Επιχειρησιακή Λογική**:
- Η `score` αποθηκεύεται ως ποσοστό (0-100)
- Το `passed` καθορίζεται συγκρίνοντας τη βαθμολογία με το όριο επιτυχίας του τεστ
- Επιτρέπονται πολλαπλές προσπάθειες (επαναλήψεις)

### Προσαρμοστική Μάθηση

#### `revision_requirements`
Διαχειρίζεται απαιτήσεις επανάληψης που ενεργοποιούνται από αποτυχίες τεστ.

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

**Σκοπός**: Παρακολούθηση απαιτήσεων επανάληψης και ολοκλήρωσης
**Ευρετήρια**:
- `(user_id, module_id)` για απαιτήσεις επιπέδου ενότητας
- `(user_id, revision_completed)` για εκκρεμείς απαιτήσεις

**Επιχειρησιακή Λογική**:
- Δημιουργείται αυτόματα όταν τα τεστ αποτυγχάνουν
- Το `revision_completed` πρέπει να είναι true πριν τις επαναλήψεις τεστ
- Unique constraint αποτρέπει διπλότυπες απαιτήσεις

#### `revision_modules` (Legacy)
Εναλλακτικό σύστημα ανάθεσης επανάληψης (αυτή τη στιγμή αχρησιμοποίητο).

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
Πίνακας αναλυτικών απόδοσης (αυτή τη στιγμή αχρησιμοποίητος).

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

## Συναρτήσεις Βάσης Δεδομένων

### `handle_new_user()`
Δημιουργεί αυτόματα προφίλ χρηστών όταν οι χρήστες εγγράφονται.

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

**Trigger**: `on_auth_user_created` στο INSERT του `auth.users`
**Σκοπός**: Διασφάλιση ότι κάθε πιστοποιημένος χρήστης έχει εγγραφή προφίλ

### `handle_test_failure()`
Δημιουργεί απαιτήσεις επανάληψης όταν τα τεστ αποτυγχάνουν.

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
      70.0 -- Προεπιλεγμένη βαθμολογία επιτυχίας
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;
```

**Trigger**: `on_test_result_insert` στο INSERT του `test_results`
**Σκοπός**: Αυτόματη δημιουργία απαιτήσεων επανάληψης για αποτυχημένα τεστ

## Πολιτικές Row Level Security (RLS)

### Τυπικές Πολιτικές Δεδομένων Χρήστη
Όλοι οι πίνακες δεδομένων χρήστη υλοποιούν αυτές τις τυπικές πολιτικές:

```sql
-- Προβολή δικών δεδομένων
CREATE POLICY "Users can view their own {table}" 
  ON public.{table} 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Δημιουργία δικών δεδομένων
CREATE POLICY "Users can create their own {table}" 
  ON public.{table} 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Ενημέρωση δικών δεδομένων
CREATE POLICY "Users can update their own {table}" 
  ON public.{table} 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Διαγραφή δικών δεδομένων (όπου εφαρμόζεται)
CREATE POLICY "Users can delete their own {table}" 
  ON public.{table} 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

### Πολιτικές Επιπέδου Συστήματος
Μερικοί πίνακες έχουν πρόσθετες πολιτικές για λειτουργίες συστήματος:

```sql
-- Επιτρέπει στο σύστημα να δημιουργεί απαιτήσεις επανάληψης
CREATE POLICY "System can create revision requirements" 
  ON public.revision_requirements 
  FOR INSERT 
  WITH CHECK (true);
```

## Σχέσεις Δεδομένων

### Σχεδιασμός Κεντρικός στον Χρήστη
```
auth.users (1) ←→ (1) profiles
auth.users (1) ←→ (∞) user_progress
auth.users (1) ←→ (∞) exercise_attempts
auth.users (1) ←→ (∞) test_results
auth.users (1) ←→ (∞) revision_requirements
```

### Σχέσεις Περιεχομένου
Δεδομένα περιεχομένου (ενότητες, μαθήματα, ασκήσεις, τεστ) αποθηκεύονται στο επίπεδο εφαρμογής (`src/services/mockData.ts`) και αναφέρονται με ID στους πίνακες βάσης δεδομένων.

```
Module (1) ←→ (∞) Lessons
Lesson (1) ←→ (∞) Exercises
Module (1) ←→ (∞) Tests
Test (1) ←→ (∞) RevisionRequirements
```

## Μοτίβα Ερωτημάτων

### Ερωτήματα Προόδου
```sql
-- Λήψη ολοκληρωμένων μαθημάτων χρήστη σε ενότητα
SELECT lesson_id 
FROM user_progress 
WHERE user_id = $1 AND module_id = $2 AND completed = true;

-- Λήψη ποσοστού ολοκλήρωσης ασκήσεων χρήστη
SELECT 
  COUNT(CASE WHEN correct THEN 1 END) as correct_count,
  COUNT(*) as total_attempts
FROM exercise_attempts 
WHERE user_id = $1 AND module_id = $2;
```

### Ερωτήματα Απόδοσης
```sql
-- Λήψη τελευταίων αποτελεσμάτων τεστ για χρήστη
SELECT DISTINCT ON (test_id) *
FROM test_results 
WHERE user_id = $1 
ORDER BY test_id, completed_at DESC;

-- Έλεγχος για εκκρεμείς απαιτήσεις επανάληψης
SELECT * 
FROM revision_requirements 
WHERE user_id = $1 AND revision_completed = false;
```

## Στρατηγική Ευρετηρίων

### Κύρια Ευρετήρια
- Όλοι οι πίνακες έχουν UUID πρωτεύοντα κλειδιά με προεπιλεγμένη δημιουργία
- Unique constraints σε επιχειρησιακά κρίσιμους συνδυασμούς

### Ευρετήρια Απόδοσης
```sql
-- Συχνά ερωτούμενα δεδομένα χρήστη
CREATE INDEX idx_user_progress_user_module ON user_progress(user_id, module_id);
CREATE INDEX idx_exercise_attempts_user_exercise ON exercise_attempts(user_id, exercise_id);
CREATE INDEX idx_test_results_user_test ON test_results(user_id, test_id);

-- Βελτιστοποίηση πολιτικών RLS
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_exercise_attempts_user_id ON exercise_attempts(user_id);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_revision_requirements_user_id ON revision_requirements(user_id);
```

## Θέματα Migration Δεδομένων

### Εξέλιξη Σχήματος
- Χρήση migrations Supabase για αλλαγές σχήματος
- Διατήρηση backwards compatibility όταν είναι δυνατό
- Συμπερίληψη διαδικασιών rollback για μεγάλες αλλαγές

### Data Seeding
- Δεδομένα περιεχομένου διαχειρίζονται στο επίπεδο εφαρμογής
- Δεδομένα χρήστη δημιουργούνται μέσω κανονικής ροής εφαρμογής
- Δεδομένα ανάπτυξης δημιουργούνται μέσω seed scripts

## Backup και Recovery

### Αυτόματα Backups Supabase
- Διαθέσιμη point-in-time ανάκτηση
- Ημερήσια backups διατηρούνται ανά πλάνο Supabase
- Χειροκίνητα backups διαθέσιμα μέσω dashboard

### Εξαγωγή Δεδομένων
```sql
-- Εξαγωγή δεδομένων προόδου χρήστη
COPY (
  SELECT * FROM user_progress 
  WHERE created_at >= '2024-01-01'
) TO 'user_progress_export.csv' WITH CSV HEADER;
```

## Παρακολούθηση Απόδοσης

### Βασικές Μετρικές
- Χρόνοι εκτέλεσης ερωτημάτων
- Στατιστικά χρήσης ευρετηρίων
- Απόδοση πολιτικών RLS
- Χρήση connection pool

### Ερωτήματα Βελτιστοποίησης
```sql
-- Εύρεση αργών ερωτημάτων
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC;

-- Έλεγχος χρήσης ευρετηρίων
SELECT 
  schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes;
```

## Θέματα Ασφάλειας

### Κρυπτογράφηση Δεδομένων
- Δεδομένα κρυπτογραφημένα σε ηρεμία από Supabase
- Κρυπτογράφηση TLS για δεδομένα σε μετακίνηση
- JWT tokens για πιστοποίηση

### Έλεγχος Πρόσβασης
- Πολιτικές RLS επιβάλλουν απομόνωση δεδομένων
- Πρόσβαση service role περιορισμένη σε backend λειτουργίες
- API keys διαχειρίζονται μέσω μεταβλητών περιβάλλοντος

### Ίχνος Ελέγχου
- Όλες οι τροποποιήσεις δεδομένων παρακολουθούνται με timestamps
- Ενέργειες χρήστη καταγράφονται μέσω επιπέδου εφαρμογής
- Συναρτήσεις βάσης δεδομένων καταγράφονται μέσω Supabase
