
# Component Documentation

## Overview

This document provides detailed information about the React components used in the learning platform, their responsibilities, props, and usage patterns.

## Component Hierarchy

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

**Purpose**: Manages user authentication state and operations.

**State**:
- `user: UserProfile | null` - Current user profile data
- `session: Session | null` - Supabase session object
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state for auth operations

**Methods**:
- `login(email, password)` - User login
- `register(username, email, password)` - User registration
- `logout()` - User logout
- `updateProfile(profile)` - Update user profile
- `getAvatarUrl()` - Get user avatar URL

**Usage**:
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### ProgressContext (`src/contexts/ProgressContext.tsx`)

**Purpose**: Manages learning progress state and operations.

**State**:
- `progress: Record<number, ModuleProgress>` - User progress by module
- `revisionRequirements: RevisionRequirement[]` - Active revision requirements

**Methods**:
- `markLessonComplete(moduleId, lessonId)` - Mark lesson as completed
- `markExerciseComplete(moduleId, lessonId, exerciseId)` - Mark exercise as completed
- `markTestComplete(moduleId, testId, score, passed)` - Record test results
- `markRevisionCompleted(moduleId, testId)` - Complete revision requirement
- `hasRevisionRequirement(moduleId, testId)` - Check if revision is required
- `isLessonCompleted(moduleId, lessonId)` - Check lesson completion status

**Usage**:
```typescript
const { markLessonComplete, isLessonCompleted } = useProgress();
```

## Layout Components

### MainLayout (`src/components/layout/MainLayout.tsx`)

**Purpose**: Main application layout with header, sidebar, and content area.

**Features**:
- Responsive design
- Navigation management
- Route outlet for page content

### Header (`src/components/layout/Header.tsx`)

**Purpose**: Top navigation bar with user menu and branding.

**Features**:
- User authentication status
- Navigation links
- User dropdown menu
- Responsive mobile menu

### Sidebar (`src/components/layout/Sidebar.tsx`)

**Purpose**: Side navigation for main application areas.

**Features**:
- Module navigation
- Progress indicators
- Collapsible design

## Exercise Components

### ExerciseList (`src/components/exercises/ExerciseList.tsx`)

**Purpose**: Displays list of exercises for a lesson with sidebar navigation.

**Props**:
```typescript
interface ExerciseListProps {
  exercises: Exercise[];
  lessonId: number;
  moduleId: number;
}
```

**Features**:
- Exercise selection sidebar
- Completion status indicators
- Difficulty badges
- Responsive layout (sidebar on desktop, accordion on mobile)

### ExerciseDetail (`src/components/exercises/ExerciseDetail.tsx`)

**Purpose**: Renders individual exercise content based on exercise type.

**Props**:
```typescript
interface ExerciseDetailProps {
  exercise: Exercise;
  moduleId: number;
  lessonId: number;
  onCompleted: () => void;
}
```

**Features**:
- Dynamic exercise type rendering
- Completion tracking
- Progress callback

### MultipleChoiceExercise (`src/components/exercises/MultipleChoiceExercise.tsx`)

**Purpose**: Interactive multiple choice question component.

**Props**:
```typescript
interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}
```

**Features**:
- Option selection
- Answer validation
- Hint system
- Visual feedback

### CodeExercise (`src/components/exercises/CodeExercise.tsx`)

**Purpose**: Code completion and writing exercise component.

**Props**:
```typescript
interface CodeExerciseProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}
```

**Features**:
- Code editor interface
- Syntax highlighting
- Solution validation
- Test case execution

## Revision System Components

### RevisionAlert (`src/components/revision/RevisionAlert.tsx`)

**Purpose**: Displays alert when revision is required before test retake.

**Props**:
```typescript
interface RevisionAlertProps {
  moduleId: number;
  testId: number;
  onStartRevision: () => void;
}
```

**Features**:
- Warning message display
- Revision initiation button
- Test failure score display

### RevisionCourse (`src/components/revision/RevisionCourse.tsx`)

**Purpose**: Interactive revision course with step-by-step content.

**Props**:
```typescript
interface RevisionCourseProps {
  moduleId: number;
  testId: number;
  onRevisionComplete: () => void;
}
```

**Features**:
- Step-by-step progression
- Content type indicators (concept, practice, summary)
- Progress tracking
- Duration estimates
- Completion callback

## Page Components

### Home (`src/pages/Home.tsx`)

**Purpose**: Landing page with platform overview and getting started information.

**Features**:
- Hero section
- Feature highlights
- Getting started guide
- Navigation to modules (authenticated users)

### ModuleList (`src/pages/ModuleList.tsx`)

**Purpose**: Displays available learning modules with progress indicators.

**Features**:
- Module cards with descriptions
- Progress visualization
- Completion status
- Module navigation

### ModuleDetail (`src/pages/ModuleDetail.tsx`)

**Purpose**: Detailed view of a specific module with lessons and tests.

**Features**:
- Module information display
- Lesson list with completion status
- Test access (with prerequisites)
- Progress overview

### LessonDetail (`src/pages/LessonDetail.tsx`)

**Purpose**: Individual lesson view with content and exercises.

**Features**:
- Lesson content rendering
- Exercise integration
- Progress tracking
- Navigation controls

### TestView (`src/pages/TestView.tsx`)

**Purpose**: Test interface with questions and results.

**Features**:
- Question presentation
- Timer functionality
- Score calculation
- Results display
- Revision requirement handling

### ModuleTests (`src/pages/ModuleTests.tsx`)

**Purpose**: Overview of tests available for a module.

**Features**:
- Test list display
- Prerequisite checking
- Revision alerts
- Test navigation

## Profile Components

### ProfileHeader (`src/components/profile/ProfileHeader.tsx`)

**Purpose**: User profile header with avatar and basic information.

**Features**:
- Avatar display
- User information
- Edit capabilities

### OverallProgressCard (`src/components/profile/OverallProgressCard.tsx`)

**Purpose**: Displays overall learning progress statistics.

**Features**:
- Progress visualization
- Statistics display
- Achievement indicators

### ModuleProgressCard (`src/components/profile/ModuleProgressCard.tsx`)

**Purpose**: Shows detailed progress for individual modules.

**Features**:
- Module-specific progress
- Lesson completion status
- Test results

## UI Components (Shadcn/ui)

### Card Components
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- Consistent styling for content containers

### Form Components
- `Button` - Various button styles and states
- `Input` - Text input with validation
- `Select` - Dropdown selection
- `Checkbox` - Boolean input
- `RadioGroup` - Single selection from options

### Feedback Components
- `Progress` - Progress bar visualization
- `Badge` - Status indicators
- `Alert` - Information and warning messages
- `Toast` - Temporary notifications

### Navigation Components
- `Accordion` - Collapsible content sections
- `Tabs` - Tabbed content organization
- `Breadcrumb` - Navigation path indicators

## Component Design Patterns

### Composition Pattern
Components are designed to be composable and reusable:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Exercise Title</CardTitle>
  </CardHeader>
  <CardContent>
    <ExerciseDetail exercise={exercise} />
  </CardContent>
</Card>
```

### Render Props Pattern
Some components use render props for flexible content:

```typescript
<ExerciseList 
  exercises={exercises}
  renderExercise={(exercise) => <CustomExerciseView exercise={exercise} />}
/>
```

### Custom Hooks Pattern
Business logic is extracted into custom hooks:

```typescript
const useExerciseCompletion = (moduleId, lessonId) => {
  const { markExerciseComplete } = useProgress();
  
  const completeExercise = useCallback((exerciseId) => {
    markExerciseComplete(moduleId, lessonId, exerciseId);
  }, [moduleId, lessonId, markExerciseComplete]);
  
  return { completeExercise };
};
```

## Performance Optimizations

### React.memo
Components are memoized to prevent unnecessary re-renders:

```typescript
export default React.memo(ExerciseList);
```

### useMemo and useCallback
Expensive calculations and functions are memoized:

```typescript
const filteredExercises = useMemo(() => 
  exercises.filter(ex => ex.difficulty === selectedDifficulty),
  [exercises, selectedDifficulty]
);
```

### Code Splitting
Large components are lazy-loaded:

```typescript
const TestView = lazy(() => import('./pages/TestView'));
```

## Error Boundaries

### Global Error Boundary
Catches and handles component errors gracefully:

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

## Testing Considerations

### Component Testing
- Unit tests for individual components
- Integration tests for component interactions
- Mock data for isolated testing

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Best Practices

### Naming Conventions
- PascalCase for component names
- camelCase for props and functions
- Descriptive, intention-revealing names

### File Organization
- One component per file
- Index files for barrel exports
- Co-located tests and styles

### Props Interface Design
- Explicit prop types with TypeScript
- Optional props with default values
- Consistent prop naming patterns

### State Management
- Local state for component-specific data
- Context for shared application state
- React Query for server state
