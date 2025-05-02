
export type Module = {
  id: number;
  title: string;
  description: string;
  order: number;
  slug: string;
  is_active: boolean;
  lessons: Lesson[];
};

export type Lesson = {
  id: number;
  module_id: number;
  title: string;
  content: ContentBlock[];
  order: number;
};

export type ContentBlock = {
  type: 'text' | 'code' | 'image' | 'exercise';
  content: string;
  language?: string;
};

// Mock data for the modules and lessons
export const modules: Module[] = [
  {
    id: 1,
    title: "Introduction to Python",
    description: "Learn the basics of Python programming language, including syntax, variables, and basic operations.",
    order: 1,
    slug: "introduction-to-python",
    is_active: true,
    lessons: [
      {
        id: 1,
        module_id: 1,
        title: "What is Python?",
        order: 1,
        content: [
          {
            type: "text",
            content: "Python is a high-level, interpreted programming language created by Guido van Rossum and first released in 1991. It emphasizes code readability with its notable use of significant whitespace. Its language constructs and object-oriented approach aim to help programmers write clear, logical code for small and large-scale projects."
          },
          {
            type: "text",
            content: "Python is dynamically typed and garbage-collected. It supports multiple programming paradigms, including structured (particularly procedural), object-oriented, and functional programming."
          },
          {
            type: "text",
            content: "Key features of Python include:"
          },
          {
            type: "text",
            content: "- Simple, easy to learn syntax\n- Readable and maintainable code\n- Extensive standard library\n- Interpreted nature\n- Dynamic typing\n- Object-oriented\n- Free and open source"
          },
          {
            type: "image",
            content: "/placeholder.svg"
          },
          {
            type: "text",
            content: "Python is often compared favorably to other languages like Java, C++, and JavaScript. It's particularly known for its readability and simplicity, making it an excellent choice for beginners."
          }
        ]
      },
      {
        id: 2,
        module_id: 1,
        title: "Your First Python Program",
        order: 2,
        content: [
          {
            type: "text",
            content: "Let's start by creating your first Python program - the classic 'Hello, World!' example."
          },
          {
            type: "code",
            content: "# This is a comment\nprint('Hello, World!')",
            language: "python"
          },
          {
            type: "text",
            content: "Running this program will output the text 'Hello, World!' to the console. Let's break down what's happening:"
          },
          {
            type: "text",
            content: "- The first line is a comment. In Python, comments start with the # symbol. The interpreter ignores these lines.\n- The second line uses the print() function, which outputs the provided text to the screen."
          },
          {
            type: "text",
            content: "Setting up your development environment:"
          },
          {
            type: "text",
            content: "1. Download and install Python from python.org\n2. Choose a code editor (VS Code, PyCharm, etc.)\n3. Open a new file and save it with a .py extension\n4. Write your code and run it"
          },
          {
            type: "exercise",
            content: "Try modifying the 'Hello, World!' program to display your name instead."
          }
        ]
      },
      {
        id: 3,
        module_id: 1,
        title: "Basic Input and Output",
        order: 3,
        content: [
          {
            type: "text",
            content: "In this lesson, we'll learn how to get input from users and display output in Python."
          },
          {
            type: "text",
            content: "The print() function is used to display output. We've already seen it in action in our 'Hello, World!' example."
          },
          {
            type: "code",
            content: "print('Hello!')\nprint('Multiple', 'arguments', 'are', 'separated', 'by', 'commas')\nprint('Numbers too:', 42)",
            language: "python"
          },
          {
            type: "text",
            content: "The input() function allows us to get user input from the keyboard:"
          },
          {
            type: "code",
            content: "name = input('Enter your name: ')\nprint('Hello,', name)",
            language: "python"
          },
          {
            type: "text",
            content: "String formatting in Python gives us several ways to embed variables in strings:"
          },
          {
            type: "code",
            content: "# Using f-strings (Python 3.6+)\nname = 'Alice'\nage = 25\nprint(f'{name} is {age} years old')\n\n# Using .format() method\nprint('{} is {} years old'.format(name, age))\n\n# Using % operator (older style)\nprint('%s is %d years old' % (name, age))",
            language: "python"
          },
          {
            type: "text",
            content: "Let's create a simple calculator program that takes two numbers as input and displays their sum:"
          },
          {
            type: "code",
            content: "# Simple calculator\nnum1 = float(input('Enter first number: '))\nnum2 = float(input('Enter second number: '))\n\nsum_result = num1 + num2\nprint(f'The sum of {num1} and {num2} is {sum_result}')",
            language: "python"
          },
          {
            type: "text",
            content: "Note that input() always returns a string, so we use float() to convert the input to a number before performing arithmetic operations."
          }
        ]
      }
    ]
  }
];

// Helper function to get a module by slug
export const getModuleBySlug = (slug: string): Module | undefined => {
  return modules.find(module => module.slug === slug);
};

// Helper function to get a lesson by id
export const getLessonById = (lessonId: number): Lesson | undefined => {
  for (const module of modules) {
    const lesson = module.lessons.find(lesson => lesson.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
};
