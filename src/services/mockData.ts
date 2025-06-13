
import { faker } from "@faker-js/faker";

export interface Test {
  id: number;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  exercises: Exercise[];
  revisionContent?: RevisionContent;
}

export interface RevisionContent {
  title: string;
  description: string;
  steps: RevisionStep[];
}

export interface RevisionStep {
  id: number;
  title: string;
  content: string;
  type: "concept" | "practice" | "example" | "summary";
  duration: number; // estimated minutes
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
        ],
        revisionContent: {
          title: "Python Basics Revision",
          description: "Review the fundamental concepts of Python programming including variables, data types, and basic syntax.",
          steps: [
            {
              id: 1,
              title: "Understanding Python Variables",
              content: "In Python, variables are created when you assign a value to them. Unlike other languages, you don't need to declare the variable type. For example: x = 5 creates an integer variable, while name = 'John' creates a string variable. Python automatically determines the data type based on the value assigned.",
              type: "concept",
              duration: 5
            },
            {
              id: 2,
              title: "Python Data Types Review",
              content: "Python has several built-in data types: int (integers like 5, 10), float (decimal numbers like 3.14), str (strings like 'hello'), bool (True/False), list (collections like [1, 2, 3]), and dict (key-value pairs like {'name': 'John'}). Understanding these is crucial for effective Python programming.",
              type: "concept",
              duration: 7
            },
            {
              id: 3,
              title: "Practice: Variable Assignment",
              content: "Try these exercises:\n1. Create a variable 'age' and assign your age to it\n2. Create a variable 'name' and assign your name as a string\n3. Create a variable 'height' and assign your height as a float\n4. Print all three variables using the print() function",
              type: "practice",
              duration: 10
            },
            {
              id: 4,
              title: "Common Mistakes to Avoid",
              content: "Remember: Python is case-sensitive (Name and name are different), use quotes for strings, and the assignment operator is = (single equals). Don't confuse it with == which is for comparison. Variable names should start with a letter or underscore, not a number.",
              type: "summary",
              duration: 3
            }
          ]
        }
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
        ],
        revisionContent: {
          title: "Control Structures Revision",
          description: "Master Python's control flow statements including if/elif/else, for loops, and while loops.",
          steps: [
            {
              id: 1,
              title: "Conditional Statements Deep Dive",
              content: "Python's if statements allow you to execute code based on conditions. The basic syntax is:\nif condition:\n    # code to execute\nelif another_condition:\n    # alternative code\nelse:\n    # default code\n\nRemember proper indentation (4 spaces) is crucial in Python!",
              type: "concept",
              duration: 8
            },
            {
              id: 2,
              title: "Comparison Operators Review",
              content: "Master these comparison operators: == (equal), != (not equal), > (greater than), < (less than), >= (greater than or equal), <= (less than or equal). You can also use 'and', 'or', and 'not' to combine conditions.",
              type: "concept",
              duration: 6
            },
            {
              id: 3,
              title: "Loop Structures Explained",
              content: "For loops iterate over sequences: for item in sequence:\nWhile loops continue until a condition is false: while condition:\nUse range() for numeric sequences: range(start, stop, step). Remember to avoid infinite loops in while statements!",
              type: "concept",
              duration: 10
            },
            {
              id: 4,
              title: "Practice: Control Flow Exercises",
              content: "Try these exercises:\n1. Write an if statement that checks if a number is even or odd\n2. Create a for loop that prints the first 5 even numbers\n3. Write a while loop that counts down from 10 to 1\n4. Use nested if statements to check multiple conditions",
              type: "practice",
              duration: 15
            },
            {
              id: 5,
              title: "Control Flow Best Practices",
              content: "Key takeaways: Always use proper indentation, avoid deep nesting when possible, use elif instead of multiple if statements for related conditions, and be careful with while loops to prevent infinite loops. Test your conditions thoroughly!",
              type: "summary",
              duration: 4
            }
          ]
        }
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
        ],
        revisionContent: {
          title: "Functions and Scope Revision",
          description: "Comprehensive review of Python functions, parameters, return values, and variable scope concepts.",
          steps: [
            {
              id: 1,
              title: "Function Fundamentals",
              content: "Functions are reusable blocks of code defined with the 'def' keyword. Basic syntax:\ndef function_name(parameters):\n    # function body\n    return value  # optional\n\nFunctions help organize code, avoid repetition, and make programs more modular and maintainable.",
              type: "concept",
              duration: 8
            },
            {
              id: 2,
              title: "Parameters and Arguments",
              content: "Parameters are variables in function definitions, arguments are actual values passed to functions. Types include:\n- Positional arguments: def func(a, b)\n- Keyword arguments: func(a=1, b=2)\n- Default parameters: def func(a, b=10)\n- *args for variable positional arguments\n- **kwargs for variable keyword arguments",
              type: "concept",
              duration: 10
            },
            {
              id: 3,
              title: "Variable Scope Deep Dive",
              content: "Scope determines where variables can be accessed:\n- Local scope: inside functions\n- Global scope: outside all functions\n- Built-in scope: Python's built-in names\n\nPython follows LEGB rule: Local → Enclosing → Global → Built-in. Use 'global' keyword to modify global variables inside functions.",
              type: "concept",
              duration: 12
            },
            {
              id: 4,
              title: "Return Values and Function Design",
              content: "Functions can return values using the 'return' statement. Without return, functions return None. Good practices:\n- Single responsibility principle\n- Clear, descriptive names\n- Proper documentation\n- Handle edge cases\n- Return consistent data types",
              type: "concept",
              duration: 8
            },
            {
              id: 5,
              title: "Hands-on Function Practice",
              content: "Practice exercises:\n1. Create a function that calculates the area of a rectangle\n2. Write a function with default parameters\n3. Create a function that returns multiple values\n4. Practice with local vs global variables\n5. Write a function that calls another function",
              type: "practice",
              duration: 18
            },
            {
              id: 6,
              title: "Functions and Scope Summary",
              content: "Key concepts to remember:\n- Use 'def' to define functions\n- Parameters vs arguments distinction\n- Local variables are created inside functions\n- Global variables are accessible but not modifiable without 'global' keyword\n- Functions should have single, clear purposes\n- Always test your functions with different inputs",
              type: "summary",
              duration: 5
            }
          ]
        }
      }
    ]
  }
];

// Tests data - now redundant since tests are embedded in modules
export const tests: Test[] = [];

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
