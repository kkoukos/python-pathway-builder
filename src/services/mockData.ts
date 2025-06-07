
export interface Exercise {
  id: number;
  type: "multiple-choice" | "code" | "multiple_choice" | "code_completion" | "code_writing" | "debugging";
  question?: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  content: {
    question?: string;
    options?: string[];
    correctOption?: string;
    correctAnswer?: number;
    explanation?: string;
    starterCode?: string;
    solution?: string;
    hints?: string[];
    testCases?: Array<{
      input: string;
      expectedOutput: string;
    }>;
  };
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  initialCode?: string;
  solution?: string;
}

export interface ContentBlock {
  type: "text" | "code" | "image" | "exercise";
  content: string;
}

export interface Lesson {
  id: number;
  title: string;
  content: ContentBlock[];
  exercises?: Exercise[];
}

export interface Test {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  exercises: Exercise[];
}

export interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
  tests?: Test[];
}

export const modules: Module[] = [
  {
    id: 1,
    title: "Introduction to Programming",
    slug: "intro-programming",
    description: "Learn the fundamentals of programming with hands-on exercises and comprehensive tests.",
    lessons: [
      {
        id: 1,
        title: "What is Programming?",
        content: [
          {
            type: "text",
            content: "Programming is the process of creating a set of instructions that tell a computer how to perform a task."
          },
          {
            type: "code",
            content: `// Your first program
console.log("Hello, World!");`
          }
        ],
        exercises: [
          {
            id: 1,
            type: "multiple-choice",
            title: "Console.log Function",
            description: "What does the console.log() function do?",
            difficulty: "easy",
            content: {
              question: "What does the console.log() function do?",
              options: [
                "Prints text to the console",
                "Creates a new variable",
                "Deletes a file",
                "Connects to the internet"
              ],
              correctOption: "Prints text to the console",
              explanation: "console.log() prints the specified message to the console."
            },
            question: "What does the console.log() function do?",
            options: [
              "Prints text to the console",
              "Creates a new variable",
              "Deletes a file",
              "Connects to the internet"
            ],
            correctAnswer: 0,
            explanation: "console.log() prints the specified message to the console."
          }
        ]
      }
    ],
    tests: [
      {
        id: 1,
        title: "Programming Fundamentals Test",
        description: "Test your understanding of basic programming concepts",
        timeLimit: 30,
        passingScore: 70,
        exercises: [
          {
            id: 101,
            type: "multiple-choice",
            title: "Programming Language Question",
            description: "Which of the following is a programming language?",
            difficulty: "easy",
            content: {
              question: "Which of the following is a programming language?",
              options: ["JavaScript", "HTML", "CSS", "All of the above"],
              correctOption: "JavaScript",
              explanation: "JavaScript is a programming language, while HTML and CSS are markup and styling languages."
            },
            question: "Which of the following is a programming language?",
            options: ["JavaScript", "HTML", "CSS", "All of the above"],
            correctAnswer: 0,
            explanation: "JavaScript is a programming language, while HTML and CSS are markup and styling languages."
          },
          {
            id: 102,
            type: "multiple-choice",
            title: "Variable Definition",
            description: "What is a variable in programming?",
            difficulty: "easy",
            content: {
              question: "What is a variable in programming?",
              options: [
                "A container for storing data",
                "A type of loop",
                "A function",
                "An error message"
              ],
              correctOption: "A container for storing data",
              explanation: "A variable is a container for storing data values."
            },
            question: "What is a variable in programming?",
            options: [
              "A container for storing data",
              "A type of loop",
              "A function",
              "An error message"
            ],
            correctAnswer: 0,
            explanation: "A variable is a container for storing data values."
          },
          {
            id: 103,
            type: "code",
            title: "Hello Programming Exercise",
            description: "Write a program that prints 'Hello, Programming!' to the console.",
            difficulty: "easy",
            content: {
              question: "Write a program that prints 'Hello, Programming!' to the console.",
              starterCode: "// Write your code here\n",
              solution: "console.log('Hello, Programming!');",
              explanation: "Use console.log() to print text to the console."
            },
            question: "Write a program that prints 'Hello, Programming!' to the console.",
            initialCode: "// Write your code here\n",
            solution: "console.log('Hello, Programming!');",
            explanation: "Use console.log() to print text to the console."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    slug: "advanced-javascript",
    description: "Master advanced JavaScript concepts including async/await, closures, and more.",
    lessons: [
      {
        id: 2,
        title: "Async/Await and Promises",
        content: [
          {
            type: "text",
            content: "Asynchronous programming allows your code to perform other tasks while waiting for long-running operations to complete."
          }
        ],
        exercises: [
          {
            id: 2,
            type: "code",
            title: "Async Function Exercise",
            description: "Create a simple async function that returns 'Hello World' after 1 second.",
            difficulty: "medium",
            content: {
              question: "Create a simple async function that returns 'Hello World' after 1 second.",
              starterCode: "async function greet() {\n  // Your code here\n}",
              solution: "async function greet() {\n  await new Promise(resolve => setTimeout(resolve, 1000));\n  return 'Hello World';\n}",
              explanation: "Use setTimeout with Promise to create a delay, then return the string."
            },
            question: "Create a simple async function that returns 'Hello World' after 1 second.",
            initialCode: "async function greet() {\n  // Your code here\n}",
            solution: "async function greet() {\n  await new Promise(resolve => setTimeout(resolve, 1000));\n  return 'Hello World';\n}",
            explanation: "Use setTimeout with Promise to create a delay, then return the string."
          }
        ]
      }
    ],
    tests: [
      {
        id: 2,
        title: "Advanced JavaScript Test",
        description: "Test your knowledge of advanced JavaScript concepts",
        timeLimit: 45,
        passingScore: 75,
        exercises: [
          {
            id: 201,
            type: "multiple-choice",
            title: "Await Keyword",
            description: "What does 'await' do in JavaScript?",
            difficulty: "medium",
            content: {
              question: "What does 'await' do in JavaScript?",
              options: [
                "Pauses execution until a Promise resolves",
                "Creates a new Promise",
                "Throws an error",
                "Loops through an array"
              ],
              correctOption: "Pauses execution until a Promise resolves",
              explanation: "The 'await' keyword pauses the execution of an async function until the Promise resolves."
            },
            question: "What does 'await' do in JavaScript?",
            options: [
              "Pauses execution until a Promise resolves",
              "Creates a new Promise",
              "Throws an error",
              "Loops through an array"
            ],
            correctAnswer: 0,
            explanation: "The 'await' keyword pauses the execution of an async function until the Promise resolves."
          },
          {
            id: 202,
            type: "code",
            title: "Fetch API Exercise",
            description: "Write an async function that fetches data from an API.",
            difficulty: "hard",
            content: {
              question: "Write an async function that fetches data from an API.",
              starterCode: "async function fetchData(url) {\n  // Your code here\n}",
              solution: "async function fetchData(url) {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}",
              explanation: "Use fetch() with await to get the response, then convert it to JSON."
            },
            question: "Write an async function that fetches data from an API.",
            initialCode: "async function fetchData(url) {\n  // Your code here\n}",
            solution: "async function fetchData(url) {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}",
            explanation: "Use fetch() with await to get the response, then convert it to JSON."
          }
        ]
      }
    ]
  }
];

export const getModuleBySlug = (slug: string): Module | undefined => {
  return modules.find((module) => module.slug === slug);
};

export const getModuleById = (id: number): Module | undefined => {
  return modules.find((module) => module.id === id);
};

export const getLessonById = (lessonId: number): Lesson | undefined => {
  for (const module of modules) {
    const lesson = module.lessons.find((lesson) => lesson.id === lessonId);
    if (lesson) {
      return lesson;
    }
  }
  return undefined;
};

export const getTestById = (testId: number): Test | undefined => {
  for (const module of modules) {
    if (module.tests) {
      const test = module.tests.find((test) => test.id === testId);
      if (test) {
        return test;
      }
    }
  }
  return undefined;
};

export const getModuleTests = (moduleId: number): Test[] => {
  const module = modules.find(m => m.id === moduleId);
  return module?.tests || [];
};
