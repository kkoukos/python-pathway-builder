
# Τεκμηρίωση Αρχιτεκτονικής Πλατφόρμας Μάθησης

## Επισκόπηση

Αυτή η πλατφόρμα μάθησης είναι μια σύγχρονη εφαρμογή ιστού χτισμένη με React, TypeScript και Supabase. Παρέχει ένα διαδραστικό εκπαιδευτικό περιβάλλον για προγραμματισμό Python με χαρακτηριστικά όπως μαθήματα, ασκήσεις, τεστ και προσαρμοστικά μαθήματα επανάληψης.

## Στοίβα Τεχνολογίας

### Frontend
- **React 18** - Σύγχρονη βιβλιοθήκη UI με hooks και συναρτησιακά components
- **TypeScript** - Type-safe JavaScript για καλύτερη εμπειρία ανάπτυξης
- **Vite** - Γρήγορο εργαλείο χτισίματος και διακομιστής ανάπτυξης
- **Tailwind CSS** - Utility-first CSS framework για styling
- **Shadcn/ui** - Υψηλής ποιότητας βιβλιοθήκη components χτισμένη σε Radix UI
- **React Router DOM** - Client-side routing
- **TanStack React Query** - Διαχείριση κατάστασης διακομιστή και caching

### Backend & Βάση Δεδομένων
- **Supabase** - Backend-as-a-Service που παρέχει:
  - PostgreSQL βάση δεδομένων με Row Level Security (RLS)
  - Πιστοποίηση και διαχείριση χρηστών
  - Real-time subscriptions
  - Edge Functions για serverless computing
  - Αποθήκευση αρχείων

### Διαχείριση Κατάστασης
- **React Context API** - Καθολική διαχείριση κατάστασης για:
  - Κατάσταση πιστοποίησης (`AuthContext`)
  - Πρόοδος μάθησης (`ProgressContext`)
- **React Query** - Caching και συγχρονισμός κατάστασης διακομιστή

## Αρχιτεκτονική Συστήματος

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

## Βασικά Χαρακτηριστικά

### 1. Σύστημα Πιστοποίησης
- Εγγραφή και σύνδεση χρηστών
- Διαχείριση προφίλ με προτιμήσεις μάθησης
- Row Level Security για απομόνωση δεδομένων
- Αυτόματη δημιουργία προφίλ κατά την εγγραφή

### 2. Διαχείριση Μάθησης
- **Ενότητες**: Οργανωμένες μαθησιακές μονάδες (π.χ., "Python Basics")
- **Μαθήματα**: Ατομικές μαθησιακές συνεδρίες με μπλοκ περιεχομένου
- **Ασκήσεις**: Διαδραστικές ερωτήσεις κώδικα και πολλαπλής επιλογής
- **Τεστ**: Εργαλεία αξιολόγησης με απαιτήσεις επιτυχίας

### 3. Παρακολούθηση Προόδου
- Παρακολούθηση ολοκλήρωσης μαθημάτων
- Καταγραφή προσπαθειών ασκήσεων
- Αποτελέσματα τεστ με κατάσταση επιτυχίας/αποτυχίας
- Υπολογισμός ολοκλήρωσης ενότητας

### 4. Προσαρμοστική Μάθηση
- **Απαιτήσεις Επανάληψης**: Ενεργοποιούνται όταν τα τεστ αποτυγχάνουν
- **Μαθήματα Επανάληψης**: Δομημένο περιεχόμενο για βελτίωση κατανόησης
- **Σύστημα Προαπαιτούμενων**: Αποτρέπει την πρόοδο χωρίς ολοκλήρωση απαιτήσεων

## Σχήμα Βάσης Δεδομένων

### Βασικοί Πίνακες

#### `profiles`
Πληροφορίες προφίλ χρήστη που επεκτείνουν το Supabase auth.users
```sql
- id (uuid, PK, FK to auth.users)
- username (text)
- email (text)
- name (text)
- learning_style (text)
- created_at (timestamp)
```

#### `user_progress`
Παρακολουθεί ολοκλήρωση μαθημάτων
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- module_id (integer)
- lesson_id (integer)
- completed (boolean)
- completed_at (timestamp)
```

#### `exercise_attempts`
Καταγράφει προσπάθειες ολοκλήρωσης ασκήσεων
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
Αποθηκεύει δεδομένα απόδοσης τεστ
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
Διαχειρίζεται απαιτήσεις προσαρμοστικής μάθησης
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

### Συναρτήσεις & Triggers Βάσης Δεδομένων

#### `handle_new_user()`
Δημιουργεί αυτόματα προφίλ χρηστών όταν οι χρήστες εγγράφονται
- Ενεργοποιείται στο INSERT του `auth.users`
- Εξάγει metadata από τη διαδικασία εγγραφής

#### `handle_test_failure()`
Δημιουργεί απαιτήσεις επανάληψης όταν τα τεστ αποτυγχάνουν
- Ενεργοποιείται στο INSERT του `test_results`
- Ελέγχει αν η βαθμολογία είναι κάτω από το όριο επιτυχίας

## Μοντέλο Ασφάλειας

### Row Level Security (RLS)
Όλοι οι πίνακες υλοποιούν πολιτικές RLS που διασφαλίζουν ότι οι χρήστες μπορούν να προσπελάσουν μόνο τα δικά τους δεδομένα:

```sql
-- Παράδειγμα πολιτικής
CREATE POLICY "Users can view their own progress" 
  ON user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

### Ροή Πιστοποίησης
1. Ο χρήστης εγγράφεται/συνδέεται μέσω Supabase Auth
2. Το Frontend λαμβάνει token συνεδρίας
3. Όλες οι κλήσεις API συμπεριλαμβάνουν headers πιστοποίησης
4. Οι πολιτικές RLS επιβάλλουν απομόνωση δεδομένων

## Ροή Δεδομένων

### Ροή Προόδου Μάθησης
```
Ενέργεια Χρήστη → Frontend Component → Context Update → Supabase API → Database → RLS Check → Response
```

### Ροή Ολοκλήρωσης Τεστ
```
Υποβολή Τεστ → Υπολογισμός Βαθμολογίας → INSERT test_results → Αξιολόγηση Trigger → 
Δημιουργία Απαίτησης Επανάληψης (αν αποτύχει) → Ενημέρωση Progress Context → Ενημέρωση UI
```

## Θέματα Απόδοσης

### Στρατηγική Caching
- Το React Query cache την κατάσταση διακομιστή
- Το Context παρέχει αισιόδοξες ενημερώσεις
- Οι ερωτήματα βάσης δεδομένων βελτιστοποιούνται με ευρετήρια

### Real-time Ενημερώσεις
- Supabase real-time subscriptions για ζωντανές ενημερώσεις προόδου
- Αποδοτική επαναδημιουργία με React.memo και useMemo

### Βελτιστοποίηση Bundle
- Code splitting με React.lazy
- Tree shaking με Vite
- Βελτιστοποίηση βιβλιοθήκης components με Shadcn/ui

## Χαρακτηριστικά Επεκτασιμότητας

### Οριζόντια Επέκταση
- Stateless frontend αναπτύξιμο σε CDN
- Το Supabase χειρίζεται αυτόματα την επέκταση backend
- Connection pooling βάσης δεδομένων μέσω Supabase

### Κάθετη Επέκταση
- Βελτιστοποιήσεις PostgreSQL μέσω ευρετηρίων
- Αποδοτικά ερωτήματα με κατάλληλα JOINs
- Οι πολιτικές RLS αποτρέπουν τη διαρροή δεδομένων

## Μοτίβα Ανάπτυξης

### Δομή Components
```
src/
├── components/
│   ├── ui/           # Επαναχρησιμοποιήσιμα UI components
│   ├── exercises/    # Components συγκεκριμένων ασκήσεων
│   ├── revision/     # Components συστήματος επανάληψης
│   └── layout/       # Layout components
├── contexts/         # React Context providers
├── pages/           # Route components
├── services/        # Επίπεδο πρόσβασης δεδομένων
└── hooks/           # Προσαρμοσμένα React hooks
```

### Type Safety
- Περιεκτικοί τύποι TypeScript
- Αυτόματα δημιουργημένοι τύποι Supabase
- Ενεργοποιημένος αυστηρός έλεγχος τύπων

### Χειρισμός Σφαλμάτων
- Καθολικά error boundaries
- Toast notifications για ανατροφοδότηση χρήστη
- Περιεκτική καταγραφή σφαλμάτων

## Αρχιτεκτονική Ανάπτυξης

### Παραγωγική Εγκατάσταση
```
Internet → CDN (Vercel/Netlify) → React SPA → Supabase API → PostgreSQL
```

### Διαμόρφωση Περιβάλλοντος
- Μεταβλητές περιβάλλοντος για API keys
- Χωριστές βάσεις δεδομένων dev/staging/production
- Ενσωμάτωση CI/CD pipeline

## Παρακολούθηση & Αναλυτικά

### Ενσωματωμένη Παρακολούθηση
- Supabase dashboard για μετρικές βάσης δεδομένων
- Αναλυτικά πιστοποίησης
- Παρακολούθηση απόδοσης μέσω εργαλείων ανάπτυξης φυλλομετρητή

### Προσαρμοσμένα Αναλυτικά
- Παρακολούθηση προόδου χρήστη
- Μετρικές αποτελεσματικότητας μάθησης
- Αναλυτικά απόδοσης τεστ

## Βέλτιστες Πρακτικές Ασφάλειας

### Frontend Security
- Κανένα ευαίσθητο δεδομένο στον κώδικα client-side
- Ασφαλής χειρισμός token πιστοποίησης
- Προστασία XSS μέσω ενσωματωμένου escaping του React

### Backend Security
- Πολιτικές RLS για απομόνωση δεδομένων
- Prepared statements αποτρέπουν SQL injection
- Rate limiting μέσω Supabase

### Infrastructure Security
- HTTPS παντού
- Ασφαλής διαχείριση μεταβλητών περιβάλλοντος
- Τακτικές ενημερώσεις ασφαλείας μέσω dependencies
