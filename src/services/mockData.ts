
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

export type ExerciseType =
  | "multiple_choice"
  | "code_completion"
  | "code_writing"
  | "debugging"
  | "output_prediction";
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
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  exercises: Exercise[];
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
  tests?: Test[]; // Add tests property as optional
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
        {
          id: "a",
          text: "Python 2 is the latest version and most widely used",
        },
        { id: "b", text: "Python 3 introduced backward-incompatible changes" },
        { id: "c", text: "Python 4 is the latest stable version" },
        {
          id: "d",
          text: "Python is not backwards compatible with any previous versions",
        },
      ],
      correctOption: "b",
      solution:
        "Python 3 introduced changes that were not backward-compatible with Python 2, which is why there was a longer transition period where both versions were actively used.",
      explanation:
        "Python 3 was released in 2008 and introduced several backward-incompatible changes like print becoming a function, integer division returning a float, and changes to string handling.",
    },
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
        { id: "d", text: "Supports multiple programming paradigms" },
      ],
      correctOption: "c",
      solution:
        "Python is an interpreted language that does not require explicit compilation before execution.",
      explanation:
        "Python code is executed line by line by the Python interpreter. While it does compile to bytecode, this happens automatically and is transparent to the user.",
    },
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
          expected: "Hello, World!",
        },
      ],
      hints: [
        "Use the print function",
        "The print function takes a string as an argument",
      ],
    },
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
          expected: "Hello, World!",
        },
      ],
      hints: [
        "Check the parentheses",
        "All opening parentheses need a closing parenthesis",
      ],
    },
  },

  // Module 1, Lesson 3 exercises
  {
    id: 5,
    title: "Input and Output",
    description:
      "Complete the function to take a name as input and print a greeting.",
    type: "code_completion",
    difficulty: "medium",
    order: 1,
    content: {
      starterCode:
        "def greet():\n    # Get the user's name\n    name = input('What is your name? ')\n    # Print a greeting\n    # Your code here\n\n# Call the function\ngreet()",
      solution:
        "def greet():\n    # Get the user's name\n    name = input('What is your name? ')\n    # Print a greeting\n    print(f'Hello, {name}!')\n\n# Call the function\ngreet()",
      testCases: [
        {
          input: "John",
          expected: "Hello, John!",
        },
      ],
      hints: [
        "Use an f-string to include the name variable in the greeting",
        "The format is: f'text {variable} more text'",
      ],
    },
  },
  {
    id: 6,
    title: "Temperature Converter",
    description: "Create a program that converts Celsius to Fahrenheit.",
    type: "code_writing",
    difficulty: "medium",
    order: 2,
    content: {
      starterCode:
        "# Create a program that converts Celsius to Fahrenheit\n# Formula: F = C × 9/5 + 32\n\n# Your code here\n",
      solution:
        "# Create a program that converts Celsius to Fahrenheit\n# Formula: F = C × 9/5 + 32\n\ncelsius = float(input('Enter temperature in Celsius: '))\nfahrenheit = celsius * 9/5 + 32\nprint(f'{celsius}°C is equal to {fahrenrenheit:.1f}°F')",
      testCases: [
        {
          input: "0",
          expected: "0°C is equal to 32.0°F",
        },
        {
          input: "100",
          expected: "100°C is equal to 212.0°F",
        },
      ],
      hints: [
        "Use the formula F = C × 9/5 + 32",
        "Remember to convert the input string to a float",
        "Use an f-string for formatted output",
      ],
    },
  },
  {
    id: 7,
    title: "Variable Types",
    description: "What will be the output of the following code?",
    type: "output_prediction",
    difficulty: "easy",
    order: 1,
    content: {
      starterCode: "x = 5\ny = '10'\nprint(x + int(y))\nprint(str(x) + y)",
      solution: "15\n510",
      explanation:
        "In the first print statement, the string '10' is converted to an integer and added to x (5 + 10 = 15). In the second print statement, the integer 5 is converted to a string and concatenated with '10', resulting in '510'.",
    },
  },
  {
    id: 8,
    title: "Operator Precedence",
    description:
      "Evaluate the expression 2 * (2 ** 3 + 1) - 1 using the correct order of operations.",
    type: "multiple_choice",
    difficulty: "medium",
    order: 3,
    content: {
      options: [
        { id: "a", text: "15" },
        { id: "b", text: "17" },
        { id: "c", text: "23" },
        { id: "d", text: "47" },
      ],
      correctOption: "b",
      solution:
        "The expression follows the order of operations: 2 ** 3 = 8, then 8 + 1 = 9, then 2 * 9 = 18, then 18 - 1 = 17.",
      explanation:
        "The expression 2 * (2 ** 3 + 1) - 1 is evaluated following PEMDAS: Parentheses, Exponents, Multiplication/Division (from left to right), Addition/Subtraction (from left to right).",
      prompt: "What is the value of the expression: 2 * (2 ** 3 + 1) - 1",
    },
  },
  {
    id: 9,
    title: "Combining Operators",
    description: "Debug the following code to make it work correctly.",
    type: "debugging",
    difficulty: "medium",
    order: 4,
    content: {
      starterCode:
        "# Code should check if a number is between 10 and 20 inclusive\nnumber = int(input('Enter a number: '))\nif 10 <= number or number <= 20:\n    print('Number is in range')\nelse:\n    print('Number is out of range')",
      solution:
        "# Code should check if a number is between 10 and 20 inclusive\nnumber = int(input('Enter a number: '))\nif 10 <= number and number <= 20:\n    print('Number is in range')\nelse:\n    print('Number is out of range')",
      testCases: [
        {
          input: "15",
          expected: "Number is in range",
        },
        {
          input: "25",
          expected: "Number is out of range",
        },
      ],
      hints: [
        "Check the logical operator being used",
        "To be in range, the number must satisfy both conditions",
      ],
    },
  },
  {
    id: 10,
    title: "Grade Calculator",
    description:
      "Complete the function to calculate a letter grade based on a numerical score.",
    type: "code_completion",
    difficulty: "medium",
    order: 2,
    content: {
      starterCode:
        "def calculate_grade(score):\n    # A: 90-100\n    # B: 80-89\n    # C: 70-79\n    # D: 60-69\n    # F: below 60\n    \n    # Your code here\n    \n    return grade\n\n# Test the function\nscore = int(input('Enter a score: '))\nprint(f'Grade: {calculate_grade(score)}')",
      solution:
        "def calculate_grade(score):\n    # A: 90-100\n    # B: 80-89\n    # C: 70-79\n    # D: 60-69\n    # F: below 60\n    \n    if score >= 90:\n        grade = 'A'\n    elif score >= 80:\n        grade = 'B'\n    elif score >= 70:\n        grade = 'C'\n    elif score >= 60:\n        grade = 'D'\n    else:\n        grade = 'F'\n    \n    return grade\n\n# Test the function\nscore = int(input('Enter a score: '))\nprint(f'Grade: {calculate_grade(score)}')",
      testCases: [
        {
          input: "95",
          expected: "Grade: A",
        },
        {
          input: "78",
          expected: "Grade: C",
        },
        {
          input: "55",
          expected: "Grade: F",
        },
      ],
      hints: [
        "Use if-elif-else structure",
        "Start with the highest grade first",
        "Each condition should check if the score is greater than or equal to the threshold",
      ],
    },
  },
  {
    id: 11,
    title: "List Operations",
    description: "Complete the code to perform various list operations.",
    type: "code_completion",
    difficulty: "medium",
    order: 1,
    content: {
      starterCode:
        "# Create a list of fruits\nfruits = ['apple', 'banana', 'cherry']\n\n# 1. Add 'orange' to the end of the list\n# Your code here\n\n# 2. Insert 'mango' at position 1\n# Your code here\n\n# 3. Remove 'cherry' from the list\n# Your code here\n\n# 4. Print all fruits using a loop\n# Your code here\n\n# 5. Print the number of fruits in the list\n# Your code here",
      solution:
        "# Create a list of fruits\nfruits = ['apple', 'banana', 'cherry']\n\n# 1. Add 'orange' to the end of the list\nfruits.append('orange')\n\n# 2. Insert 'mango' at position 1\nfruits.insert(1, 'mango')\n\n# 3. Remove 'cherry' from the list\nfruits.remove('cherry')\n\n# 4. Print all fruits using a loop\nfor fruit in fruits:\n    print(fruit)\n\n# 5. Print the number of fruits in the list\nprint(f'Number of fruits: {len(fruits)}')",
      testCases: [
        {
          expected: "apple\nmango\nbanana\norange\nNumber of fruits: 4",
        },
      ],
      hints: [
        "Use append() to add an item to the end",
        "Use insert(position, item) to add at a specific position",
        "Use remove() to remove an item by value",
        "Use a for loop to iterate through the list",
        "Use len() to get the list length",
      ],
    },
  },
  {
    id: 12,
    title: "Create a Simple Function",
    description:
      "Create a function that takes a name as a parameter and returns a greeting message.",
    type: "code_writing",
    difficulty: "easy",
    order: 1,
    content: {
      starterCode:
        "# Create a function named 'create_greeting' that takes a name parameter\n# and returns 'Hello, {name}!'\n\n# Your code here\n",
      solution:
        "# Create a function named 'create_greeting' that takes a name parameter\n# and returns 'Hello, {name}!'\n\ndef create_greeting(name):\n    return f'Hello, {name}!'\n\n# Test the function\nprint(create_greeting('Alice'))",
      testCases: [
        {
          input: "Alice",
          expected: "Hello, Alice!",
        },
        {
          input: "World",
          expected: "Hello, World!",
        },
      ],
      hints: [
        "Use the def keyword to define your function",
        "Use an f-string to incorporate the name into the greeting",
        "Don't forget to use the return keyword",
      ],
    },
  },
  {
    id: 13,
    title: "Default and Keyword Parameters",
    description:
      "Complete the function that calculates the total price with optional discount and tax.",
    type: "code_completion",
    difficulty: "medium",
    order: 1,
    content: {
      starterCode:
        "def calculate_total(price, discount=0, tax_rate=0.08):\n    # Calculate the price after discount\n    # Your code here\n    \n    # Add tax\n    # Your code here\n    \n    return final_price\n\n# Test cases\nprint(calculate_total(100))  # With default discount and tax\nprint(calculate_total(100, 0.1))  # With 10% discount\nprint(calculate_total(100, 0.2, 0.05))  # With 20% discount and 5% tax",
      solution:
        "def calculate_total(price, discount=0, tax_rate=0.08):\n    # Calculate the price after discount\n    discounted_price = price * (1 - discount)\n    \n    # Add tax\n    final_price = discounted_price * (1 + tax_rate)\n    \n    return final_price\n\n# Test cases\nprint(calculate_total(100))  # With default discount and tax\nprint(calculate_total(100, 0.1))  # With 10% discount\nprint(calculate_total(100, 0.2, 0.05))  # With 20% discount and 5% tax",
      testCases: [
        {
          expected: "108.0\n97.2\n84.0",
        },
      ],
      hints: [
        "For a discount of 10% (0.1), multiply the price by (1 - 0.1)",
        "For a tax rate of 8% (0.08), multiply the discounted price by (1 + 0.08)",
        "Make sure to apply the discount before adding tax",
      ],
    },
  },
  {
    id: 14,
    title: "Function Documentation",
    description:
      "Add a docstring to the given function following best practices.",
    type: "code_completion",
    difficulty: "easy",
    order: 1,
    content: {
      starterCode:
        "def calculate_bmi(weight, height):\n    # Add a proper docstring here\n    \n    # Convert height from cm to meters if needed\n    if height > 3:\n        height = height / 100\n        \n    # Calculate BMI\n    bmi = weight / (height ** 2)\n    return round(bmi, 1)",
      solution:
        'def calculate_bmi(weight, height):\n    """Calculate the Body Mass Index (BMI).\n    \n    Args:\n        weight (float): Weight in kilograms.\n        height (float): Height in meters or centimeters.\n            If height > 3, it\'s assumed to be in centimeters and will be converted.\n    \n    Returns:\n        float: The calculated BMI, rounded to 1 decimal place.\n    """\n    \n    # Convert height from cm to meters if needed\n    if height > 3:\n        height = height / 100\n        \n    # Calculate BMI\n    bmi = weight / (height ** 2)\n    return round(bmi, 1)',
      testCases: [
        {
          expected:
            "Function should include a properly formatted docstring with Args and Returns sections.",
        },
      ],
      hints: [
        "Include a brief description of what the function does",
        "Document each parameter with its type and meaning",
        "Document the return value with its type and meaning",
        "Mention that height can be in cm or meters and how it's handled",
      ],
    },
  },
];

// Mock tests data
export const tests: Test[] = [
  {
    id: 1,
    title: "Introduction to Python - Assessment",
    description:
      "Test your understanding of Python basics, including syntax, variables, and basic I/O operations.",
    exercises: [
      exercises[0], // Python Version
      exercises[1], // Python Characteristics
      exercises[2], // Hello World
      exercises[4], // Input and Output
    ],
    timeLimit: 20, // minutes
    passingScore: 70,
  },
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
        exercises: [exercises[0], exercises[1]],
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
        exercises: [exercises[2], exercises[3]],
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
            content:
              "### Input with `input()`\n\nThe `input()` function allows your program to receive data from the user:",
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
        exercises: [exercises[4], exercises[6]],
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
        exercises: [exercises[7]],
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
        exercises: [exercises[8], exercises[9]],
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
              "# Simple boolean expressions\nx = 10\ny = 5\n\nprint(x > y)       # True\nprint(x == y)      # False\n\n# Compound boolean expressions\nprint(x > 5 and y < 10)     # True (both conditions are True)\nprint(x > 15 or y < 10)     # True (at least one condition is True)\nprint(not(x > y))           # False (negation of True is False)\n\n# Truthy and Falsy values\n# Empty sequences/collections and zero values are considered False\nif 0:\n    print('This won't print')\n    \nif []:\n    print('This won't print either')\n    \nif 42:\n    print('This will print')  # Any non-zero number is True\n    \nif 'hello':\n    print('This will print too')  # Non-empty strings are True",
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
        exercises: [exercises[10]],
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
        exercises: [exercises[11]],
      },
    ],
  },
  {
    id: 4,
    title: "Python Functions",
    description:
      "Learn how to create, use, and optimize functions in Python to make your code more modular and reusable.",
    slug: "python-functions",
    lessons: [
      {
        id: 8,
        title: "Introduction to Functions",
        content: [
          {
            type: "text",
            content:
              "### What are Functions?\n\nFunctions are reusable blocks of code that perform a specific task. They help you organize your code, make it more readable, and avoid repetition. In Python, functions are defined using the `def` keyword.",
          },
          {
            type: "code",
            content:
              "# Basic function definition\ndef greet():\n    print('Hello, World!')\n\n# Function call\ngreet()  # Output: Hello, World!",
          },
          {
            type: "text",
            content:
              "### Function Parameters and Arguments\n\nFunctions can accept input values called parameters. When you call a function and pass values, these are called arguments.",
          },
          {
            type: "code",
            content:
              "# Function with parameters\ndef greet_person(name):\n    print(f'Hello, {name}!')\n\n# Call with an argument\ngreet_person('Alice')  # Output: Hello, Alice!\ngreet_person('Bob')    # Output: Hello, Bob!",
          },
          {
            type: "text",
            content:
              "### Return Values\n\nFunctions can return values using the `return` statement. This allows a function to compute a result and give it back to the caller.",
          },
          {
            type: "code",
            content:
              "# Function with a return value\ndef add(a, b):\n    return a + b\n\n# Using the returned value\nresult = add(5, 3)\nprint(result)  # Output: 8\n\n# You can also use the return value directly\nprint(add(10, 20))  # Output: 30",
          },
          {
            type: "text",
            content:
              "### Multiple Return Values\n\nPython functions can return multiple values as a tuple.",
          },
          {
            type: "code",
            content:
              "# Function returning multiple values\ndef calculate(a, b):\n    sum_result = a + b\n    diff_result = a - b\n    product_result = a * b\n    return sum_result, diff_result, product_result\n\n# Storing all returned values\nsum_val, diff_val, product_val = calculate(10, 5)\nprint(f'Sum: {sum_val}, Difference: {diff_val}, Product: {product_val}')\n# Output: Sum: 15, Difference: 5, Product: 50\n\n# Or you can store them as a tuple\nresults = calculate(10, 5)\nprint(results)  # Output: (15, 5, 50)\nprint(results[0])  # Output: 15 (accessing the first value)",
          },
        ],
        exercises: [exercises[12]],
      },
      {
        id: 9,
        title: "Function Parameters",
        content: [
          {
            type: "text",
            content:
              "### Types of Parameters\n\nPython supports several types of function parameters:\n\n1. **Required parameters**: Must be provided when calling the function\n2. **Default parameters**: Have predefined values if not provided\n3. **Keyword arguments**: Specified by parameter name\n4. **Variable-length arguments**: Accept an arbitrary number of arguments",
          },
          {
            type: "code",
            content:
              "# Default parameters\ndef greet(name, greeting='Hello'):\n    print(f'{greeting}, {name}!')\n\ngreet('Alice')             # Output: Hello, Alice!\ngreet('Bob', 'Hi there')   # Output: Hi there, Bob!",
          },
          {
            type: "text",
            content:
              "### Keyword Arguments\n\nYou can specify arguments by parameter name, which makes your code more readable and allows you to provide arguments in any order.",
          },
          {
            type: "code",
            content:
              "def describe_person(name, age, city):\n    print(f'{name} is {age} years old and lives in {city}.')\n\n# Using positional arguments\ndescribe_person('Alice', 30, 'New York')\n\n# Using keyword arguments\ndescribe_person(age=25, name='Bob', city='London')\n\n# Mixing positional and keyword arguments\n# Note: positional arguments must come before keyword arguments\ndescribe_person('Charlie', city='Paris', age=35)",
          },
          {
            type: "text",
            content:
              "### Variable-Length Arguments\n\n- `*args`: For variable number of positional arguments (collected as a tuple)\n- `**kwargs`: For variable number of keyword arguments (collected as a dictionary)",
          },
          {
            type: "code",
            content:
              "# *args example\ndef sum_all(*numbers):\n    result = 0\n    for num in numbers:\n        result += num\n    return result\n\nprint(sum_all(1, 2))          # Output: 3\nprint(sum_all(1, 2, 3, 4, 5))  # Output: 15\n\n# **kwargs example\ndef print_info(**kwargs):\n    for key, value in kwargs.items():\n        print(f'{key}: {value}')\n\nprint_info(name='Alice', age=30, job='Developer')\n# Output:\n# name: Alice\n# age: 30\n# job: Developer\n\n# Combining different parameter types\ndef example_function(a, b, *args, default_val='Default', **kwargs):\n    print(f'a: {a}, b: {b}')\n    print(f'args: {args}')\n    print(f'default_val: {default_val}')\n    print(f'kwargs: {kwargs}')\n\nexample_function(1, 2, 3, 4, 5, x='X', y='Y', default_val='Custom')",
          },
        ],
        exercises: [exercises[13]],
      },
      {
        id: 10,
        title: "Scope and Documentation",
        content: [
          {
            type: "text",
            content:
              "### Variable Scope\n\nThe scope of a variable determines where in your code the variable can be accessed:\n\n1. **Local scope**: Variables defined inside a function\n2. **Global scope**: Variables defined outside any function\n3. **Enclosing scope**: Variables in the outer function of nested functions",
          },
          {
            type: "code",
            content:
              "# Global vs local scope\nglobal_var = 'I am global'\n\ndef example_function():\n    local_var = 'I am local'\n    print(global_var)  # Can access global variable\n    print(local_var)   # Can access local variable\n\nexample_function()\nprint(global_var)      # Can access global variable\n# print(local_var)     # This would cause an error - local_var is not defined in this scope\n\n# Modifying global variables from within a function\ndef modify_global():\n    global global_var\n    global_var = 'Modified global'\n\nprint(global_var)      # Output: I am global\nmodify_global()\nprint(global_var)      # Output: Modified global",
          },
          {
            type: "text",
            content:
              "### Nested Functions and Enclosing Scope\n\nFunctions can be defined inside other functions. The inner function has access to variables from the outer function.",
          },
          {
            type: "code",
            content:
              "def outer_function(outer_var):\n    def inner_function():\n        print(f'Outer variable: {outer_var}')  # Can access variables from outer function\n    \n    inner_function()\n\nouter_function('Hello from outer')  # Output: Outer variable: Hello from outer\n\n# Using nonlocal to modify enclosing scope variables\ndef counter():\n    count = 0\n    \n    def increment():\n        nonlocal count  # Indicates that we're modifying the outer function's variable\n        count += 1\n        return count\n    \n    return increment\n\nincrement_func = counter()\nprint(increment_func())  # Output: 1\nprint(increment_func())  # Output: 2\nprint(increment_func())  # Output: 3",
          },
          {
            type: "text",
            content:
              "### Documenting Functions\n\nPython uses docstrings to document functions. A docstring is a string at the beginning of a function that describes what the function does, its parameters, and return values.",
          },
          {
            type: "code",
            content:
              'def calculate_area(length, width):\n    """Calculate the area of a rectangle.\n    \n    Args:\n        length (float): The length of the rectangle.\n        width (float): The width of the rectangle.\n        \n    Returns:\n        float: The area of the rectangle.\n    """\n    return length * width\n\n# Accessing the docstring\nprint(calculate_area.__doc__)\n\n# Help function also shows the docstring\nhelp(calculate_area)',
          },
        ],
        exercises: [],
      },
      {
        id: 11,
        title: "Lambda Functions and Built-ins",
        content: [
          {
            type: "text",
            content:
              "### Lambda Functions\n\nLambda functions are small, anonymous functions defined with the `lambda` keyword. They can have any number of arguments but only one expression.",
          },
          {
            type: "code",
            content:
              "# Traditional function\ndef add(a, b):\n    return a + b\n\n# Equivalent lambda function\nadd_lambda = lambda a, b: a + b\n\nprint(add(5, 3))        # Output: 8\nprint(add_lambda(5, 3))  # Output: 8\n\n# Lambda functions are often used with built-in functions like map, filter, and sorted\n\n# Using lambda with map (applies function to each item in iterable)\nnumbers = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x**2, numbers))\nprint(squared)  # Output: [1, 4, 9, 16, 25]\n\n# Using lambda with filter (filters items based on a condition)\neven_numbers = list(filter(lambda x: x % 2 == 0, numbers))\nprint(even_numbers)  # Output: [2, 4]\n\n# Using lambda with sorted\nstudents = [\n    {'name': 'Alice', 'grade': 85},\n    {'name': 'Bob', 'grade': 92},\n    {'name': 'Charlie', 'grade': 78}\n]\n\n# Sort by grade\nsorted_students = sorted(students, key=lambda student: student['grade'], reverse=True)\nprint(sorted_students)",
          },
          {
            type: "text",
            content:
              "### Built-in Functions\n\nPython has many useful built-in functions for working with iterables and functional programming.",
          },
          {
            type: "code",
            content:
              "# map() - applies a function to each item in an iterable\ntemperatures_c = [0, 10, 20, 30, 40]\ntemperatures_f = list(map(lambda c: c * 9/5 + 32, temperatures_c))\nprint(temperatures_f)  # Output: [32.0, 50.0, 68.0, 86.0, 104.0]\n\n# filter() - filters items based on a condition\nnumbers = list(range(1, 21))\nprime_candidates = list(filter(lambda n: n > 1, numbers))\nprint(prime_candidates)\n\n# zip() - combines elements from multiple iterables\nnames = ['Alice', 'Bob', 'Charlie']\nages = [25, 30, 35]\nfor name, age in zip(names, ages):\n    print(f'{name} is {age} years old')\n\n# reduce() - applies a function cumulatively to items of an iterable\nfrom functools import reduce\nnumbers = [1, 2, 3, 4, 5]\nproduct = reduce(lambda x, y: x * y, numbers)\nprint(product)  # Output: 120 (1*2*3*4*5)\n\n# list/dict comprehensions - concise way to create lists/dicts\nsquares = [x**2 for x in range(10)]\nprint(squares)\n\neven_squares = {x: x**2 for x in range(10) if x % 2 == 0}\nprint(even_squares)",
          },
          {
            type: "text",
            content:
              "### Function Recursion\n\nA function that calls itself is recursive. Recursion is useful for problems that can be broken down into smaller, similar sub-problems.",
          },
          {
            type: "code",
            content:
              "# Factorial using recursion\ndef factorial(n):\n    if n == 0 or n == 1:  # Base case\n        return 1\n    else:  # Recursive case\n        return n * factorial(n - 1)\n\nprint(factorial(5))  # Output: 120 (5*4*3*2*1)\n\n# Fibonacci sequence using recursion\ndef fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fibonacci(n - 1) + fibonacci(n - 2)\n\nfor i in range(10):\n    print(fibonacci(i), end=' ')  # Output: 0 1 1 2 3 5 8 13 21 34",
          },
        ],
        exercises: [],
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
  // Find tests that belong to a specific module by checking which module contains them
  const module = modules.find(m => m.id === moduleId);
  return module?.tests || [];
}

export function getTestById(id: number): Test | undefined {
  return tests.find((test) => test.id === id);
}
