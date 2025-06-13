import { faker } from "@faker-js/faker";

export interface Test {
  id: number;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  exercises: Exercise[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  slug: string;
  lessons: Lesson[];
  tests?: Test[];
  completedAt?: Date | null;
}

export interface Lesson {
  id: number;
  title: string;
  content: ContentBlock[];
  exercises?: Exercise[];
  completed?: boolean;
}

export interface ContentBlock {
  type: "text" | "code" | "image" | "exercise";
  content: string;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  type: "multiple_choice" | "code_completion" | "code_writing" | "debugging";
  difficulty: "easy" | "medium" | "hard";
  content: MultipleChoiceContent | CodeExerciseContent;
}

export interface MultipleChoiceContent {
  options: string[];
  correctOption: string;
  hints?: string[];
}

export interface CodeExerciseContent {
  starterCode: string;
  solution: string;
  hints?: string[];
  testCases?: {
    input: string;
    expected: string;
  }[];
}

// Mock Data
export const modules: Module[] = [
  {
    id: 1,
    title: "Python Basics",
    slug: "python-basics",
    description: "Get started with Python by learning the basics of syntax, data types, and variables.",
    lessons: [
      {
        id: 1,
        title: "Introduction to Python",
        content: [
          { type: "text", content: "Welcome to Python! This is a basic introduction." },
          { type: "code", content: 'print("Hello, World!")' }
        ],
        exercises: [
          {
            id: 1,
            title: "Print Statement",
            description: "Write a Python program to print 'Hello, World!' to the console.",
            type: "code_writing",
            difficulty: "easy",
            content: {
              starterCode: "",
              solution: 'print("Hello, World!")',
              hints: ["Use the print() function to output text."]
            }
          }
        ]
      },
      {
        id: 2,
        title: "Variables and Data Types",
        content: [
          { type: "text", content: "Learn about variables and basic data types in Python." },
          { type: "code", content: "x = 5\nname = 'Python'" }
        ],
        exercises: [
          {
            id: 2,
            title: "Variable Assignment",
            description: "Assign the value 10 to a variable named 'number'.",
            type: "code_writing",
            difficulty: "easy",
            content: {
              starterCode: "",
              solution: "number = 10",
              hints: ["Use the assignment operator (=) to assign a value to a variable."]
            }
          },
          {
            id: 3,
            title: "Data Type Identification",
            description: "Which data type is best suited for storing a person's name?",
            type: "multiple_choice",
            difficulty: "easy",
            content: {
              options: ["Integer", "String", "Boolean", "Float"],
              correctOption: "String",
              hints: ["Consider what kind of data a name is."]
            }
          }
        ]
      }
    ],
    tests: [
      {
        id: 1,
        title: "Python Basics Assessment",
        description: "Test your understanding of Python fundamentals including variables, data types, and basic operations.",
        timeLimit: 30,
        passingScore: 70,
        exercises: [
          {
            id: 101,
            title: "Variable Assignment",
            description: "What is the correct way to assign a value to a variable in Python?",
            type: "multiple_choice",
            difficulty: "easy",
            content: {
              options: ["x = 5", "var x = 5", "let x = 5", "int x = 5"],
              correctOption: "x = 5",
              hints: ["Python doesn't require variable declarations like other languages."]
            }
          },
          {
            id: 102,
            title: "Data Types",
            description: "Which of these is a valid Python data type?",
            type: "multiple_choice",
            difficulty: "easy",
            content: {
              options: ["string", "integer", "list", "all of the above"],
              correctOption: "all of the above",
              hints: ["Python supports multiple built-in data types."]
            }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Control Structures",
    slug: "control-structures",
    description: "Master control structures like if statements and loops in Python.",
    lessons: [
      {
        id: 3,
        title: "If Statements",
        content: [
          { type: "text", content: "Learn how to use if, elif, and else statements." },
          { type: "code", content: "if x > 0:\n  print('Positive')" }
        ],
        exercises: [
          {
            id: 4,
            title: "Positive Number Check",
            description: "Write an if statement to check if a number is positive.",
            type: "code_completion",
            difficulty: "medium",
            content: {
              starterCode: "x = 5\nif ___:\n  print('Positive')",
              solution: "x > 0",
              hints: ["Use a comparison operator to check if x is greater than 0."]
            }
          }
        ]
      },
      {
        id: 4,
        title: "For and While Loops",
        content: [
          { type: "text", content: "Explore for and while loops for iteration." },
          { type: "code", content: "for i in range(5):\n  print(i)" }
        ],
        exercises: [
          {
            id: 5,
            title: "Loop Printing",
            description: "Write a for loop that prints numbers from 1 to 10.",
            type: "code_writing",
            difficulty: "medium",
            content: {
              starterCode: "",
              solution: "for i in range(1, 11):\n  print(i)",
              hints: ["Use the range() function to generate a sequence of numbers."]
            }
          }
        ]
      }
    ],
    tests: [
      {
        id: 2,
        title: "Control Structures Test",
        description: "Evaluate your knowledge of Python control structures including loops and conditionals.",
        timeLimit: 45,
        passingScore: 75,
        exercises: [
          {
            id: 201,
            title: "If Statement",
            description: "Complete the if statement to check if a number is positive:",
            type: "code_completion",
            difficulty: "medium",
            content: {
              starterCode: "x = 10\nif ___:\n    print('Positive')",
              solution: "x > 0",
              hints: ["Use a comparison operator to check if x is greater than 0."],
              testCases: [
                { input: "x = 10", expected: "Positive" },
                { input: "x = -5", expected: "" }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Functions and Scope",
    slug: "functions-and-scope",
    description: "Understand functions, parameters, and variable scope in Python.",
    lessons: [
      {
        id: 5,
        title: "Defining Functions",
        content: [
          { type: "text", content: "Learn how to define and call functions in Python." },
          { type: "code", content: "def greet(name):\n  print(f'Hello, {name}!')" }
        ],
        exercises: [
          {
            id: 6,
            title: "Greeting Function",
            description: "Define a function that greets a person by name.",
            type: "code_writing",
            difficulty: "medium",
            content: {
              starterCode: "",
              solution: "def greet(name):\n  print(f'Hello, {name}!')",
              hints: ["Use the def keyword to define a function.", "Use f-strings to include variables in the output."]
            }
          }
        ]
      },
      {
        id: 6,
        title: "Variable Scope",
        content: [
          { type: "text", content: "Understand the difference between global and local scope." },
          { type: "code", content: "global_var = 10\ndef my_func():\n  local_var = 5" }
        ],
        exercises: [
          {
            id: 7,
            title: "Scope Identification",
            description: "Identify which variable has global scope in the following code.",
            type: "multiple_choice",
            difficulty: "medium",
            content: {
              options: ["global_var", "local_var", "Both", "None"],
              correctOption: "global_var",
              hints: ["Consider where the variable is defined."]
            }
          }
        ]
      }
    ],
    tests: [
      {
        id: 3,
        title: "Functions and Scope Assessment",
        description: "Test your understanding of Python functions, parameters, and variable scope.",
        timeLimit: 40,
        passingScore: 80,
        exercises: [
          {
            id: 301,
            title: "Function Definition",
            description: "Which keyword is used to define a function in Python?",
            type: "multiple_choice",
            difficulty: "easy",
            content: {
              options: ["function", "def", "func", "define"],
              correctOption: "def",
              hints: ["Python uses a short keyword for function definitions."]
            }
          }
        ]
      }
    ]
  }
];

// Tests data - now redundant since tests are embedded in modules
export const tests: Test[] = [];

// Module-to-tests mapping - now uses the embedded tests
const moduleTestsMap: Record<number, number[]> = {};

export const getModuleTests = (moduleId: number): Test[] => {
  const module = modules.find(m => m.id === moduleId);
  return module?.tests || [];
};

export const getTestById = (testId: number): Test | undefined => {
  for (const module of modules) {
    if (module.tests) {
      const test = module.tests.find(test => test.id === testId);
      if (test) return test;
    }
  }
  return undefined;
};

export const getModuleBySlug = (slug: string): Module | null => {
  const module = modules.find((module) => module.slug === slug);
  return module || null;
};

export const getModuleById = (moduleId: number): Module | undefined => {
  return modules.find(module => module.id === moduleId);
};

export const getLessonById = (lessonId: number): Lesson | undefined => {
  for (const module of modules) {
    const lesson = module.lessons.find(lesson => lesson.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
};

export const generateMockProgress = () => {
  return modules.reduce((acc: { [moduleId: number]: { lessonsCompleted: number[] } }, module) => {
    acc[module.id] = {
      lessonsCompleted: []
    };
    return acc;
  }, {});
};
