
// This file contains mock data for the application
// In a real application, this would come from an API

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

export type ContentBlockType = "text" | "code" | "image" | "exercise";

export interface ContentBlock {
  type: ContentBlockType;
  content: string;
}

export type ExerciseType = "multiple_choice" | "code_completion" | "code_writing" | "debugging" | "output_prediction";
export type ExerciseDifficulty = "easy" | "medium" | "hard";

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface TestCase {
  input?: string;
  expected: string;
  args?: any[];
  function_name?: string;
}

export interface ExerciseContent {
  prompt?: string;
  starterCode?: string;
  solution: string;
  hints?: string[];
  testCases?: TestCase[];
  options?: ExerciseOption[];
  correctOption?: string;
  explanation?: string;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  order: number;
  content: ExerciseContent;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  moduleId: number;
  isComprehensive: boolean;
  exercises?: Exercise[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
}

export interface Lesson {
  id: number;
  title: string;
  content: ContentBlock[];
  exercises?: Exercise[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  slug: string;
  lessons: Lesson[];
}

// Mock user data
export const users: User[] = [
  {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    name: "John Doe",
  },
];

// Mock exercises data
export const exercises: Exercise[] = [
  // Module 1, Lesson 1 exercises
  {
    id: 1,
    title: "Python Version",
    description: "Which statement about Python is correct?",
    type: "multiple_choice",
    difficulty: "easy",
    order: 1,
    content: {
      options: [
        { id: "a", text: "Python 2 is the latest version and most widely used" },
        { id: "b", text: "Python 3 introduced backward-incompatible changes" },
        { id: "c", text: "Python 4 is the latest stable version" },
        { id: "d", text: "Python is not backwards compatible with any previous versions" }
      ],
      correctOption: "b",
      solution: "Python 3 introduced changes that were not backward-compatible with Python 2, which is why there was a longer transition period where both versions were actively used.",
      explanation: "Python 3 was released in 2008 and introduced several backward-incompatible changes like print becoming a function, integer division returning a float, and changes to string handling."
    }
  },
  {
    id: 2,
    title: "Python Characteristics",
    description: "Which of the following is NOT a characteristic of Python?",
    type: "multiple_choice",
    difficulty: "easy",
    order: 2,
    content: {
      options: [
        { id: "a", text: "Interpreted language" },
        { id: "b", text: "Strongly typed" },
        { id: "c", text: "Requires compilation before execution" },
        { id: "d", text: "Supports multiple programming paradigms" }
      ],
      correctOption: "c",
      solution: "Python is an interpreted language that does not require explicit compilation before execution.",
      explanation: "Python code is executed line by line by the Python interpreter. While it does compile to bytecode, this happens automatically and is transparent to the user."
    }
  },
  
  // Module 1, Lesson 2 exercises
  {
    id: 3,
    title: "Hello World",
    description: "Write a program that prints 'Hello, World!' to the console.",
    type: "code_writing",
    difficulty: "easy",
    order: 1,
    content: {
      starterCode: "# Write your code here\n",
      solution: "print('Hello, World!')",
      testCases: [
        {
          expected: "Hello, World!"
        }
      ],
      hints: ["Use the print function", "The print function takes a string as an argument"]
    }
  },
  {
    id: 4,
    title: "Syntax Error",
    description: "Fix the syntax error in the code below.",
    type: "debugging",
    difficulty: "easy",
    order: 2,
    content: {
      starterCode: "print('Hello, World!'",
      solution: "print('Hello, World!')",
      testCases: [
        {
          expected: "Hello, World!"
        }
      ],
      hints: ["Check the parentheses", "All opening parentheses need a closing parenthesis"]
    }
  },
  
  // Module 1, Lesson 3 exercises
  {
    id: 5,
    title: "Input and Output",
    description: "Complete the function to take a name as input and print a greeting.",
    type: "code_completion",
    difficulty: "medium",
    order: 1,
    content: {
      starterCode: "def greet():\n    # Get the user's name\n    name = input('What is your name? ')\n    # Print a greeting\n    # Your code here\n\n# Call the function\ngreet()",
      solution: "def greet():\n    # Get the user's name\n    name = input('What is your name? ')\n    # Print a greeting\n    print(f'Hello, {name}!')\n\n# Call the function\ngreet()",
      testCases: [
        {
          input: "John",
          expected: "Hello, John!"
        }
      ],
      hints: ["Use an f-string to include the name variable in the greeting", "The format is: f'text {variable} more text'"]
    }
  }
];

// Mock tests data
export const tests: Test[] = [
  {
    id: 1,
    title: "Introduction to Python - Assessment",
    description: "Test your understanding of Python basics, including syntax, variables, and basic I/O operations.",
    moduleId: 1,
    isComprehensive: false,
    exercises: [
      exercises[0], // Python Version
      exercises[1], // Python Characteristics
      exercises[2], // Hello World
      exercises[4]  // Input and Output
    ],
    timeLimit: 20, // minutes
    passingScore: 70
  }
];

// Mock modules data
export const modules: Module[] = [
  {
    id: 1,
    title: "Introduction to Python",
    description:
      "Learn the basics of Python programming language, its syntax, and fundamental concepts.",
    slug: "intro-to-python",
    lessons: [
      {
        id: 1,
        title: "What is Python?",
        content: [
          {
            type: "text",
            content:
              "Python is a high-level, interpreted programming language known for its readability and simplicity. Created by Guido van Rossum and first released in 1991, Python has become one of the most popular programming languages in the world.\n\nPython is widely used in various fields such as:\n- Web development\n- Data analysis and visualization\n- Machine learning and artificial intelligence\n- Scientific computing\n- Automation and scripting",
          },
          {
            type: "image",
            content: "https://via.placeholder.com/800x400?text=Python+Logo",
          },
          {
            type: "text",
            content:
              "### Key Features of Python\n\n- **Easy to learn and read**: Python syntax is designed to be readable and straightforward\n- **Interpreted language**: No need to compile the code before execution\n- **Dynamically typed**: No need to declare variable types\n- **Large standard library**: Comes with a vast collection of modules and packages\n- **Cross-platform**: Works on different operating systems like Windows, macOS, and Linux",
          },
          {
            type: "text",
            content:
              "### Python vs Other Programming Languages\n\nCompared to languages like Java or C++, Python offers:\n- Simpler syntax with fewer lines of code\n- No need for curly braces or semicolons\n- Significant whitespace (indentation matters)\n- Less boilerplate code\n- Faster development time\n\nHowever, it may be slower in execution for certain tasks.",
          },
        ],
        exercises: [exercises[0], exercises[1]]
      },
      {
        id: 2,
        title: "Your First Python Program",
        content: [
          {
            type: "text",
            content:
              "Let's start by writing our first Python program - the classic 'Hello, World!' example.",
          },
          {
            type: "code",
            content: "print('Hello, World!')",
          },
          {
            type: "text",
            content:
              "When you run this program, it will display 'Hello, World!' in the console. Let's break down what's happening:\n\n1. `print()` is a built-in Python function\n2. It outputs the content within the parentheses to the console\n3. The text is enclosed in quotes to indicate it's a string (text data)",
          },
          {
            type: "text",
            content:
              "### Python Syntax Basics\n\n- Python uses indentation (whitespace) to define code blocks\n- Statements don't need semicolons at the end\n- Comments start with the `#` symbol\n- Variables don't need type declarations",
          },
          {
            type: "code",
            content:
              "# This is a comment\nname = 'Alice'  # Assigning a string to a variable\nage = 25       # Assigning a number to a variable\n\n# Conditional statement with indentation\nif age >= 18:\n    print(name + ' is an adult.')  # Note the indentation\nelse:\n    print(name + ' is a minor.')",
          },
          {
            type: "text",
            content:
              "### Running Python Code\n\nThere are several ways to run Python code:\n\n1. **Interactive Mode**: Open a terminal/command prompt and type `python` to start the Python interpreter\n2. **Script Mode**: Save your code in a `.py` file and run it with `python filename.py`\n3. **IDEs and Notebooks**: Use environments like PyCharm, VS Code, or Jupyter Notebooks",
          },
        ],
        exercises: [exercises[2], exercises[3]]
      },
      {
        id: 3,
        title: "Basic Input and Output",
        content: [
          {
            type: "text",
            content:
              "### Output with `print()`\n\nWe've already seen the `print()` function in action. It can display text, variables, and even the results of expressions:",
          },
          {
            type: "code",
            content:
              "name = 'Bob'\nage = 30\n\nprint('Hello')                    # Simple string\nprint(name)                     # Variable\nprint('Name:', name, 'Age:', age)  # Multiple values\nprint(f'{name} is {age} years old')  # f-string (formatted string)\nprint(name + ' is ' + str(age) + ' years old')  # Concatenation (requires conversion)",
          },
          {
            type: "text",
            content:
              "### String Formatting\n\nPython offers several ways to format strings:\n\n1. **f-strings** (Python 3.6+): The most readable and recommended way\n2. **format()** method: A flexible option\n3. **%-formatting**: Older style, similar to C language",
          },
          {
            type: "code",
            content:
              "name = 'Charlie'\nscore = 95.5\n\n# f-string (Python 3.6+)\nprint(f'{name} scored {score:.1f} points')\n\n# format() method\nprint('{} scored {:.1f} points'.format(name, score))\n\n# %-formatting (older style)\nprint('%s scored %.1f points' % (name, score))",
          },
          {
            type: "text",
            content: "### Input with `input()`\n\nThe `input()` function allows your program to receive data from the user:",
          },
          {
            type: "code",
            content:
              "# Get input from the user\nname = input('Enter your name: ')\nprint(f'Hello, {name}!')\n\n# Note: input() always returns a string\n# To get a number, you need to convert it\nage_str = input('Enter your age: ')\nage = int(age_str)  # Convert to integer\nprint(f'In 5 years, you will be {age + 5} years old')",
          },
          {
            type: "text",
            content:
              "### Simple Calculation Example\n\nLet's combine input, output, and basic calculations:",
          },
          {
            type: "code",
            content:
              "# Simple calculator\nprint('Simple Calculator')\nprint('-----------------')\n\n# Get input\nnum1 = float(input('Enter first number: '))\nnum2 = float(input('Enter second number: '))\n\n# Perform calculations\nsum_result = num1 + num2\ndiff_result = num1 - num2\nprod_result = num1 * num2\n\n# Handle division (avoid division by zero)\nif num2 != 0:\n    div_result = num1 / num2\nelse:\n    div_result = 'undefined (division by zero)'\n\n# Display results\nprint(f'Sum: {sum_result}')\nprint(f'Difference: {diff_result}')\nprint(f'Product: {prod_result}')\nprint(f'Division: {div_result}')",
          },
          {
            type: "exercise",
            content:
              "Try creating a temperature converter that asks for a temperature in Celsius and converts it to Fahrenheit (Formula: F = C × 9/5 + 32).",
          },
        ],
        exercises: [exercises[4]]
      },
    ],
  },
  {
    id: 2,
    title: "Python Fundamentals",
    description:
      "Explore the fundamental concepts of Python including variables, data types, operators, and control flow structures.",
    slug: "python-fundamentals",
    lessons: [
      {
        id: 4,
        title: "Variables and Data Types",
        content: [
          {
            type: "text",
            content:
              "### Introduction to Variables\n\nVariables are used to store data values. In Python, you can think of variables as labeled boxes that hold data. Unlike some other languages, Python variables:\n\n- Don't need to be declared with any particular type\n- Can change type after they've been set\n- Must be assigned before they can be used",
          },
          {
            type: "code",
            content:
              "# Creating variables\nname = 'David'       # String\nage = 25             # Integer\nheight = 1.85        # Float\nis_student = True    # Boolean\n\n# You can change a variable's type\nx = 10\nprint(x)       # 10 (integer)\nx = 'hello'\nprint(x)       # hello (string)\n\n# Multiple assignment\na, b, c = 5, 3.2, 'Hello'\nprint(a, b, c)  # 5 3.2 Hello\n\n# Swapping values\na, b = b, a\nprint(a, b)     # 3.2 5",
          },
          {
            type: "text",
            content:
              "### Basic Data Types\n\nPython has several built-in data types:\n\n1. **Numeric Types**:\n   - `int`: Integer numbers (e.g., 5, -17, 0)\n   - `float`: Floating-point numbers (e.g., 3.14, -0.001, 2.0)\n   - `complex`: Complex numbers (e.g., 1+2j)\n\n2. **Boolean Type**:\n   - `bool`: Either True or False\n\n3. **Sequence Types**:\n   - `str`: String - ordered sequence of characters (e.g., 'hello')\n   - `list`: Ordered, mutable collection (e.g., [1, 2, 3])\n   - `tuple`: Ordered, immutable collection (e.g., (1, 2, 3))\n\n4. **Mapping Type**:\n   - `dict`: Key-value pairs (e.g., {'name': 'John', 'age': 30})\n\n5. **Set Types**:\n   - `set`: Unordered collection of unique items (e.g., {1, 2, 3})\n   - `frozenset`: Immutable version of set",
          },
          {
            type: "code",
            content:
              "# Checking data types with type()\nprint(type(25))         # <class 'int'>\nprint(type(3.14))       # <class 'float'>\nprint(type('hello'))    # <class 'str'>\nprint(type(True))       # <class 'bool'>\nprint(type([1, 2, 3]))  # <class 'list'>\n\n# String examples\nsingle_quotes = 'Hello'\ndouble_quotes = \"World\"\ntriple_quotes = \"\"\"This is a multi-line\nstring that can span\nmultiple lines.\"\"\"\n\n# List example\nmy_list = [10, 'hello', True, 3.14]\nprint(my_list[0])      # 10\nprint(my_list[1:3])    # ['hello', True]\n\n# Tuple example\nmy_tuple = (10, 'hello', True)\n\n# Dictionary example\nmy_dict = {'name': 'Emma', 'age': 28, 'city': 'London'}\nprint(my_dict['name'])  # Emma",
          },
          {
            type: "text",
            content:
              "### Type Conversion\n\nPython provides functions to convert between data types:",
          },
          {
            type: "code",
            content:
              "# Type conversion examples\n\n# String to int/float\nnum_str = '25'\nnum_int = int(num_str)    # 25\nnum_float = float(num_str)  # 25.0\n\n# Number to string\nx = 100\nx_str = str(x)         # '100'\n\n# Float to int (truncates decimal part)\ny = 3.7\ny_int = int(y)         # 3 (not rounded!)\n\n# Bool conversions\nprint(bool(0))          # False\nprint(bool(1))          # True\nprint(bool(''))         # False\nprint(bool('hello'))    # True\nprint(int(True))        # 1\nprint(int(False))       # 0",
          },
          {
            type: "exercise",
            content:
              "Try creating different variables with various data types and practice conversion between them. For example, convert a float to an integer and then to a string.",
          },
        ],
      },
      {
        id: 5,
        title: "Operators",
        content: [
          {
            type: "text",
            content:
              "### Arithmetic Operators\n\nPython supports all standard arithmetic operations:",
          },
          {
            type: "code",
            content:
              "a = 10\nb = 3\n\n# Basic arithmetic\nprint(a + b)    # 13 (addition)\nprint(a - b)    # 7 (subtraction)\nprint(a * b)    # 30 (multiplication)\nprint(a / b)    # 3.3333... (division, always returns float)\nprint(a // b)   # 3 (floor division, returns int)\nprint(a % b)    # 1 (modulus - remainder after division)\nprint(a ** b)   # 1000 (exponentiation - a raised to power of b)",
          },
          {
            type: "text",
            content:
              "### Assignment Operators\n\nPython provides shorthand operators for updating variables:",
          },
          {
            type: "code",
            content:
              "x = 10\n\nx += 5      # Same as: x = x + 5 (x becomes 15)\nprint(x)     # 15\n\nx -= 3      # Same as: x = x - 3 (x becomes 12)\nprint(x)     # 12\n\nx *= 2      # Same as: x = x * 2 (x becomes 24)\nprint(x)     # 24\n\nx /= 4      # Same as: x = x / 4 (x becomes 6.0)\nprint(x)     # 6.0\n\nx //= 2     # Same as: x = x // 2 (x becomes 3.0)\nprint(x)     # 3.0\n\ny = 7\ny %= 3      # Same as: y = y % 3 (y becomes 1)\nprint(y)     # 1\n\nz = 2\nz **= 3     # Same as: z = z ** 3 (z becomes 8)\nprint(z)     # 8",
          },
          {
            type: "text",
            content:
              "### Comparison Operators\n\nUsed to compare values, these operators return boolean results (True or False):",
          },
          {
            type: "code",
            content:
              "a = 10\nb = 5\nc = 10\n\nprint(a == b)    # False (equal to)\nprint(a != b)    # True (not equal to)\nprint(a > b)     # True (greater than)\nprint(a < b)     # False (less than)\nprint(a >= c)    # True (greater than or equal to)\nprint(b <= a)    # True (less than or equal to)",
          },
          {
            type: "text",
            content:
              "### Logical Operators\n\nUsed to combine conditional statements:",
          },
          {
            type: "code",
            content:
              "x = 10\ny = 5\n\n# and - True if both statements are true\nprint(x > 5 and y < 10)    # True\nprint(x > 15 and y < 10)   # False\n\n# or - True if at least one statement is true\nprint(x > 15 or y < 10)    # True\nprint(x > 15 or y > 10)    # False\n\n# not - Reverses the result\nprint(not(x > 15))         # True\nprint(not(x > 5))          # False",
          },
          {
            type: "text",
            content:
              "### Identity and Membership Operators\n\n- **Identity operators** check if objects are the same (is, is not)\n- **Membership operators** check if a value is present in a sequence (in, not in)",
          },
          {
            type: "code",
            content:
              "# Identity operators\na = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a is c)      # True (a and c reference the same object)\nprint(a is b)      # False (a and b are equal but different objects)\nprint(a is not b)  # True\n\n# Membership operators\nfruit = 'apple'\nfruits = ['apple', 'banana', 'cherry']\n\nprint('a' in fruit)        # True ('a' is in 'apple')\nprint('z' in fruit)        # False ('z' is not in 'apple')\nprint('banana' in fruits)  # True ('banana' is in the list)\nprint('mango' not in fruits)  # True ('mango' is not in the list)",
          },
          {
            type: "text",
            content:
              "### Operator Precedence\n\nPython follows mathematical conventions for operator precedence (order of operations). When in doubt, use parentheses to make your intention clear.",
          },
          {
            type: "code",
            content:
              "# Operator precedence examples\nresult1 = 10 + 5 * 2      # 20 (multiplication before addition)\nresult2 = (10 + 5) * 2    # 30 (parentheses first)\n\n# Complex example\nresult3 = 10 + 3 * 2 ** 2 / 6  # 12.0 (follows precedence rules)\n\n# Breaking it down:\n# 1. 2 ** 2 = 4 (exponentiation)\n# 2. 3 * 4 = 12 (multiplication)\n# 3. 12 / 6 = 2.0 (division)\n# 4. 10 + 2.0 = 12.0 (addition)\n\n# Using parentheses for clarity\nresult4 = 10 + ((3 * (2 ** 2)) / 6)  # 12.0 (same result, clearer intent)",
          },
          {
            type: "exercise",
            content:
              "Create expressions using different operators and predict their outcome before running the code. Try combining arithmetic, comparison, and logical operators in various ways.",
          },
        ],
      },
      {
        id: 6,
        title: "Control Flow",
        content: [
          {
            type: "text",
            content:
              "### Conditional Statements\n\nConditional statements let your program make decisions based on certain conditions.",
          },
          {
            type: "code",
            content:
              "# Basic if statement\nage = 18\nif age >= 18:\n    print('You are an adult')\n    \n# if-else statement\ntemperature = 15\nif temperature > 25:\n    print('It\\'s warm outside')\nelse:\n    print('It\\'s not very warm today')\n    \n# if-elif-else statement\ngrade = 85\nif grade >= 90:\n    print('A grade')\nelif grade >= 80:\n    print('B grade')\nelif grade >= 70:\n    print('C grade')\nelif grade >= 60:\n    print('D grade')\nelse:\n    print('Failed')",
          },
          {
            type: "text",
            content:
              "### Nested Conditions\n\nYou can place conditional statements inside other conditional statements:",
          },
          {
            type: "code",
            content:
              "age = 25\nhas_license = True\n\nif age >= 18:\n    print('Age requirement passed')\n    if has_license:\n        print('You can drive')\n    else:\n        print('You need to get a license first')\nelse:\n    print('You are too young to drive')",
          },
          {
            type: "text",
            content:
              "### Ternary Operator (Conditional Expression)\n\nA shorthand way to write simple if-else statements:",
          },
          {
            type: "code",
            content:
              "# Regular if-else\nage = 20\nif age >= 18:\n    status = 'adult'\nelse:\n    status = 'minor'\nprint(status)  # 'adult'\n\n# Ternary operator version\nage = 15\nstatus = 'adult' if age >= 18 else 'minor'\nprint(status)  # 'minor'",
          },
          {
            type: "text",
            content:
              "### Boolean Expressions\n\nConditional statements rely on boolean expressions that evaluate to either True or False:",
          },
          {
            type: "code",
            content:
              "# Simple boolean expressions\nx = 10\ny = 5\n\nprint(x > y)       # True\nprint(x == y)      # False\n\n# Compound boolean expressions\nprint(x > 5 and y < 10)     # True (both conditions are True)\nprint(x > 15 or y < 10)     # True (at least one condition is True)\nprint(not(x > y))           # False (negation of True is False)\n\n# Truthy and Falsy values\n# Empty sequences/collections and zero values are considered False\nif 0:\n    print('This won\'t print')\n    \nif []:\n    print('This won\'t print either')\n    \nif 42:\n    print('This will print')  # Any non-zero number is True\n    \nif 'hello':\n    print('This will print too')  # Non-empty strings are True",
          },
          {
            type: "text",
            content:
              "### Common Patterns with Conditionals\n\nHere are some common patterns you'll encounter:",
          },
          {
            type: "code",
            content:
              "# Checking if a value is in a range\nage = 25\nif 18 <= age <= 65:\n    print('Working age')  # This is a nice Python feature!\n\n# Checking multiple conditions with logical operators\nweekend = True\nholiday = False\nif weekend or holiday:\n    print('Day off!')\nelse:\n    print('Work day')\n\n# Checking multiple options\nfruit = 'apple'\nif fruit in ['apple', 'banana', 'cherry']:\n    print('This is a fruit we have')\n\n# Using 'is' vs '==' for specific cases\nx = None\nif x is None:  # Better than x == None for checking None\n    print('x has no value')",
          },
          {
            type: "exercise",
            content:
              "Write a program that takes a temperature value and a unit ('C' or 'F') as input, then outputs whether it's freezing (below 0°C or 32°F), cold (0-15°C or 32-59°F), moderate (15-25°C or 59-77°F), or hot (above 25°C or 77°F).",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Python Data Structures",
    description:
      "Dive into Python's built-in data structures like lists, dictionaries, tuples, and sets.",
    slug: "python-data-structures",
    lessons: [
      {
        id: 7,
        title: "Lists and Tuples",
        content: [
          {
            type: "text",
            content:
              "Coming soon: Learn about Python's sequence data types - lists and tuples.",
          },
        ],
      },
    ],
  },
];

// Helper functions to get data

export function getModules(): Module[] {
  return modules;
}

export function getModuleById(id: number): Module | undefined {
  return modules.find((module) => module.id === id);
}

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find((module) => module.slug === slug);
}

export function getLessonById(id: number): Lesson | undefined {
  for (const module of modules) {
    const lesson = module.lessons.find((lesson) => lesson.id === id);
    if (lesson) {
      return lesson;
    }
  }
  return undefined;
}

export function getExerciseById(id: number): Exercise | undefined {
  return exercises.find((exercise) => exercise.id === id);
}

export function getModuleTests(moduleId: number): Test[] {
  return tests.filter((test) => test.moduleId === moduleId);
}

export function getTestById(id: number): Test | undefined {
  return tests.find((test) => test.id === id);
}

