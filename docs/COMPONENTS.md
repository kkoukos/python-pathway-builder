
# Τεκμηρίωση Components

## Επισκόπηση

Αυτό το έγγραφο παρέχει λεπτομερείς πληροφορίες για τα React components που χρησιμοποιούνται στην πλατφόρμα μάθησης, τις ευθύνες τους, τα props και τα μοτίβα χρήσης.

## Ιεραρχία Components

```
App
├── AuthProvider
├── ProgressProvider
├── MainLayout
│   ├── Header
│   ├── Sidebar
│   └── Outlet (Route Components)
└── Route Components
    ├── Home
    ├── ModuleList
    ├── ModuleDetail
    ├── LessonDetail
    ├── TestView
    └── UserProfile
```

## Context Providers

### AuthContext (`src/contexts/AuthContext.tsx`)

**Σκοπός**: Διαχειρίζεται την κατάσταση και τις λειτουργίες πιστοποίησης χρήστη.

**Κατάσταση**:
- `user: UserProfile | null` - Τρέχοντα δεδομένα προφίλ χρήστη
- `session: Session | null` - Αντικείμενο συνεδρίας Supabase
- `isAuthenticated: boolean` - Κατάσταση πιστοποίησης
- `isLoading: boolean` - Κατάσταση φόρτωσης για λειτουργίες auth

**Μέθοδοι**:
- `login(email, password)` - Σύνδεση χρήστη
- `register(username, email, password)` - Εγγραφή χρήστη
- `logout()` - Αποσύνδεση χρήστη
- `updateProfile(profile)` - Ενημέρωση προφίλ χρήστη
- `getAvatarUrl()` - Λήψη URL avatar χρήστη

**Χρήση**:
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### ProgressContext (`src/contexts/ProgressContext.tsx`)

**Σκοπός**: Διαχειρίζεται την κατάσταση και τις λειτουργίες προόδου μάθησης.

**Κατάσταση**:
- `progress: Record<number, ModuleProgress>` - Πρόοδος χρήστη ανά ενότητα
- `revisionRequirements: RevisionRequirement[]` - Ενεργές απαιτήσεις επανάληψης

**Μέθοδοι**:
- `markLessonComplete(moduleId, lessonId)` - Σήμανση μαθήματος ως ολοκληρωμένου
- `markExerciseComplete(moduleId, lessonId, exerciseId)` - Σήμανση άσκησης ως ολοκληρωμένης
- `markTestComplete(moduleId, testId, score, passed)` - Καταγραφή αποτελεσμάτων τεστ
- `markRevisionCompleted(moduleId, testId)` - Ολοκλήρωση απαίτησης επανάληψης
- `hasRevisionRequirement(moduleId, testId)` - Έλεγχος αν απαιτείται επανάληψη
- `isLessonCompleted(moduleId, lessonId)` - Έλεγχος κατάστασης ολοκλήρωσης μαθήματος

**Χρήση**:
```typescript
const { markLessonComplete, isLessonCompleted } = useProgress();
```

## Layout Components

### MainLayout (`src/components/layout/MainLayout.tsx`)

**Σκοπός**: Κύριο layout εφαρμογής με header, sidebar και περιοχή περιεχομένου.

**Χαρακτηριστικά**:
- Responsive σχεδιασμός
- Διαχείριση πλοήγησης
- Route outlet για περιεχόμενο σελίδας

### Header (`src/components/layout/Header.tsx`)

**Σκοπός**: Γραμμή πλοήγησης στο επάνω μέρος με μενού χρήστη και branding.

**Χαρακτηριστικά**:
- Κατάσταση πιστοποίησης χρήστη
- Σύνδεσμοι πλοήγησης
- Dropdown μενού χρήστη
- Responsive mobile μενού

### Sidebar (`src/components/layout/Sidebar.tsx`)

**Σκοπός**: Πλευρική πλοήγηση για κύριες περιοχές εφαρμογής.

**Χαρακτηριστικά**:
- Πλοήγηση ενοτήτων
- Δείκτες προόδου
- Συμπτυσσόμενος σχεδιασμός

## Exercise Components

### ExerciseList (`src/components/exercises/ExerciseList.tsx`)

**Σκοπός**: Εμφανίζει λίστα ασκήσεων για μάθημα με πλευρική πλοήγηση.

**Props**:
```typescript
interface ExerciseListProps {
  exercises: Exercise[];
  lessonId: number;
  moduleId: number;
}
```

**Χαρακτηριστικά**:
- Sidebar επιλογής ασκήσεων
- Δείκτες κατάστασης ολοκλήρωσης
- Badges δυσκολίας
- Responsive layout (sidebar σε desktop, accordion σε mobile)

### ExerciseDetail (`src/components/exercises/ExerciseDetail.tsx`)

**Σκοπός**: Αποδίδει περιεχόμενο μεμονωμένης άσκησης βάσει τύπου άσκησης.

**Props**:
```typescript
interface ExerciseDetailProps {
  exercise: Exercise;
  moduleId: number;
  lessonId: number;
  onCompleted: () => void;
}
```

**Χαρακτηριστικά**:
- Δυναμική απόδοση τύπου άσκησης
- Παρακολούθηση ολοκλήρωσης
- Callback προόδου

### MultipleChoiceExercise (`src/components/exercises/MultipleChoiceExercise.tsx`)

**Σκοπός**: Διαδραστικό component ερώτησης πολλαπλής επιλογής.

**Props**:
```typescript
interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}
```

**Χαρακτηριστικά**:
- Επιλογή options
- Επικύρωση απάντησης
- Σύστημα υποδείξεων
- Οπτική ανατροφοδότηση

### CodeExercise (`src/components/exercises/CodeExercise.tsx`)

**Σκοπός**: Component άσκησης συμπλήρωσης και γραψίματος κώδικα.

**Props**:
```typescript
interface CodeExerciseProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}
```

**Χαρακτηριστικά**:
- Διεπαφή επεξεργαστή κώδικα
- Syntax highlighting
- Επικύρωση λύσης
- Εκτέλεση test cases

## Revision System Components

### RevisionAlert (`src/components/revision/RevisionAlert.tsx`)

**Σκοπός**: Εμφανίζει ειδοποίηση όταν απαιτείται επανάληψη πριν την επανάληψη τεστ.

**Props**:
```typescript
interface RevisionAlertProps {
  moduleId: number;
  testId: number;
  onStartRevision: () => void;
}
```

**Χαρακτηριστικά**:
- Εμφάνιση μηνύματος προειδοποίησης
- Κουμπί έναρξης επανάληψης
- Εμφάνιση βαθμολογίας αποτυχίας τεστ

### RevisionCourse (`src/components/revision/RevisionCourse.tsx`)

**Σκοπός**: Διαδραστικό μάθημα επανάληψης με περιεχόμενο βήμα προς βήμα.

**Props**:
```typescript
interface RevisionCourseProps {
  moduleId: number;
  testId: number;
  onRevisionComplete: () => void;
}
```

**Χαρακτηριστικά**:
- Προοδευτική πρόοδος βήμα προς βήμα
- Δείκτες τύπου περιεχομένου (έννοια, πρακτική, περίληψη)
- Παρακολούθηση προόδου
- Εκτίμηση διάρκειας
- Callback ολοκλήρωσης

## Page Components

### Home (`src/pages/Home.tsx`)

**Σκοπός**: Αρχική σελίδα με επισκόπηση πλατφόρμας και πληροφορίες εκκίνησης.

**Χαρακτηριστικά**:
- Hero section
- Επισήμανση χαρακτηριστικών
- Οδηγός εκκίνησης
- Πλοήγηση σε ενότητες (για πιστοποιημένους χρήστες)

### ModuleList (`src/pages/ModuleList.tsx`)

**Σκοπός**: Εμφανίζει διαθέσιμες ενότητες μάθησης με δείκτες προόδου.

**Χαρακτηριστικά**:
- Κάρτες ενοτήτων με περιγραφές
- Οπτικοποίηση προόδου
- Κατάσταση ολοκλήρωσης
- Πλοήγηση ενοτήτων

### ModuleDetail (`src/pages/ModuleDetail.tsx`)

**Σκοπός**: Λεπτομερής προβολή συγκεκριμένης ενότητας με μαθήματα και τεστ.

**Χαρακτηριστικά**:
- Εμφάνιση πληροφοριών ενότητας
- Λίστα μαθημάτων με κατάσταση ολοκλήρωσης
- Πρόσβαση σε τεστ (με προαπαιτούμενα)
- Επισκόπηση προόδου

### LessonDetail (`src/pages/LessonDetail.tsx`)

**Σκοπός**: Προβολή μεμονωμένου μαθήματος με περιεχόμενο και ασκήσεις.

**Χαρακτηριστικά**:
- Απόδοση περιεχομένου μαθήματος
- Ενσωμάτωση ασκήσεων
- Παρακολούθηση προόδου
- Χειριστήρια πλοήγησης

### TestView (`src/pages/TestView.tsx`)

**Σκοπός**: Διεπαφή τεστ με ερωτήσεις και αποτελέσματα.

**Χαρακτηριστικά**:
- Παρουσίαση ερωτήσεων
- Λειτουργικότητα χρονομέτρου
- Υπολογισμός βαθμολογίας
- Εμφάνιση αποτελεσμάτων
- Χειρισμός απαιτήσεων επανάληψης

### ModuleTests (`src/pages/ModuleTests.tsx`)

**Σκοπός**: Επισκόπηση τεστ διαθέσιμων για ενότητα.

**Χαρακτηριστικά**:
- Εμφάνιση λίστας τεστ
- Έλεγχος προαπαιτούμενων
- Ειδοποιήσεις επανάληψης
- Πλοήγηση τεστ

## Profile Components

### ProfileHeader (`src/components/profile/ProfileHeader.tsx`)

**Σκοπός**: Header προφίλ χρήστη με avatar και βασικές πληροφορίες.

**Χαρακτηριστικά**:
- Εμφάνιση avatar
- Πληροφορίες χρήστη
- Δυνατότητες επεξεργασίας

### OverallProgressCard (`src/components/profile/OverallProgressCard.tsx`)

**Σκοπός**: Εμφανίζει στατιστικά συνολικής προόδου μάθησης.

**Χαρακτηριστικά**:
- Οπτικοποίηση προόδου
- Εμφάνιση στατιστικών
- Δείκτες επιτευγμάτων

### ModuleProgressCard (`src/components/profile/ModuleProgressCard.tsx`)

**Σκοπός**: Δείχνει λεπτομερή πρόοδο για μεμονωμένες ενότητες.

**Χαρακτηριστικά**:
- Πρόοδος συγκεκριμένης ενότητας
- Κατάσταση ολοκλήρωσης μαθημάτων
- Αποτελέσματα τεστ

## UI Components (Shadcn/ui)

### Card Components
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- Συνεπές styling για containers περιεχομένου

### Form Components
- `Button` - Διάφορα στυλ και καταστάσεις κουμπιών
- `Input` - Text input με επικύρωση
- `Select` - Dropdown επιλογή
- `Checkbox` - Boolean input
- `RadioGroup` - Μεμονωμένη επιλογή από options

### Feedback Components
- `Progress` - Οπτικοποίηση γραμμής προόδου
- `Badge` - Δείκτες κατάστασης
- `Alert` - Μηνύματα πληροφοριών και προειδοποίησης
- `Toast` - Προσωρινές ειδοποιήσεις

### Navigation Components
- `Accordion` - Συμπτυσσόμενα τμήματα περιεχομένου
- `Tabs` - Οργάνωση περιεχομένου σε καρτέλες
- `Breadcrumb` - Δείκτες διαδρομής πλοήγησης

## Μοτίβα Σχεδιασμού Components

### Composition Pattern
Τα components είναι σχεδιασμένα να είναι συνθέσιμα και επαναχρησιμοποιήσιμα:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Τίτλος Άσκησης</CardTitle>
  </CardHeader>
  <CardContent>
    <ExerciseDetail exercise={exercise} />
  </CardContent>
</Card>
```

### Render Props Pattern
Μερικά components χρησιμοποιούν render props για ευέλικτο περιεχόμενο:

```typescript
<ExerciseList 
  exercises={exercises}
  renderExercise={(exercise) => <CustomExerciseView exercise={exercise} />}
/>
```

### Custom Hooks Pattern
Η επιχειρησιακή λογική εξάγεται σε προσαρμοσμένα hooks:

```typescript
const useExerciseCompletion = (moduleId, lessonId) => {
  const { markExerciseComplete } = useProgress();
  
  const completeExercise = useCallback((exerciseId) => {
    markExerciseComplete(moduleId, lessonId, exerciseId);
  }, [moduleId, lessonId, markExerciseComplete]);
  
  return { completeExercise };
};
```

## Βελτιστοποιήσεις Απόδοσης

### React.memo
Τα components είναι memoized για αποφυγή περιττών re-renders:

```typescript
export default React.memo(ExerciseList);
```

### useMemo και useCallback
Ακριβοί υπολογισμοί και συναρτήσεις είναι memoized:

```typescript
const filteredExercises = useMemo(() => 
  exercises.filter(ex => ex.difficulty === selectedDifficulty),
  [exercises, selectedDifficulty]
);
```

### Code Splitting
Μεγάλα components φορτώνονται lazy:

```typescript
const TestView = lazy(() => import('./pages/TestView'));
```

## Error Boundaries

### Global Error Boundary
Συλλαμβάνει και χειρίζεται σφάλματα components με χάρη:

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Θέματα Testing

### Component Testing
- Unit tests για μεμονωμένα components
- Integration tests για αλληλεπιδράσεις components
- Mock data για απομονωμένο testing

### Προσβασιμότητα
- ARIA labels και roles
- Υποστήριξη πλοήγησης με πληκτρολόγιο
- Συμβατότητα με screen readers
- Συμμόρφωση αντίθεσης χρωμάτων

## Βέλτιστες Πρακτικές

### Συμβάσεις Ονομασίας
- PascalCase για ονόματα components
- camelCase για props και συναρτήσεις
- Περιγραφικά, ονόματα που αποκαλύπτουν πρόθεση

### Οργάνωση Αρχείων
- Ένα component ανά αρχείο
- Index αρχεία για barrel exports
- Co-located tests και styles

### Σχεδιασμός Props Interface
- Ρητοί τύποι props με TypeScript
- Προαιρετικά props με προεπιλεγμένες τιμές
- Συνεπή μοτίβα ονομασίας props

### Διαχείριση Κατάστασης
- Τοπική κατάσταση για δεδομένα συγκεκριμένα του component
- Context για κοινή κατάσταση εφαρμογής
- React Query για κατάσταση διακομιστή
