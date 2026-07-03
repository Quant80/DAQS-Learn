export type LessonType = "video" | "reading" | "exercise" | "quiz";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutes
  content?: string; // markdown for reading lessons
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  track: string;
  trackColor: string;
  difficulty: Difficulty;
  prerequisites: string[];
  estimatedHours: number;
  icon: string;
  outcomes: string[];
  tags: string[];
  modules: Module[];
}

// ─── TRACKS ────────────────────────────────────────────────────────────────
export const tracks = [
  { id: "python", label: "Python", color: "sky", icon: "🐍" },
  { id: "data-science", label: "Data Science", color: "violet", icon: "📊" },
  { id: "machine-learning", label: "Machine Learning", color: "amber", icon: "🤖" },
  { id: "deep-learning", label: "Deep Learning", color: "rose", icon: "🧠" },
  { id: "ai-llm", label: "AI & LLMs", color: "emerald", icon: "💡" },
  { id: "agentic-ai", label: "Agentic AI", color: "orange", icon: "⚡" },
  { id: "web-dev", label: "Web Development", color: "cyan", icon: "🌐" },
  { id: "data-engineering", label: "Data Engineering", color: "lime", icon: "🗄️" },
  { id: "mathematics", label: "Mathematics", color: "indigo", icon: "🧮" },
  { id: "career", label: "Career & Ethics", color: "pink", icon: "🎯" },
];

export const courses: Course[] = [

  // ════════════════════════════════════════════════════════════
  // TRACK 1 — PYTHON
  // ════════════════════════════════════════════════════════════
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    subtitle: "Master the building blocks of Python programming",
    description: "Start your coding journey with Python — the world's most popular programming language. You will go from writing your very first line of code to building real programs with functions, loops, and data structures.",
    track: "python", trackColor: "sky",
    difficulty: "beginner", prerequisites: [], estimatedHours: 8,
    icon: "🐍",
    outcomes: [
      "Write and run Python programs confidently",
      "Use variables, data types, and operators",
      "Control program flow with loops and conditionals",
      "Create reusable functions",
      "Work with lists, dictionaries, tuples, and sets",
    ],
    tags: ["python", "programming", "beginner", "syntax"],
    modules: [
      {
        id: "py-m1", title: "Getting Started with Python",
        lessons: [
          {
            id: "py-m1-l1", title: "What is Python and Why Learn It?", type: "reading", duration: 8,
            content: `## What is Python?\n\nPython is a high-level, general-purpose programming language created by Guido van Rossum in 1991. It is designed to be readable, simple, and expressive — you can do in 3 lines of Python what might take 10 lines in other languages.\n\n## Why Python?\n\n**1. It dominates Data Science and AI.** Every major AI library (TensorFlow, PyTorch, scikit-learn, pandas) is Python-first.\n\n**2. It is beginner-friendly.** Python reads almost like English:\n\`\`\`python\nname = "Trymore"\nif name == "Trymore":\n    print("Welcome to DAQS Learn!")\n\`\`\`\n\n**3. It pays well.** Python developers are among the highest-paid globally.\n\n**4. It runs everywhere.** Web servers, data pipelines, AI models, automation scripts, Raspberry Pi — Python runs on all of them.\n\n## Where is Python Used?\n- **Data Science & ML** — pandas, NumPy, scikit-learn\n- **Web Development** — Django, FastAPI, Flask\n- **Automation** — scripting, file processing\n- **AI & Research** — PyTorch, TensorFlow, Hugging Face\n- **Finance** — algorithmic trading, risk analysis\n\n## Python vs Other Languages\n| Feature | Python | Java | C++ |\n|---|---|---|---|\n| Syntax | Simple | Verbose | Complex |\n| Speed | Moderate | Fast | Very fast |\n| Use case | AI/DS/Web | Enterprise | Systems |\n| Learning curve | Low | Medium | High |\n\nFor AI and data science, Python is the undisputed standard. Let's get started.`,
          },
          { id: "py-m1-l2", title: "Installing Python & Setting Up VS Code", type: "reading", duration: 10,
            content: `## Installing Python\n\n### Windows\n1. Go to [python.org/downloads](https://python.org/downloads)\n2. Download Python 3.12 (latest stable)\n3. Run the installer — **tick "Add Python to PATH"** before clicking Install\n4. Verify: open Command Prompt and type \`python --version\`\n\n### macOS\n\`\`\`bash\nbrew install python@3.12\n\`\`\`\n\n### Verify installation\n\`\`\`bash\npython --version\n# Python 3.12.x\n\`\`\`\n\n## Setting Up VS Code\n1. Download VS Code from [code.visualstudio.com](https://code.visualstudio.com)\n2. Install the **Python extension** by Microsoft (search in Extensions panel)\n3. Install **Pylance** for intelligent autocomplete\n\n## Your Python REPL\nOpen a terminal and type \`python\` to enter the interactive shell:\n\`\`\`python\n>>> 2 + 2\n4\n>>> print("Hello, DAQS!")\nHello, DAQS!\n>>> exit()\n\`\`\`\n\nThe REPL (Read-Eval-Print Loop) is perfect for experimenting. You'll use it constantly.`,
          },
          { id: "py-m1-l3", title: "Your First Python Program", type: "exercise", duration: 15 },
        ],
      },
      {
        id: "py-m2", title: "Variables & Data Types",
        lessons: [
          { id: "py-m2-l1", title: "Variables and Assignment", type: "reading", duration: 12,
            content: `## Variables in Python\n\nA variable is a named container for a value. In Python you just assign — no type declaration needed:\n\n\`\`\`python\nname = "Amara"\nage = 22\ngpa = 3.85\nis_enrolled = True\n\`\`\`\n\n## Naming Rules\n- Use lowercase with underscores: \`student_name\`, not \`StudentName\`\n- Cannot start with a number: \`2fast\` is invalid\n- Cannot use reserved words: \`if\`, \`for\`, \`class\`, etc.\n\n## Python's Dynamic Typing\nPython figures out the type automatically:\n\`\`\`python\nx = 10        # int\nx = "hello"   # now x is a str — Python allows this\nx = 3.14      # now x is a float\n\`\`\`\n\nUse \`type()\` to check:\n\`\`\`python\nprint(type(42))      # <class 'int'>\nprint(type("hi"))    # <class 'str'>\nprint(type(3.14))    # <class 'float'>\nprint(type(True))    # <class 'bool'>\n\`\`\`\n\n## Multiple Assignment\n\`\`\`python\na, b, c = 1, 2, 3\nprint(a, b, c)  # 1 2 3\n\n# Swap values elegantly\na, b = b, a\nprint(a, b)  # 2 1\n\`\`\``,
          },
          { id: "py-m2-l2", title: "Strings in Depth", type: "reading", duration: 15,
            content: `## Strings\n\nStrings hold text. Use single or double quotes (be consistent):\n\`\`\`python\ngreeting = "Hello, South Africa!"\nquote = 'Learning is the key to the future'\n\`\`\`\n\n## f-Strings (the modern way)\n\`\`\`python\nname = "Sipho"\nage = 19\nprint(f"My name is {name} and I am {age} years old.")\n# My name is Sipho and I am 19 years old.\n\nprint(f"Next year I will be {age + 1}.")  # expressions work inside {}\n\`\`\`\n\n## Key String Methods\n\`\`\`python\ns = "  Hello, World!  "\nprint(s.strip())          # "Hello, World!"\nprint(s.lower())          # "  hello, world!  "\nprint(s.upper())          # "  HELLO, WORLD!  "\nprint(s.replace("World", "DAQS"))  # "  Hello, DAQS!  "\nprint(s.split(","))       # ['  Hello', ' World!  ']\nprint(len(s))             # 18\n\`\`\`\n\n## String Indexing & Slicing\n\`\`\`python\ns = "Python"\nprint(s[0])    # 'P'\nprint(s[-1])   # 'n'\nprint(s[0:3])  # 'Pyt'\nprint(s[::-1]) # 'nohtyP' (reversed!)\n\`\`\``,
          },
          { id: "py-m2-l3", title: "Numbers and Operators", type: "reading", duration: 10,
            content: `## Numeric Types\n\`\`\`python\nx = 42       # int — whole numbers\ny = 3.14     # float — decimals\nz = 2 + 3j   # complex — rarely needed\n\`\`\`\n\n## Arithmetic Operators\n| Operator | Meaning | Example | Result |\n|---|---|---|---|\n| + | Addition | 5 + 3 | 8 |\n| - | Subtraction | 5 - 3 | 2 |\n| * | Multiplication | 5 * 3 | 15 |\n| / | Division | 7 / 2 | 3.5 |\n| // | Floor division | 7 // 2 | 3 |\n| % | Modulo | 7 % 2 | 1 |\n| ** | Exponentiation | 2 ** 8 | 256 |\n\n## Useful Math Functions\n\`\`\`python\nimport math\nmath.sqrt(16)    # 4.0\nmath.ceil(3.2)   # 4\nmath.floor(3.9)  # 3\nabs(-5)          # 5 — built-in, no import\nround(3.14159, 2)  # 3.14\n\`\`\``,
          },
          { id: "py-m2-l4", title: "Data Types Practice", type: "exercise", duration: 20 },
        ],
      },
      {
        id: "py-m3", title: "Control Flow",
        lessons: [
          { id: "py-m3-l1", title: "if / elif / else Statements", type: "reading", duration: 12,
            content: `## Making Decisions in Python\n\n\`\`\`python\nscore = 75\n\nif score >= 80:\n    print("Distinction")\nelif score >= 60:\n    print("Pass")\nelif score >= 50:\n    print("Supplementary")\nelse:\n    print("Fail")\n\`\`\`\n\n## Comparison Operators\n| Operator | Meaning |\n|---|---|\n| == | Equal to |\n| != | Not equal |\n| > | Greater than |\n| < | Less than |\n| >= | Greater or equal |\n| <= | Less or equal |\n\n## Logical Operators\n\`\`\`python\nage = 20\nhas_id = True\n\nif age >= 18 and has_id:\n    print("Access granted")\n\nif age < 13 or age > 65:\n    print("Discount applies")\n\nif not has_id:\n    print("ID required")\n\`\`\`\n\n## One-line Ternary\n\`\`\`python\nstatus = "adult" if age >= 18 else "minor"\n\`\`\``,
          },
          { id: "py-m3-l2", title: "for Loops and range()", type: "reading", duration: 12,
            content: `## for Loops\n\nIterate over any sequence:\n\`\`\`python\nfruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)\n\`\`\`\n\n## range() — Generate Number Sequences\n\`\`\`python\nfor i in range(5):        # 0, 1, 2, 3, 4\n    print(i)\n\nfor i in range(1, 6):    # 1, 2, 3, 4, 5\n    print(i)\n\nfor i in range(0, 10, 2): # 0, 2, 4, 6, 8 (step=2)\n    print(i)\n\`\`\`\n\n## enumerate() — Get Index and Value\n\`\`\`python\nstudents = ["Amara", "Sipho", "Lindiwe"]\nfor i, name in enumerate(students, start=1):\n    print(f"{i}. {name}")\n# 1. Amara\n# 2. Sipho\n# 3. Lindiwe\n\`\`\`\n\n## while Loops\n\`\`\`python\ncount = 0\nwhile count < 5:\n    print(f"Count: {count}")\n    count += 1\n\`\`\`\n\n## break and continue\n\`\`\`python\nfor i in range(10):\n    if i == 3:\n        continue  # skip 3\n    if i == 7:\n        break     # stop at 7\n    print(i)  # prints 0,1,2,4,5,6\n\`\`\``,
          },
          { id: "py-m3-l3", title: "Control Flow Challenges", type: "exercise", duration: 20 },
        ],
      },
      {
        id: "py-m4", title: "Functions",
        lessons: [
          { id: "py-m4-l1", title: "Defining and Calling Functions", type: "reading", duration: 15,
            content: `## Why Functions?\n\nFunctions let you write code once and use it many times. They make your programs organised and testable.\n\n\`\`\`python\ndef greet(name):\n    """Return a personalised greeting."""\n    return f"Hello, {name}! Welcome to DAQS Learn."\n\nprint(greet("Sipho"))   # Hello, Sipho! Welcome to DAQS Learn.\nprint(greet("Amara"))   # Hello, Amara! Welcome to DAQS Learn.\n\`\`\`\n\n## Parameters and Default Values\n\`\`\`python\ndef calculate_grade(score, total=100):\n    percentage = (score / total) * 100\n    if percentage >= 75:\n        return "Distinction"\n    elif percentage >= 50:\n        return "Pass"\n    else:\n        return "Fail"\n\nprint(calculate_grade(80))       # Distinction (uses default total=100)\nprint(calculate_grade(40, 50))   # Distinction (40/50 = 80%)\n\`\`\`\n\n## *args and **kwargs\n\`\`\`python\ndef add(*numbers):\n    return sum(numbers)\n\nprint(add(1, 2, 3))      # 6\nprint(add(1, 2, 3, 4))   # 10\n\ndef display_info(**info):\n    for key, value in info.items():\n        print(f"{key}: {value}")\n\ndisplay_info(name="Sipho", age=20, city="Johannesburg")\n\`\`\``,
          },
          { id: "py-m4-l2", title: "Scope and Lambda Functions", type: "reading", duration: 10 },
          { id: "py-m4-l3", title: "Function Practice Problems", type: "exercise", duration: 25 },
          { id: "py-m4-l4", title: "Module Quiz", type: "quiz", duration: 10 },
        ],
      },
      {
        id: "py-m5", title: "Data Structures",
        lessons: [
          { id: "py-m5-l1", title: "Lists — Python's Workhorse", type: "reading", duration: 15,
            content: `## Lists\n\nLists are ordered, mutable collections of any data type:\n\`\`\`python\nstudents = ["Amara", "Sipho", "Lindiwe", "Thabo"]\nscores   = [85, 92, 78, 95]\nmixed    = [1, "hello", True, 3.14]\n\`\`\`\n\n## Core List Operations\n\`\`\`python\nfruits = ["apple", "banana", "cherry"]\n\n# Access\nprint(fruits[0])    # apple\nprint(fruits[-1])   # cherry\nprint(fruits[1:3])  # ['banana', 'cherry']\n\n# Modify\nfruits.append("mango")          # add to end\nfruits.insert(1, "avocado")     # insert at index\nfruits.remove("banana")         # remove by value\npopped = fruits.pop()           # remove & return last\n\n# Useful methods\nfruits.sort()        # sort in place\nfruits.reverse()     # reverse in place\nlen(fruits)          # count elements\n5 in fruits          # membership check → True/False\n\`\`\`\n\n## List Comprehensions\nBuild lists elegantly:\n\`\`\`python\nsquares = [x**2 for x in range(1, 6)]\n# [1, 4, 9, 16, 25]\n\nevens = [x for x in range(20) if x % 2 == 0]\n# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\n\nnames = ["alice", "BOB", "charlie"]\ncapitalized = [name.capitalize() for name in names]\n# ['Alice', 'Bob', 'Charlie']\n\`\`\``,
          },
          { id: "py-m5-l2", title: "Dictionaries and Sets", type: "reading", duration: 15,
            content: `## Dictionaries\n\nKey-value stores — like a real dictionary where you look up definitions by word:\n\`\`\`python\nstudent = {\n    "name": "Sipho Dlamini",\n    "age": 21,\n    "gpa": 3.7,\n    "enrolled": True\n}\n\n# Access\nprint(student["name"])          # Sipho Dlamini\nprint(student.get("age", 0))   # 21 (safe — no KeyError)\n\n# Modify\nstudent["age"] = 22             # update\nstudent["city"] = "Cape Town"  # add new key\ndel student["enrolled"]         # remove key\n\n# Iterate\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\`\`\`\n\n## Dict Comprehensions\n\`\`\`python\nscores = {"Math": 85, "Science": 92, "English": 78}\npassed = {subject: score for subject, score in scores.items() if score >= 80}\n# {'Math': 85, 'Science': 92}\n\`\`\`\n\n## Sets\nUnordered collections of unique values — great for deduplication:\n\`\`\`python\nmy_set = {1, 2, 3, 2, 1}\nprint(my_set)  # {1, 2, 3} — duplicates removed automatically\n\nset_a = {1, 2, 3, 4}\nset_b = {3, 4, 5, 6}\nprint(set_a & set_b)  # intersection: {3, 4}\nprint(set_a | set_b)  # union: {1, 2, 3, 4, 5, 6}\nprint(set_a - set_b)  # difference: {1, 2}\n\`\`\``,
          },
          { id: "py-m5-l3", title: "Tuples", type: "reading", duration: 8 },
          { id: "py-m5-l4", title: "Data Structures Practice", type: "exercise", duration: 30 },
          { id: "py-m5-l5", title: "Python Fundamentals Quiz", type: "quiz", duration: 15 },
        ],
      },
    ],
  },

  {
    id: "python-intermediate",
    title: "Python Intermediate",
    subtitle: "OOP, error handling, file I/O, and advanced Python patterns",
    description: "Take your Python skills to the next level. Master object-oriented programming, handle errors gracefully, work with files, and learn the powerful patterns that professional Python developers use every day.",
    track: "python", trackColor: "sky",
    difficulty: "intermediate", prerequisites: ["python-fundamentals"], estimatedHours: 10,
    icon: "🐍",
    outcomes: [
      "Design and implement Python classes and objects",
      "Handle exceptions professionally",
      "Read from and write to files and CSV",
      "Use modules and build packages",
      "Write list comprehensions and generators",
      "Apply decorators and context managers",
    ],
    tags: ["python", "oop", "intermediate", "classes"],
    modules: [
      {
        id: "pyint-m1", title: "Object-Oriented Programming",
        lessons: [
          { id: "pyint-m1-l1", title: "Classes and Objects", type: "reading", duration: 20,
            content: `## Object-Oriented Programming\n\nOOP organises code around *objects* — bundles of data (attributes) and behaviour (methods). Real-world modelling:\n\n\`\`\`python\nclass Student:\n    """Represents a DAQS Learn student."""\n\n    # Class variable — shared by all instances\n    platform = "DAQS Learn"\n\n    def __init__(self, name, email, gpa=0.0):\n        # Instance variables — unique to each student\n        self.name = name\n        self.email = email\n        self.gpa = gpa\n        self.courses = []\n\n    def enrol(self, course_name):\n        self.courses.append(course_name)\n        print(f"{self.name} enrolled in {course_name}")\n\n    def get_summary(self):\n        return f"{self.name} | GPA: {self.gpa} | Courses: {len(self.courses)}"\n\n    def __repr__(self):\n        return f"Student(name={self.name!r}, gpa={self.gpa})"\n\n\n# Create instances\nsipho = Student("Sipho", "sipho@daqs.com", gpa=3.7)\nAmara = Student("Amara", "amara@daqs.com", gpa=3.9)\n\nsipho.enrol("Python Intermediate")\nprint(sipho.get_summary())\n\`\`\`\n\n## Inheritance\n\`\`\`python\nclass Lecturer(Student):\n    def __init__(self, name, email, department):\n        super().__init__(name, email)  # call parent __init__\n        self.department = department\n        self.students_taught = 0\n\n    def teach(self, course):\n        self.students_taught += 1\n        return f"{self.name} taught {course}"\n\nlecturer = Lecturer("Dr. Ncube", "ncube@daqs.com", "Computer Science")\nprint(lecturer.teach("Machine Learning"))\n\`\`\``,
          },
          { id: "pyint-m1-l2", title: "Encapsulation and Properties", type: "reading", duration: 12 },
          { id: "pyint-m1-l3", title: "OOP Practice: Build a Bank Account", type: "exercise", duration: 30 },
        ],
      },
      {
        id: "pyint-m2", title: "Error Handling",
        lessons: [
          { id: "pyint-m2-l1", title: "try / except / finally", type: "reading", duration: 12,
            content: `## Why Handle Errors?\n\nPrograms fail. A file doesn't exist, a network is down, a user enters bad data. Error handling lets your program recover gracefully instead of crashing.\n\n\`\`\`python\ndef divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        print("Error: Cannot divide by zero!")\n        return None\n    except TypeError as e:\n        print(f"Error: Wrong type — {e}")\n        return None\n    else:\n        # Runs ONLY if no exception occurred\n        print(f"Success: {a} / {b} = {result}")\n        return result\n    finally:\n        # ALWAYS runs, even if there's an exception\n        print("divide() function completed")\n\ndivide(10, 2)   # Success\ndivide(10, 0)   # ZeroDivisionError handled\ndivide(10, "x") # TypeError handled\n\`\`\`\n\n## Custom Exceptions\n\`\`\`python\nclass InsufficientFundsError(Exception):\n    def __init__(self, amount, balance):\n        super().__init__(f"Cannot withdraw R{amount} — balance is R{balance}")\n        self.amount = amount\n        self.balance = balance\n\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise InsufficientFundsError(amount, balance)\n    return balance - amount\n\ntry:\n    withdraw(100, 200)\nexcept InsufficientFundsError as e:\n    print(e)\n\`\`\``,
          },
          { id: "pyint-m2-l2", title: "Error Handling Exercise", type: "exercise", duration: 20 },
        ],
      },
      {
        id: "pyint-m3", title: "File I/O and Modules",
        lessons: [
          { id: "pyint-m3-l1", title: "Reading and Writing Files", type: "reading", duration: 12 },
          { id: "pyint-m3-l2", title: "Working with CSV and JSON", type: "reading", duration: 12 },
          { id: "pyint-m3-l3", title: "Creating Python Modules", type: "reading", duration: 10 },
          { id: "pyint-m3-l4", title: "File I/O Practice", type: "exercise", duration: 25 },
        ],
      },
      {
        id: "pyint-m4", title: "Advanced Patterns",
        lessons: [
          { id: "pyint-m4-l1", title: "List, Dict & Set Comprehensions", type: "reading", duration: 12 },
          { id: "pyint-m4-l2", title: "Generators and yield", type: "reading", duration: 12 },
          { id: "pyint-m4-l3", title: "Decorators", type: "reading", duration: 15 },
          { id: "pyint-m4-l4", title: "Context Managers with 'with'", type: "reading", duration: 8 },
          { id: "pyint-m4-l5", title: "Advanced Patterns Quiz", type: "quiz", duration: 15 },
        ],
      },
    ],
  },

  {
    id: "python-advanced",
    title: "Python Advanced",
    subtitle: "Async programming, metaclasses, testing, and design patterns",
    description: "Master Python at an expert level. Learn async/await for high-performance I/O, metaclasses, memory management, professional testing with pytest, and the design patterns used in major Python frameworks.",
    track: "python", trackColor: "sky",
    difficulty: "advanced", prerequisites: ["python-intermediate"], estimatedHours: 12,
    icon: "🐍",
    outcomes: [
      "Write async/await code for concurrent programs",
      "Understand Python's memory model and garbage collection",
      "Use metaclasses to control class creation",
      "Test code professionally with pytest",
      "Apply creational, structural, and behavioural design patterns",
    ],
    tags: ["python", "async", "testing", "design patterns", "advanced"],
    modules: [
      {
        id: "pyadv-m1", title: "Async Programming",
        lessons: [
          { id: "pyadv-m1-l1", title: "Concurrency vs Parallelism", type: "reading", duration: 10 },
          { id: "pyadv-m1-l2", title: "async / await and asyncio", type: "reading", duration: 20 },
          { id: "pyadv-m1-l3", title: "Async HTTP with httpx", type: "exercise", duration: 25 },
        ],
      },
      {
        id: "pyadv-m2", title: "Metaprogramming",
        lessons: [
          { id: "pyadv-m2-l1", title: "Metaclasses and __new__", type: "reading", duration: 18 },
          { id: "pyadv-m2-l2", title: "Descriptors and __slots__", type: "reading", duration: 15 },
          { id: "pyadv-m2-l3", title: "dataclasses and attrs", type: "reading", duration: 12 },
        ],
      },
      {
        id: "pyadv-m3", title: "Testing with pytest",
        lessons: [
          { id: "pyadv-m3-l1", title: "Introduction to pytest", type: "reading", duration: 12 },
          { id: "pyadv-m3-l2", title: "Fixtures and Mocking", type: "reading", duration: 15 },
          { id: "pyadv-m3-l3", title: "Test-Driven Development", type: "exercise", duration: 30 },
        ],
      },
      {
        id: "pyadv-m4", title: "Design Patterns in Python",
        lessons: [
          { id: "pyadv-m4-l1", title: "Creational Patterns: Singleton, Factory", type: "reading", duration: 15 },
          { id: "pyadv-m4-l2", title: "Structural Patterns: Adapter, Decorator", type: "reading", duration: 15 },
          { id: "pyadv-m4-l3", title: "Behavioural Patterns: Observer, Strategy", type: "reading", duration: 15 },
          { id: "pyadv-m4-l4", title: "Design Patterns Project", type: "exercise", duration: 40 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 2 — MATHEMATICS
  // ════════════════════════════════════════════════════════════
  {
    id: "statistics-probability",
    title: "Statistics & Probability",
    subtitle: "The mathematical foundations every data scientist needs",
    description: "Understand data through statistics. Learn descriptive statistics, probability theory, distributions, hypothesis testing, and how these concepts power every machine learning algorithm.",
    track: "mathematics", trackColor: "indigo",
    difficulty: "beginner", prerequisites: [], estimatedHours: 7,
    icon: "🧮",
    outcomes: [
      "Calculate and interpret mean, median, mode, and standard deviation",
      "Understand probability and conditional probability",
      "Work with Normal, Binomial, and Poisson distributions",
      "Conduct hypothesis tests and interpret p-values",
      "Understand correlation and causation",
    ],
    tags: ["statistics", "probability", "mathematics", "data science"],
    modules: [
      {
        id: "stats-m1", title: "Descriptive Statistics",
        lessons: [
          { id: "stats-m1-l1", title: "Mean, Median, Mode", type: "reading", duration: 12,
            content: `## Measures of Central Tendency\n\nThese tell you where the "centre" of your data is.\n\n### Mean (Average)\nSum of all values divided by count.\n$$\\bar{x} = \\frac{\\sum x_i}{n}$$\n\`\`\`python\nscores = [72, 85, 90, 78, 65, 95, 88]\nprint(sum(scores) / len(scores))  # 81.86\n\`\`\`\n**Weakness:** Sensitive to outliers. One student scoring 0 drags the mean down significantly.\n\n### Median\nThe middle value when sorted. Robust to outliers.\n\`\`\`python\nimport statistics\nscores = [72, 85, 90, 78, 65, 95, 88]\nprint(statistics.median(scores))  # 85\n\`\`\`\n\n### Mode\nMost frequent value.\n\`\`\`python\nvotes = ["Python", "R", "Python", "Julia", "Python", "R"]\nprint(statistics.mode(votes))  # Python\n\`\`\`\n\n## When to Use Which?\n| Situation | Best measure |\n|---|---|\n| Symmetric data, no outliers | Mean |\n| Skewed data or outliers | Median |\n| Categorical data | Mode |\n| House prices, salaries | Median (outliers exist) |`,
          },
          { id: "stats-m1-l2", title: "Variance and Standard Deviation", type: "reading", duration: 12 },
          { id: "stats-m1-l3", title: "Data Distributions and Histograms", type: "reading", duration: 10 },
          { id: "stats-m1-l4", title: "Statistics Practice with Python", type: "exercise", duration: 25 },
        ],
      },
      {
        id: "stats-m2", title: "Probability",
        lessons: [
          { id: "stats-m2-l1", title: "Probability Fundamentals", type: "reading", duration: 12 },
          { id: "stats-m2-l2", title: "Conditional Probability and Bayes' Theorem", type: "reading", duration: 15 },
          { id: "stats-m2-l3", title: "Common Distributions", type: "reading", duration: 15 },
          { id: "stats-m2-l4", title: "Probability Exercises", type: "exercise", duration: 25 },
        ],
      },
      {
        id: "stats-m3", title: "Hypothesis Testing",
        lessons: [
          { id: "stats-m3-l1", title: "Null Hypothesis and p-values", type: "reading", duration: 15 },
          { id: "stats-m3-l2", title: "t-tests and Chi-Square Tests", type: "reading", duration: 15 },
          { id: "stats-m3-l3", title: "Correlation vs Causation", type: "reading", duration: 10 },
          { id: "stats-m3-l4", title: "Statistics Final Quiz", type: "quiz", duration: 20 },
        ],
      },
    ],
  },

  {
    id: "linear-algebra-ml",
    title: "Linear Algebra for Machine Learning",
    subtitle: "Vectors, matrices, and transformations that power AI",
    description: "Understand the mathematical backbone of machine learning. Learn about vectors, matrices, matrix multiplication, eigenvalues, and how they underpin neural networks, PCA, and recommendation systems.",
    track: "mathematics", trackColor: "indigo",
    difficulty: "intermediate", prerequisites: ["statistics-probability"], estimatedHours: 8,
    icon: "🧮",
    outcomes: [
      "Perform vector and matrix operations",
      "Understand matrix multiplication as data transformation",
      "Apply eigenvalues and eigenvectors to dimensionality reduction",
      "Connect linear algebra to neural network forward passes",
    ],
    tags: ["linear algebra", "mathematics", "ml", "vectors", "matrices"],
    modules: [
      { id: "linalg-m1", title: "Vectors", lessons: [
        { id: "linalg-m1-l1", title: "What is a Vector?", type: "reading", duration: 12 },
        { id: "linalg-m1-l2", title: "Vector Operations with NumPy", type: "exercise", duration: 20 },
        { id: "linalg-m1-l3", title: "Dot Products and Cosine Similarity", type: "reading", duration: 12 },
      ]},
      { id: "linalg-m2", title: "Matrices", lessons: [
        { id: "linalg-m2-l1", title: "Matrix Operations", type: "reading", duration: 15 },
        { id: "linalg-m2-l2", title: "Matrix Multiplication Explained", type: "reading", duration: 15 },
        { id: "linalg-m2-l3", title: "Transpose, Inverse, Determinant", type: "reading", duration: 12 },
        { id: "linalg-m2-l4", title: "Matrix Practice with NumPy", type: "exercise", duration: 25 },
      ]},
      { id: "linalg-m3", title: "Advanced Concepts", lessons: [
        { id: "linalg-m3-l1", title: "Eigenvalues and Eigenvectors", type: "reading", duration: 18 },
        { id: "linalg-m3-l2", title: "SVD and PCA Introduction", type: "reading", duration: 15 },
        { id: "linalg-m3-l3", title: "Linear Algebra in Neural Networks", type: "reading", duration: 12 },
        { id: "linalg-m3-l4", title: "Linear Algebra Final Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "calculus-ml",
    title: "Calculus for Machine Learning",
    subtitle: "Derivatives, gradients, and optimisation for AI",
    description: "Understand the calculus that drives gradient descent, backpropagation, and model optimisation. You don't need to be a mathematician — this course builds intuition through visualisations and Python examples.",
    track: "mathematics", trackColor: "indigo",
    difficulty: "intermediate", prerequisites: ["linear-algebra-ml"], estimatedHours: 6,
    icon: "🧮",
    outcomes: [
      "Understand derivatives as rates of change",
      "Compute partial derivatives and gradients",
      "Understand gradient descent intuitively",
      "See how backpropagation uses the chain rule",
    ],
    tags: ["calculus", "gradients", "backpropagation", "mathematics"],
    modules: [
      { id: "calc-m1", title: "Derivatives", lessons: [
        { id: "calc-m1-l1", title: "What is a Derivative?", type: "reading", duration: 15 },
        { id: "calc-m1-l2", title: "Partial Derivatives and Gradients", type: "reading", duration: 15 },
        { id: "calc-m1-l3", title: "Computing Gradients with NumPy", type: "exercise", duration: 20 },
      ]},
      { id: "calc-m2", title: "Optimisation", lessons: [
        { id: "calc-m2-l1", title: "Gradient Descent Explained", type: "reading", duration: 15 },
        { id: "calc-m2-l2", title: "Learning Rate and Convergence", type: "reading", duration: 12 },
        { id: "calc-m2-l3", title: "The Chain Rule and Backpropagation", type: "reading", duration: 18 },
        { id: "calc-m2-l4", title: "Implement Gradient Descent from Scratch", type: "exercise", duration: 30 },
        { id: "calc-m2-l5", title: "Calculus for ML Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 3 — DATA SCIENCE
  // ════════════════════════════════════════════════════════════
  {
    id: "data-science-foundations",
    title: "Data Science Foundations",
    subtitle: "NumPy, Pandas, and the data science workflow",
    description: "Enter the world of data science. Master the essential Python libraries — NumPy for numerical computing and Pandas for data manipulation — and learn the end-to-end data science process from raw data to insight.",
    track: "data-science", trackColor: "violet",
    difficulty: "beginner", prerequisites: ["python-fundamentals"], estimatedHours: 9,
    icon: "📊",
    outcomes: [
      "Use NumPy arrays for efficient numerical computation",
      "Load, inspect, and manipulate data with Pandas",
      "Handle missing values and data quality issues",
      "Summarise datasets with groupby and pivot tables",
      "Export results to CSV and Excel",
    ],
    tags: ["pandas", "numpy", "data science", "beginner"],
    modules: [
      {
        id: "dsf-m1", title: "NumPy — Numerical Python",
        lessons: [
          { id: "dsf-m1-l1", title: "Why NumPy? Arrays vs Lists", type: "reading", duration: 10,
            content: `## Why NumPy?\n\nPython lists are flexible but slow for numerical work. NumPy provides arrays that are 100x faster because they:\n- Store data in contiguous memory\n- Use vectorised C operations under the hood\n- Eliminate Python overhead in loops\n\n\`\`\`python\nimport numpy as np\nimport time\n\n# Python list — slow\npy_list = list(range(1_000_000))\nstart = time.time()\nresult = [x**2 for x in py_list]\nprint(f"List: {time.time() - start:.3f}s")\n\n# NumPy array — fast\nnp_array = np.arange(1_000_000)\nstart = time.time()\nresult = np_array**2  # vectorised — no loop needed!\nprint(f"NumPy: {time.time() - start:.3f}s")\n# NumPy is typically 50-100x faster\n\`\`\`\n\n## Creating Arrays\n\`\`\`python\nimport numpy as np\n\narr = np.array([1, 2, 3, 4, 5])\nprint(arr.dtype)   # int64\nprint(arr.shape)   # (5,)\nprint(arr.ndim)    # 1\n\n# Special arrays\nnp.zeros((3, 4))      # 3x4 array of zeros\nnp.ones((2, 3))       # 2x3 array of ones\nnp.eye(3)             # 3x3 identity matrix\nnp.random.randn(4, 4) # 4x4 standard normal random\nnp.arange(0, 10, 2)  # [0, 2, 4, 6, 8]\nnp.linspace(0, 1, 5)  # [0, 0.25, 0.5, 0.75, 1.0]\n\`\`\``,
          },
          { id: "dsf-m1-l2", title: "Array Operations and Broadcasting", type: "reading", duration: 15 },
          { id: "dsf-m1-l3", title: "Indexing, Slicing, and Reshaping", type: "reading", duration: 12 },
          { id: "dsf-m1-l4", title: "NumPy Practice Problems", type: "exercise", duration: 25 },
        ],
      },
      {
        id: "dsf-m2", title: "Pandas — Data Manipulation",
        lessons: [
          { id: "dsf-m2-l1", title: "DataFrames and Series", type: "reading", duration: 15,
            content: `## Pandas: The Data Science Spreadsheet\n\nPandas gives you a spreadsheet-like object called a DataFrame — but with the power of programming.\n\n\`\`\`python\nimport pandas as pd\n\n# Create from dict\ndf = pd.DataFrame({\n    "name":    ["Sipho", "Amara", "Lindiwe", "Thabo"],\n    "age":     [21, 23, 20, 25],\n    "score":   [85, 92, 78, 88],\n    "city":    ["Joburg", "Cape Town", "Durban", "Pretoria"]\n})\n\nprint(df.head())    # First 5 rows\nprint(df.info())    # Column types, nulls\nprint(df.describe()) # Statistical summary\n\`\`\`\n\n## Loading Real Data\n\`\`\`python\n# CSV\ndf = pd.read_csv("students.csv")\n\n# Excel\ndf = pd.read_excel("data.xlsx", sheet_name="Results")\n\n# JSON\ndf = pd.read_json("records.json")\n\`\`\`\n\n## Selecting Data\n\`\`\`python\n# Column selection\ndf["name"]            # Series\ndf[["name", "score"]] # DataFrame\n\n# Row selection\ndf.iloc[0]            # first row by position\ndf.loc[0]             # first row by label\ndf.iloc[1:4]          # rows 1-3\n\n# Conditional filtering\ndf[df["score"] >= 85]                     # high scorers\ndf[(df["score"] >= 80) & (df["age"] < 25)] # combined\n\`\`\``,
          },
          { id: "dsf-m2-l2", title: "Cleaning Data — Missing Values", type: "reading", duration: 15 },
          { id: "dsf-m2-l3", title: "GroupBy and Aggregation", type: "reading", duration: 12 },
          { id: "dsf-m2-l4", title: "Merging and Joining DataFrames", type: "reading", duration: 12 },
          { id: "dsf-m2-l5", title: "Pandas Practice: Real Dataset", type: "exercise", duration: 35 },
        ],
      },
      {
        id: "dsf-m3", title: "The Data Science Workflow",
        lessons: [
          { id: "dsf-m3-l1", title: "CRISP-DM: The DS Process", type: "reading", duration: 10 },
          { id: "dsf-m3-l2", title: "EDA — Exploratory Data Analysis", type: "reading", duration: 15 },
          { id: "dsf-m3-l3", title: "Your First End-to-End DS Project", type: "exercise", duration: 40 },
          { id: "dsf-m3-l4", title: "Data Science Foundations Quiz", type: "quiz", duration: 15 },
        ],
      },
    ],
  },

  {
    id: "data-visualization",
    title: "Data Visualisation",
    subtitle: "Tell stories with data using Matplotlib, Seaborn, and Plotly",
    description: "Turn raw data into compelling visual stories. Master Matplotlib for publication-quality charts, Seaborn for statistical visualisations, and Plotly for interactive dashboards.",
    track: "data-science", trackColor: "violet",
    difficulty: "intermediate", prerequisites: ["data-science-foundations"], estimatedHours: 7,
    icon: "📊",
    outcomes: [
      "Create clear and informative charts with Matplotlib",
      "Build statistical plots with Seaborn",
      "Create interactive visualisations with Plotly",
      "Apply principles of visual design to data",
      "Build a complete data dashboard",
    ],
    tags: ["matplotlib", "seaborn", "plotly", "visualisation"],
    modules: [
      { id: "viz-m1", title: "Matplotlib", lessons: [
        { id: "viz-m1-l1", title: "Anatomy of a Matplotlib Figure", type: "reading", duration: 12 },
        { id: "viz-m1-l2", title: "Line, Bar, Scatter, and Histogram Charts", type: "reading", duration: 15 },
        { id: "viz-m1-l3", title: "Subplots and Figure Customisation", type: "reading", duration: 12 },
        { id: "viz-m1-l4", title: "Matplotlib Practice", type: "exercise", duration: 25 },
      ]},
      { id: "viz-m2", title: "Seaborn for Statistical Plots", lessons: [
        { id: "viz-m2-l1", title: "Distribution Plots", type: "reading", duration: 10 },
        { id: "viz-m2-l2", title: "Correlation Heatmaps and Pairplots", type: "reading", duration: 10 },
        { id: "viz-m2-l3", title: "Categorical Plots", type: "reading", duration: 10 },
        { id: "viz-m2-l4", title: "Seaborn Practice", type: "exercise", duration: 20 },
      ]},
      { id: "viz-m3", title: "Interactive Dashboards with Plotly", lessons: [
        { id: "viz-m3-l1", title: "Introduction to Plotly Express", type: "reading", duration: 12 },
        { id: "viz-m3-l2", title: "Building an Interactive Dashboard", type: "exercise", duration: 35 },
        { id: "viz-m3-l3", title: "Visualisation Best Practices", type: "reading", duration: 10 },
        { id: "viz-m3-l4", title: "Visualisation Final Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 4 — MACHINE LEARNING
  // ════════════════════════════════════════════════════════════
  {
    id: "ml-fundamentals",
    title: "Machine Learning Fundamentals",
    subtitle: "Understand the core algorithms and workflow of ML",
    description: "Build a solid foundation in machine learning. Understand when and why to use different algorithms, the full ML pipeline from data to deployment, and avoid the common pitfalls that trip up beginners.",
    track: "machine-learning", trackColor: "amber",
    difficulty: "intermediate", prerequisites: ["data-science-foundations", "statistics-probability"], estimatedHours: 12,
    icon: "🤖",
    outcomes: [
      "Understand supervised vs unsupervised vs reinforcement learning",
      "Implement linear and logistic regression from scratch",
      "Use scikit-learn to train and evaluate models",
      "Prevent overfitting with regularisation and cross-validation",
      "Build a complete ML pipeline",
    ],
    tags: ["machine learning", "scikit-learn", "regression", "classification"],
    modules: [
      {
        id: "mlf-m1", title: "ML Landscape",
        lessons: [
          { id: "mlf-m1-l1", title: "Types of Machine Learning", type: "reading", duration: 15,
            content: `## The Machine Learning Landscape\n\n### Supervised Learning\nLearn from labelled examples. You give the model (input, correct output) pairs and it learns the mapping.\n- **Regression** — predict a continuous number. E.g., predict house price, forecast sales.\n- **Classification** — predict a category. E.g., spam or not spam, disease or healthy.\n\n### Unsupervised Learning\nFind patterns in unlabelled data. No correct answers — the model discovers structure.\n- **Clustering** — group similar data points. E.g., customer segments.\n- **Dimensionality Reduction** — compress many features to few. E.g., PCA.\n- **Anomaly Detection** — find unusual points. E.g., fraud detection.\n\n### Reinforcement Learning\nAn agent learns by trial and error, receiving rewards or penalties.\n- Plays games (AlphaGo, OpenAI Five)\n- Controls robots\n- Trains LLMs (RLHF — Reinforcement Learning from Human Feedback)\n\n### Self-Supervised / Foundation Models\nLearn from massive unlabelled datasets by predicting masked parts of the data.\n- GPT-4 predicts the next token\n- BERT predicts masked words\n\n## The ML Workflow\n1. **Define the problem** — what are we predicting?\n2. **Collect and label data**\n3. **Explore and clean data** (EDA)\n4. **Choose and train a model**\n5. **Evaluate** — accuracy, precision, recall, F1\n6. **Tune hyperparameters**\n7. **Deploy and monitor**`,
          },
          { id: "mlf-m1-l2", title: "How Machines Learn — Loss Functions", type: "reading", duration: 12 },
          { id: "mlf-m1-l3", title: "Your First scikit-learn Model", type: "exercise", duration: 25 },
        ],
      },
      {
        id: "mlf-m2", title: "Regression",
        lessons: [
          { id: "mlf-m2-l1", title: "Linear Regression — Theory", type: "reading", duration: 15 },
          { id: "mlf-m2-l2", title: "Implementing Linear Regression", type: "exercise", duration: 25 },
          { id: "mlf-m2-l3", title: "Polynomial Regression and Feature Engineering", type: "reading", duration: 12 },
          { id: "mlf-m2-l4", title: "Regularisation: Ridge and Lasso", type: "reading", duration: 12 },
        ],
      },
      {
        id: "mlf-m3", title: "Classification",
        lessons: [
          { id: "mlf-m3-l1", title: "Logistic Regression", type: "reading", duration: 15 },
          { id: "mlf-m3-l2", title: "Decision Trees and Random Forests", type: "reading", duration: 15 },
          { id: "mlf-m3-l3", title: "Support Vector Machines", type: "reading", duration: 12 },
          { id: "mlf-m3-l4", title: "k-Nearest Neighbours", type: "reading", duration: 10 },
          { id: "mlf-m3-l5", title: "Classification Practice", type: "exercise", duration: 30 },
        ],
      },
      {
        id: "mlf-m4", title: "Model Evaluation",
        lessons: [
          { id: "mlf-m4-l1", title: "Train/Test Split and Cross-Validation", type: "reading", duration: 12 },
          { id: "mlf-m4-l2", title: "Confusion Matrix, Precision, Recall, F1", type: "reading", duration: 15 },
          { id: "mlf-m4-l3", title: "ROC Curves and AUC", type: "reading", duration: 10 },
          { id: "mlf-m4-l4", title: "Hyperparameter Tuning with GridSearchCV", type: "reading", duration: 12 },
          { id: "mlf-m4-l5", title: "ML Fundamentals Final Quiz", type: "quiz", duration: 20 },
        ],
      },
    ],
  },

  {
    id: "unsupervised-learning",
    title: "Unsupervised Learning",
    subtitle: "Clustering, dimensionality reduction, and anomaly detection",
    description: "Explore the world of unsupervised learning — discovering hidden patterns and structures in data without labels. Learn k-means clustering, hierarchical clustering, PCA, t-SNE, and anomaly detection.",
    track: "machine-learning", trackColor: "amber",
    difficulty: "intermediate", prerequisites: ["ml-fundamentals"], estimatedHours: 8,
    icon: "🤖",
    outcomes: [
      "Apply k-means and hierarchical clustering",
      "Reduce dimensionality with PCA and t-SNE",
      "Detect anomalies with Isolation Forest",
      "Segment customers using clustering",
    ],
    tags: ["clustering", "pca", "unsupervised", "k-means"],
    modules: [
      { id: "unsup-m1", title: "Clustering", lessons: [
        { id: "unsup-m1-l1", title: "k-Means Clustering", type: "reading", duration: 15 },
        { id: "unsup-m1-l2", title: "Choosing k — Elbow Method and Silhouette Score", type: "reading", duration: 10 },
        { id: "unsup-m1-l3", title: "Hierarchical Clustering", type: "reading", duration: 12 },
        { id: "unsup-m1-l4", title: "Customer Segmentation Project", type: "exercise", duration: 35 },
      ]},
      { id: "unsup-m2", title: "Dimensionality Reduction", lessons: [
        { id: "unsup-m2-l1", title: "PCA — Principal Component Analysis", type: "reading", duration: 18 },
        { id: "unsup-m2-l2", title: "t-SNE for Visualisation", type: "reading", duration: 12 },
        { id: "unsup-m2-l3", title: "Autoencoders Introduction", type: "reading", duration: 12 },
        { id: "unsup-m2-l4", title: "Unsupervised Learning Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "advanced-ml-mlops",
    title: "Advanced ML & MLOps",
    subtitle: "Ensemble methods, XGBoost, model deployment, and monitoring",
    description: "Take your ML skills into production. Master ensemble methods, gradient boosting with XGBoost and LightGBM, feature engineering at scale, and deploy models with FastAPI and MLflow.",
    track: "machine-learning", trackColor: "amber",
    difficulty: "advanced", prerequisites: ["ml-fundamentals", "unsupervised-learning"], estimatedHours: 10,
    icon: "🤖",
    outcomes: [
      "Build powerful ensemble models",
      "Use XGBoost and LightGBM for tabular data competitions",
      "Track experiments with MLflow",
      "Serve ML models with FastAPI",
      "Monitor model drift in production",
    ],
    tags: ["xgboost", "ensemble", "mlops", "deployment", "mlflow"],
    modules: [
      { id: "advml-m1", title: "Ensemble Methods", lessons: [
        { id: "advml-m1-l1", title: "Bagging and Random Forests Deep Dive", type: "reading", duration: 15 },
        { id: "advml-m1-l2", title: "Boosting: AdaBoost and Gradient Boosting", type: "reading", duration: 15 },
        { id: "advml-m1-l3", title: "XGBoost in Practice", type: "exercise", duration: 30 },
        { id: "advml-m1-l4", title: "LightGBM and CatBoost", type: "reading", duration: 12 },
      ]},
      { id: "advml-m2", title: "MLOps", lessons: [
        { id: "advml-m2-l1", title: "Experiment Tracking with MLflow", type: "reading", duration: 15 },
        { id: "advml-m2-l2", title: "Model Serialisation: Pickle and ONNX", type: "reading", duration: 10 },
        { id: "advml-m2-l3", title: "Serving Models with FastAPI", type: "exercise", duration: 30 },
        { id: "advml-m2-l4", title: "Model Monitoring and Drift Detection", type: "reading", duration: 12 },
        { id: "advml-m2-l5", title: "Advanced ML Quiz", type: "quiz", duration: 20 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 5 — DEEP LEARNING
  // ════════════════════════════════════════════════════════════
  {
    id: "neural-networks",
    title: "Neural Networks Fundamentals",
    subtitle: "Build neural networks from scratch — then with PyTorch",
    description: "Understand how neural networks actually work. Build a multi-layer perceptron from scratch in NumPy, then use PyTorch to train neural networks efficiently. Master forward passes, backpropagation, and activation functions.",
    track: "deep-learning", trackColor: "rose",
    difficulty: "advanced", prerequisites: ["ml-fundamentals", "calculus-ml"], estimatedHours: 14,
    icon: "🧠",
    outcomes: [
      "Understand how neurons, layers, and weights work",
      "Implement forward propagation and backpropagation from scratch",
      "Use PyTorch tensors and autograd",
      "Train MLPs on classification and regression tasks",
      "Debug and improve neural network training",
    ],
    tags: ["neural networks", "pytorch", "deep learning", "backpropagation"],
    modules: [
      { id: "nn-m1", title: "The Perceptron and MLP", lessons: [
        { id: "nn-m1-l1", title: "How Neurons Work", type: "reading", duration: 15,
          content: `## The Biological Inspiration\n\nNeural networks loosely mimic the human brain. A biological neuron receives signals through dendrites, processes them in the cell body, and fires an output through the axon if the signal is strong enough.\n\nAn artificial neuron does the same:\n1. **Receive inputs** x₁, x₂, ..., xₙ\n2. **Multiply by weights** w₁, w₂, ..., wₙ (how important each input is)\n3. **Sum everything** plus a bias: z = w₁x₁ + w₂x₂ + ... + b\n4. **Apply an activation function**: output = f(z)\n\n\`\`\`python\nimport numpy as np\n\ndef neuron(inputs, weights, bias, activation="relu"):\n    z = np.dot(inputs, weights) + bias\n    if activation == "relu":\n        return max(0, z)        # ReLU: clamp negatives to 0\n    elif activation == "sigmoid":\n        return 1 / (1 + np.exp(-z))  # Sigmoid: squash to [0,1]\n    elif activation == "tanh":\n        return np.tanh(z)       # Tanh: squash to [-1,1]\n    return z  # linear\n\n# A single neuron:\noutput = neuron(\n    inputs=[0.5, 0.3, 0.8],\n    weights=[0.2, -0.5, 0.9],\n    bias=0.1,\n    activation="relu"\n)\nprint(output)  # 0.59\n\`\`\`\n\n## Activation Functions\n| Function | Range | Use case |\n|---|---|---|\n| ReLU | [0, ∞) | Hidden layers (most common) |\n| Sigmoid | (0, 1) | Binary output |\n| Softmax | (0, 1) | Multi-class output |\n| Tanh | (-1, 1) | RNNs, older networks |\n| LeakyReLU | (-∞, ∞) | Fixes "dying ReLU" |`,
        },
        { id: "nn-m1-l2", title: "Layers, Weights, and Forward Propagation", type: "reading", duration: 15 },
        { id: "nn-m1-l3", title: "Build an MLP from Scratch in NumPy", type: "exercise", duration: 40 },
      ]},
      { id: "nn-m2", title: "Backpropagation", lessons: [
        { id: "nn-m2-l1", title: "Loss Functions and Gradients", type: "reading", duration: 15 },
        { id: "nn-m2-l2", title: "The Chain Rule and Backprop", type: "reading", duration: 20 },
        { id: "nn-m2-l3", title: "Gradient Descent Variants: SGD, Adam, RMSProp", type: "reading", duration: 12 },
        { id: "nn-m2-l4", title: "Implement Backprop from Scratch", type: "exercise", duration: 40 },
      ]},
      { id: "nn-m3", title: "PyTorch", lessons: [
        { id: "nn-m3-l1", title: "PyTorch Tensors and Autograd", type: "reading", duration: 15 },
        { id: "nn-m3-l2", title: "Building Models with nn.Module", type: "reading", duration: 15 },
        { id: "nn-m3-l3", title: "Training Loop: Forward, Loss, Backward, Step", type: "reading", duration: 15 },
        { id: "nn-m3-l4", title: "Train a Neural Network with PyTorch", type: "exercise", duration: 35 },
        { id: "nn-m3-l5", title: "Neural Networks Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "deep-learning-pytorch",
    title: "Deep Learning with PyTorch",
    subtitle: "CNNs, RNNs, transformers, and production training techniques",
    description: "Go beyond simple MLPs. Build Convolutional Neural Networks for image tasks, Recurrent Networks for sequences, and get introduced to Transformer architecture that powers modern AI.",
    track: "deep-learning", trackColor: "rose",
    difficulty: "advanced", prerequisites: ["neural-networks"], estimatedHours: 16,
    icon: "🧠",
    outcomes: [
      "Build and train CNNs for image classification",
      "Use transfer learning with pre-trained models",
      "Implement RNNs and LSTMs for sequences",
      "Understand the Transformer architecture",
      "Train on GPU and use DataLoaders",
    ],
    tags: ["cnn", "rnn", "transformer", "transfer learning", "pytorch"],
    modules: [
      { id: "dl-m1", title: "Convolutional Neural Networks", lessons: [
        { id: "dl-m1-l1", title: "How CNNs See Images", type: "reading", duration: 15 },
        { id: "dl-m1-l2", title: "Convolution, Pooling, and Feature Maps", type: "reading", duration: 15 },
        { id: "dl-m1-l3", title: "Build a CNN Classifier", type: "exercise", duration: 40 },
        { id: "dl-m1-l4", title: "Transfer Learning with ResNet and EfficientNet", type: "reading", duration: 15 },
        { id: "dl-m1-l5", title: "Transfer Learning Practice", type: "exercise", duration: 35 },
      ]},
      { id: "dl-m2", title: "Recurrent Networks", lessons: [
        { id: "dl-m2-l1", title: "RNNs and the Vanishing Gradient Problem", type: "reading", duration: 15 },
        { id: "dl-m2-l2", title: "LSTMs and GRUs", type: "reading", duration: 15 },
        { id: "dl-m2-l3", title: "Sequence Modelling Practice", type: "exercise", duration: 35 },
      ]},
      { id: "dl-m3", title: "Transformers", lessons: [
        { id: "dl-m3-l1", title: "Attention Mechanisms", type: "reading", duration: 18 },
        { id: "dl-m3-l2", title: "The Transformer Architecture", type: "reading", duration: 20 },
        { id: "dl-m3-l3", title: "Self-Attention and Multi-Head Attention", type: "reading", duration: 15 },
        { id: "dl-m3-l4", title: "Deep Learning Final Quiz", type: "quiz", duration: 20 },
      ]},
    ],
  },

  {
    id: "computer-vision",
    title: "Computer Vision",
    subtitle: "Object detection, segmentation, and generative models",
    description: "Teach computers to see. From image classification to real-time object detection with YOLO, image segmentation, and generative image models including diffusion models.",
    track: "deep-learning", trackColor: "rose",
    difficulty: "advanced", prerequisites: ["deep-learning-pytorch"], estimatedHours: 12,
    icon: "🧠",
    outcomes: [
      "Detect objects in images with YOLO",
      "Perform semantic and instance segmentation",
      "Build image generation with GANs",
      "Understand diffusion models (Stable Diffusion)",
    ],
    tags: ["computer vision", "yolo", "object detection", "segmentation", "gan"],
    modules: [
      { id: "cv-m1", title: "Object Detection", lessons: [
        { id: "cv-m1-l1", title: "Detection vs Classification vs Segmentation", type: "reading", duration: 12 },
        { id: "cv-m1-l2", title: "YOLO: Real-Time Object Detection", type: "reading", duration: 15 },
        { id: "cv-m1-l3", title: "Build a YOLO Detector", type: "exercise", duration: 40 },
      ]},
      { id: "cv-m2", title: "Segmentation and Generation", lessons: [
        { id: "cv-m2-l1", title: "Semantic Segmentation with U-Net", type: "reading", duration: 15 },
        { id: "cv-m2-l2", title: "GANs — Generative Adversarial Networks", type: "reading", duration: 18 },
        { id: "cv-m2-l3", title: "Diffusion Models Explained", type: "reading", duration: 15 },
        { id: "cv-m2-l4", title: "Computer Vision Project", type: "exercise", duration: 50 },
        { id: "cv-m2-l5", title: "Computer Vision Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "nlp",
    title: "Natural Language Processing",
    subtitle: "Text processing, sentiment analysis, and language models",
    description: "Give computers the ability to understand human language. From tokenisation and embeddings to sentiment analysis, named entity recognition, and fine-tuning pre-trained language models.",
    track: "deep-learning", trackColor: "rose",
    difficulty: "advanced", prerequisites: ["deep-learning-pytorch"], estimatedHours: 12,
    icon: "🧠",
    outcomes: [
      "Preprocess and tokenise text at scale",
      "Use word embeddings (Word2Vec, GloVe, FastText)",
      "Build sentiment analysis models",
      "Perform named entity recognition",
      "Fine-tune BERT for custom NLP tasks",
    ],
    tags: ["nlp", "bert", "transformers", "text", "embeddings"],
    modules: [
      { id: "nlp-m1", title: "Text Processing", lessons: [
        { id: "nlp-m1-l1", title: "Tokenisation and Text Cleaning", type: "reading", duration: 12 },
        { id: "nlp-m1-l2", title: "TF-IDF and Bag of Words", type: "reading", duration: 12 },
        { id: "nlp-m1-l3", title: "Word Embeddings: Word2Vec and GloVe", type: "reading", duration: 15 },
        { id: "nlp-m1-l4", title: "Text Processing Practice", type: "exercise", duration: 30 },
      ]},
      { id: "nlp-m2", title: "NLP Tasks", lessons: [
        { id: "nlp-m2-l1", title: "Sentiment Analysis", type: "exercise", duration: 30 },
        { id: "nlp-m2-l2", title: "Named Entity Recognition", type: "reading", duration: 12 },
        { id: "nlp-m2-l3", title: "Text Classification with BERT", type: "exercise", duration: 40 },
        { id: "nlp-m2-l4", title: "NLP Final Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 6 — AI & LLMs
  // ════════════════════════════════════════════════════════════
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    subtitle: "What AI is, how it works, and where it is going",
    description: "A conceptual introduction to Artificial Intelligence — no prior coding required. Understand what AI is, its history, the different types, how modern AI systems work, and the real-world impact across industries.",
    track: "ai-llm", trackColor: "emerald",
    difficulty: "beginner", prerequisites: [], estimatedHours: 5,
    icon: "💡",
    outcomes: [
      "Explain AI, ML, and deep learning and how they relate",
      "Describe the history of AI from 1950 to today",
      "Identify real-world AI applications in different industries",
      "Understand the basic concepts of how neural networks learn",
      "Discuss AI ethics and societal impact",
    ],
    tags: ["ai", "conceptual", "beginner", "no coding"],
    modules: [
      { id: "aif-m1", title: "What is AI?", lessons: [
        { id: "aif-m1-l1", title: "AI, ML, Deep Learning — Clearing Up the Confusion", type: "reading", duration: 12,
          content: `## What is Artificial Intelligence?\n\nAI is the broad concept of machines performing tasks that normally require human intelligence — understanding language, recognising images, making decisions, and solving problems.\n\n## The Three Layers\n\n**Artificial Intelligence (AI)** — the broad goal\nAny technique enabling machines to mimic human intelligence.\n\n**Machine Learning (ML)** — a subset of AI\nSystems that learn from data without being explicitly programmed. Instead of writing rules, you feed examples and the machine finds patterns.\n\n**Deep Learning (DL)** — a subset of ML\nMachine learning using neural networks with many layers. Responsible for breakthroughs in images, speech, and language since 2012.\n\n## Why Now?\nAI had multiple "winters" where progress stalled. Three things changed:\n1. **Data** — the internet generated billions of labelled examples\n2. **Compute** — GPUs and TPUs made training feasible\n3. **Algorithms** — breakthroughs like transformers, attention, and residual connections\n\n## Real Applications Today\n| Industry | Application |\n|---|---|\n| Healthcare | Cancer detection, drug discovery, diagnostic imaging |\n| Finance | Fraud detection, credit scoring, algorithmic trading |\n| Agriculture | Crop disease detection, yield prediction |\n| Education | Personalised tutoring (like DAQS Learn!) |\n| Transport | Self-driving vehicles, route optimisation |\n| Manufacturing | Quality control, predictive maintenance |`,
        },
        { id: "aif-m1-l2", title: "A Brief History of AI — 1950 to Today", type: "reading", duration: 12 },
        { id: "aif-m1-l3", title: "The AI Boom: Why 2017–2024 Changed Everything", type: "reading", duration: 10 },
      ]},
      { id: "aif-m2", title: "How AI Systems Work", lessons: [
        { id: "aif-m2-l1", title: "Training: How Machines Learn from Data", type: "reading", duration: 12 },
        { id: "aif-m2-l2", title: "AI in Industry: Case Studies", type: "reading", duration: 12 },
        { id: "aif-m2-l3", title: "AI Ethics, Bias, and Fairness", type: "reading", duration: 12 },
        { id: "aif-m2-l4", title: "The Future: AGI and Beyond", type: "reading", duration: 10 },
        { id: "aif-m2-l5", title: "AI Fundamentals Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "llm-fundamentals",
    title: "Large Language Models",
    subtitle: "How GPT, Claude, and Gemini actually work",
    description: "Go deep on the architecture, training, and capabilities of modern large language models. Understand transformers, pre-training, RLHF, tokenisation, and context windows — and how to use them effectively via API.",
    track: "ai-llm", trackColor: "emerald",
    difficulty: "intermediate", prerequisites: ["ai-fundamentals", "nlp"], estimatedHours: 9,
    icon: "💡",
    outcomes: [
      "Understand the Transformer architecture in depth",
      "Explain pre-training, fine-tuning, and RLHF",
      "Use the Anthropic Claude and OpenAI APIs",
      "Understand context windows, tokens, and temperature",
      "Choose the right model for a given task",
    ],
    tags: ["llm", "gpt", "claude", "transformers", "api"],
    modules: [
      { id: "llm-m1", title: "LLM Architecture", lessons: [
        { id: "llm-m1-l1", title: "Transformers Revisited: Why They Work for Language", type: "reading", duration: 15 },
        { id: "llm-m1-l2", title: "Pre-training on the Internet", type: "reading", duration: 12 },
        { id: "llm-m1-l3", title: "RLHF: Making Models Helpful and Safe", type: "reading", duration: 12 },
        { id: "llm-m1-l4", title: "Tokens, Context Windows, and Parameters", type: "reading", duration: 10 },
      ]},
      { id: "llm-m2", title: "Using LLMs via API", lessons: [
        { id: "llm-m2-l1", title: "The Anthropic Claude API", type: "reading", duration: 12 },
        { id: "llm-m2-l2", title: "Temperature, Top-p, and Sampling Parameters", type: "reading", duration: 10 },
        { id: "llm-m2-l3", title: "Comparing Models: Claude vs GPT vs Gemini vs Llama", type: "reading", duration: 12 },
        { id: "llm-m2-l4", title: "Build a Simple Chatbot with the Claude API", type: "exercise", duration: 30 },
        { id: "llm-m2-l5", title: "LLM Fundamentals Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "prompt-engineering",
    title: "Prompt Engineering Mastery",
    subtitle: "The art and science of communicating with AI models",
    description: "Learn to get consistently excellent results from AI models. Master zero-shot, few-shot, chain-of-thought prompting, system prompts, structured outputs, and advanced techniques like self-consistency and ReAct.",
    track: "ai-llm", trackColor: "emerald",
    difficulty: "intermediate", prerequisites: ["llm-fundamentals"], estimatedHours: 7,
    icon: "💡",
    outcomes: [
      "Write effective system and user prompts",
      "Apply zero-shot, few-shot, and chain-of-thought techniques",
      "Extract structured JSON from LLMs reliably",
      "Avoid common prompting mistakes",
      "Use advanced techniques: ReAct, Self-Consistency, ToT",
    ],
    tags: ["prompt engineering", "llm", "claude", "techniques"],
    modules: [
      { id: "pe-m1", title: "Prompting Foundations", lessons: [
        { id: "pe-m1-l1", title: "What Prompt Engineering Actually Is", type: "reading", duration: 10 },
        { id: "pe-m1-l2", title: "Zero-Shot and Few-Shot Prompting", type: "reading", duration: 12 },
        { id: "pe-m1-l3", title: "Chain-of-Thought: Making AI Think Step by Step", type: "reading", duration: 12,
          content: `## Chain-of-Thought (CoT) Prompting\n\nChain-of-thought prompting dramatically improves reasoning by asking the model to *show its work* before giving an answer. Introduced by Google in 2022, it is one of the most impactful prompting discoveries.\n\n### Standard vs CoT\n\n**Standard prompt:**\n> Q: A train leaves Cape Town at 9am going 120km/h. Johannesburg is 1400km away. When does it arrive?\n> A: ...\n\n**Chain-of-thought prompt:**\n> Q: A train leaves Cape Town at 9am going 120km/h. Johannesburg is 1400km away. Let's think step by step.\n> A: \n> 1. Distance = 1400km, Speed = 120km/h\n> 2. Time = Distance/Speed = 1400/120 = 11.67 hours\n> 3. 11.67 hours = 11 hours 40 minutes\n> 4. 9am + 11h 40m = 8:40pm\n> Answer: The train arrives at 8:40pm\n\n### When CoT Helps\n- Multi-step maths problems\n- Logic and reasoning\n- Planning tasks\n- Code debugging\n\n### Zero-Shot CoT\nJust add "Let's think step by step" at the end. Surprisingly effective.\n\n### Few-Shot CoT\nProvide 2-3 worked examples in your prompt before the actual question.\n\n\`\`\`python\nprompt = """\nSolve each problem by thinking step by step.\n\nProblem: What is 15% of 240?\nThinking: 10% of 240 = 24. 5% = 12. 15% = 24+12 = 36.\nAnswer: 36\n\nProblem: What is 8% of 350?\nThinking:\n"""\n\`\`\``,
        },
        { id: "pe-m1-l4", title: "System Prompts and Personas", type: "reading", duration: 10 },
        { id: "pe-m1-l5", title: "Prompting Practice Lab", type: "exercise", duration: 30 },
      ]},
      { id: "pe-m2", title: "Advanced Techniques", lessons: [
        { id: "pe-m2-l1", title: "Structured Output: Getting JSON from LLMs", type: "reading", duration: 12 },
        { id: "pe-m2-l2", title: "ReAct: Reasoning + Acting", type: "reading", duration: 12 },
        { id: "pe-m2-l3", title: "Self-Consistency and Majority Voting", type: "reading", duration: 10 },
        { id: "pe-m2-l4", title: "Tree of Thoughts", type: "reading", duration: 10 },
        { id: "pe-m2-l5", title: "Prompt Engineering Final Project", type: "exercise", duration: 35 },
        { id: "pe-m2-l6", title: "Prompt Engineering Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "rag-systems",
    title: "RAG — Retrieval Augmented Generation",
    subtitle: "Give LLMs access to your own knowledge base",
    description: "RAG is one of the most important AI application patterns. Connect LLMs to your documents, databases, and knowledge bases so they can answer questions accurately without hallucinating. Build production-ready RAG pipelines.",
    track: "ai-llm", trackColor: "emerald",
    difficulty: "advanced", prerequisites: ["llm-fundamentals", "prompt-engineering"], estimatedHours: 9,
    icon: "💡",
    outcomes: [
      "Understand why RAG solves LLM hallucination",
      "Build document ingestion and chunking pipelines",
      "Create and query vector embeddings",
      "Implement semantic search with FAISS and Chroma",
      "Build a full RAG chatbot",
      "Apply advanced RAG: re-ranking, HyDE, RAPTOR",
    ],
    tags: ["rag", "vector database", "embeddings", "llm", "semantic search"],
    modules: [
      { id: "rag-m1", title: "RAG Foundations", lessons: [
        { id: "rag-m1-l1", title: "Why RAG? The Hallucination Problem", type: "reading", duration: 12 },
        { id: "rag-m1-l2", title: "Vector Embeddings and Semantic Search", type: "reading", duration: 15 },
        { id: "rag-m1-l3", title: "Document Chunking Strategies", type: "reading", duration: 12 },
        { id: "rag-m1-l4", title: "Setting Up a Vector Database (Chroma)", type: "exercise", duration: 25 },
      ]},
      { id: "rag-m2", title: "Building RAG Pipelines", lessons: [
        { id: "rag-m2-l1", title: "The Naive RAG Pipeline", type: "reading", duration: 12 },
        { id: "rag-m2-l2", title: "Build a Document Q&A System", type: "exercise", duration: 40 },
        { id: "rag-m2-l3", title: "Advanced RAG: Re-ranking and HyDE", type: "reading", duration: 15 },
        { id: "rag-m2-l4", title: "Evaluating RAG with RAGAS", type: "reading", duration: 12 },
        { id: "rag-m2-l5", title: "RAG Final Project", type: "exercise", duration: 50 },
        { id: "rag-m2-l6", title: "RAG Systems Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "llm-finetuning",
    title: "Fine-Tuning LLMs",
    subtitle: "Adapt foundation models to your specific domain",
    description: "When prompt engineering isn't enough, fine-tune. Learn LoRA, QLoRA, and full fine-tuning with PEFT. Train models on custom datasets for classification, instruction following, and domain adaptation.",
    track: "ai-llm", trackColor: "emerald",
    difficulty: "advanced", prerequisites: ["llm-fundamentals", "deep-learning-pytorch"], estimatedHours: 11,
    icon: "💡",
    outcomes: [
      "Understand when to fine-tune vs when to prompt engineer",
      "Apply LoRA and QLoRA for efficient fine-tuning",
      "Prepare and format instruction datasets",
      "Use Hugging Face PEFT and Trainer",
      "Evaluate fine-tuned models",
    ],
    tags: ["fine-tuning", "lora", "qlora", "hugging face", "peft"],
    modules: [
      { id: "ft-m1", title: "Fine-Tuning Concepts", lessons: [
        { id: "ft-m1-l1", title: "Full Fine-Tuning vs LoRA vs Prompting", type: "reading", duration: 12 },
        { id: "ft-m1-l2", title: "LoRA: Low-Rank Adaptation Explained", type: "reading", duration: 15 },
        { id: "ft-m1-l3", title: "QLoRA: Fine-Tuning on Consumer Hardware", type: "reading", duration: 12 },
        { id: "ft-m1-l4", title: "Preparing Instruction Datasets", type: "reading", duration: 12 },
      ]},
      { id: "ft-m2", title: "Fine-Tuning in Practice", lessons: [
        { id: "ft-m2-l1", title: "Hugging Face PEFT and Transformers", type: "reading", duration: 15 },
        { id: "ft-m2-l2", title: "Fine-Tune Llama 3 with QLoRA", type: "exercise", duration: 50 },
        { id: "ft-m2-l3", title: "Evaluating Your Fine-Tuned Model", type: "reading", duration: 12 },
        { id: "ft-m2-l4", title: "Deployment: Merging LoRA Weights", type: "reading", duration: 10 },
        { id: "ft-m2-l5", title: "Fine-Tuning Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 7 — AGENTIC AI
  // ════════════════════════════════════════════════════════════
  {
    id: "ai-agents-fundamentals",
    title: "AI Agents & Reasoning",
    subtitle: "Build autonomous AI systems that plan and act",
    description: "The next frontier of AI: agents that can perceive, plan, and take actions to complete complex goals. Understand the architecture of AI agents, tool use, memory systems, and the reasoning patterns that make agents work.",
    track: "agentic-ai", trackColor: "orange",
    difficulty: "intermediate", prerequisites: ["prompt-engineering"], estimatedHours: 9,
    icon: "⚡",
    outcomes: [
      "Understand the agent loop: perceive → plan → act",
      "Build tool-using AI agents",
      "Implement agent memory: in-context, external, episodic",
      "Use function/tool calling with Claude and OpenAI APIs",
      "Build a ReAct agent from scratch",
    ],
    tags: ["agents", "tool use", "agentic ai", "reasoning", "planning"],
    modules: [
      { id: "agent-m1", title: "Agent Architecture", lessons: [
        { id: "agent-m1-l1", title: "What is an AI Agent?", type: "reading", duration: 12,
          content: `## What is an AI Agent?\n\nAn AI agent is a system that can **perceive** its environment, **reason** about what to do, and **take actions** to achieve a goal — doing this in a loop until the goal is complete.\n\n## The Agent Loop\n\n\`\`\`\nPerceive → Think → Act → Observe → Repeat\n\`\`\`\n\n1. **Perceive** — receive input (user query, tool output, context)\n2. **Think** — reason about what to do (using an LLM)\n3. **Act** — call a tool, search the web, write a file, run code\n4. **Observe** — receive the tool's output\n5. **Repeat** — until the goal is achieved\n\n## Agents vs Chains vs Simple LLM Calls\n| Type | Description | Example |\n|---|---|---|\n| LLM Call | Single query → single response | Ask Claude a question |\n| Chain | Fixed sequence of steps | Summarise → translate → email |\n| Agent | Dynamic, decides its own next steps | "Research and write a report" |\n\n## What Makes a Good Agent?\n1. **A capable LLM** for reasoning (Claude 3.5/4, GPT-4o)\n2. **Tools** — search, code execution, file system, APIs\n3. **Memory** — context of past actions\n4. **Clear goal definition**\n\n## Real Agent Examples\n- **Coding agents**: Devin, SWE-agent, Claude Code\n- **Research agents**: AutoGPT, OpenAI Deep Research\n- **Customer service**: Intercom Fin, Salesforce Agentforce\n- **Data analysis**: Code Interpreter, Replit Agent`,
        },
        { id: "agent-m1-l2", title: "Tool Use and Function Calling", type: "reading", duration: 15 },
        { id: "agent-m1-l3", title: "Agent Memory Systems", type: "reading", duration: 12 },
        { id: "agent-m1-l4", title: "Build a Tool-Calling Agent with Claude API", type: "exercise", duration: 40 },
      ]},
      { id: "agent-m2", title: "Reasoning Patterns", lessons: [
        { id: "agent-m2-l1", title: "ReAct: Reason + Act Pattern", type: "reading", duration: 12 },
        { id: "agent-m2-l2", title: "Plan-and-Execute Agents", type: "reading", duration: 10 },
        { id: "agent-m2-l3", title: "Reflection and Self-Critique", type: "reading", duration: 10 },
        { id: "agent-m2-l4", title: "Build a ReAct Agent from Scratch", type: "exercise", duration: 45 },
        { id: "agent-m2-l5", title: "AI Agents Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "langchain-agents",
    title: "Building Agents with LangChain",
    subtitle: "Production AI agents using the LangChain ecosystem",
    description: "LangChain is the most popular framework for building AI applications. Learn chains, agents, tools, memory, and LangGraph for stateful workflows. Build a research agent, a code generation agent, and a data analysis agent.",
    track: "agentic-ai", trackColor: "orange",
    difficulty: "advanced", prerequisites: ["ai-agents-fundamentals"], estimatedHours: 12,
    icon: "⚡",
    outcomes: [
      "Build chains and agents with LangChain",
      "Use LangChain Tools and Toolkits",
      "Implement conversation memory",
      "Build stateful agent workflows with LangGraph",
      "Deploy LangChain apps with LangServe",
    ],
    tags: ["langchain", "langgraph", "agents", "tools", "workflows"],
    modules: [
      { id: "lc-m1", title: "LangChain Fundamentals", lessons: [
        { id: "lc-m1-l1", title: "LangChain Architecture and Components", type: "reading", duration: 12 },
        { id: "lc-m1-l2", title: "LLMs, Chat Models, and Prompt Templates", type: "reading", duration: 12 },
        { id: "lc-m1-l3", title: "Chains: Connecting Components", type: "reading", duration: 12 },
        { id: "lc-m1-l4", title: "Tools and Toolkits", type: "reading", duration: 12 },
        { id: "lc-m1-l5", title: "Building Your First LangChain Agent", type: "exercise", duration: 35 },
      ]},
      { id: "lc-m2", title: "LangGraph: Stateful Workflows", lessons: [
        { id: "lc-m2-l1", title: "Why LangGraph? Limitations of Linear Chains", type: "reading", duration: 10 },
        { id: "lc-m2-l2", title: "Nodes, Edges, and State in LangGraph", type: "reading", duration: 15 },
        { id: "lc-m2-l3", title: "Build a Research Agent with LangGraph", type: "exercise", duration: 50 },
        { id: "lc-m2-l4", title: "Human-in-the-Loop Workflows", type: "reading", duration: 12 },
        { id: "lc-m2-l5", title: "LangChain Final Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "multi-agent-systems",
    title: "Multi-Agent Systems with CrewAI",
    subtitle: "Orchestrate teams of specialised AI agents",
    description: "Multi-agent systems distribute complex tasks across specialised agents that collaborate. Build crews of agents with CrewAI, understand agent communication and coordination, and tackle tasks no single agent can handle alone.",
    track: "agentic-ai", trackColor: "orange",
    difficulty: "advanced", prerequisites: ["langchain-agents"], estimatedHours: 10,
    icon: "⚡",
    outcomes: [
      "Design effective multi-agent architectures",
      "Build and orchestrate agent crews with CrewAI",
      "Define roles, goals, and backstories for agents",
      "Implement sequential and parallel agent workflows",
      "Handle agent communication and error recovery",
    ],
    tags: ["crewai", "multi-agent", "orchestration", "collaboration"],
    modules: [
      { id: "mas-m1", title: "Multi-Agent Design", lessons: [
        { id: "mas-m1-l1", title: "When to Use Multiple Agents", type: "reading", duration: 10 },
        { id: "mas-m1-l2", title: "Agent Roles and Specialisation", type: "reading", duration: 12 },
        { id: "mas-m1-l3", title: "CrewAI: Crews, Agents, Tasks, Tools", type: "reading", duration: 15 },
        { id: "mas-m1-l4", title: "Build a Research → Write → Review Crew", type: "exercise", duration: 45 },
      ]},
      { id: "mas-m2", title: "Advanced Crews", lessons: [
        { id: "mas-m2-l1", title: "Hierarchical vs Sequential Crews", type: "reading", duration: 10 },
        { id: "mas-m2-l2", title: "Custom Tools for Agent Crews", type: "reading", duration: 12 },
        { id: "mas-m2-l3", title: "Multi-Agent Data Analysis Pipeline", type: "exercise", duration: 50 },
        { id: "mas-m2-l4", title: "Testing and Debugging Multi-Agent Systems", type: "reading", duration: 12 },
        { id: "mas-m2-l5", title: "Multi-Agent Systems Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "agentic-ai-production",
    title: "Agentic AI in Production",
    subtitle: "Deploy, monitor, and scale AI agent systems",
    description: "Taking AI agents from prototype to production. Reliability, safety, evaluation, cost management, observability with LangSmith, and patterns for production agentic systems.",
    track: "agentic-ai", trackColor: "orange",
    difficulty: "advanced", prerequisites: ["multi-agent-systems"], estimatedHours: 8,
    icon: "⚡",
    outcomes: [
      "Evaluate agent quality and reliability systematically",
      "Implement guardrails and safety layers",
      "Monitor agents in production with LangSmith",
      "Optimise agent costs and latency",
      "Architect production-grade agentic systems",
    ],
    tags: ["production", "agents", "monitoring", "safety", "evaluation"],
    modules: [
      { id: "aap-m1", title: "Production Concerns", lessons: [
        { id: "aap-m1-l1", title: "Reliability and Failure Modes in Agents", type: "reading", duration: 12 },
        { id: "aap-m1-l2", title: "Agent Evaluation Frameworks", type: "reading", duration: 12 },
        { id: "aap-m1-l3", title: "Observability with LangSmith", type: "exercise", duration: 25 },
        { id: "aap-m1-l4", title: "Safety, Guardrails, and Human Oversight", type: "reading", duration: 12 },
        { id: "aap-m1-l5", title: "Cost Optimisation: Caching and Model Routing", type: "reading", duration: 10 },
        { id: "aap-m1-l6", title: "Production Architecture Patterns", type: "reading", duration: 15 },
        { id: "aap-m1-l7", title: "Agentic AI Capstone Project", type: "exercise", duration: 60 },
        { id: "aap-m1-l8", title: "Agentic AI Final Quiz", type: "quiz", duration: 20 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 8 — WEB DEVELOPMENT
  // ════════════════════════════════════════════════════════════
  {
    id: "html-css-fundamentals",
    title: "HTML & CSS Fundamentals",
    subtitle: "Build and style web pages from scratch",
    description: "Start your web development journey. Learn HTML to structure content and CSS to make it beautiful. Build real web pages and understand responsive design with Flexbox and Grid.",
    track: "web-dev", trackColor: "cyan",
    difficulty: "beginner", prerequisites: [], estimatedHours: 7,
    icon: "🌐",
    outcomes: [
      "Write semantic HTML5 markup",
      "Style pages with CSS selectors and properties",
      "Build layouts with Flexbox and CSS Grid",
      "Make pages responsive for mobile and desktop",
      "Build and publish a real webpage",
    ],
    tags: ["html", "css", "web", "beginner", "flexbox"],
    modules: [
      { id: "html-m1", title: "HTML Foundations", lessons: [
        { id: "html-m1-l1", title: "What is HTML?", type: "reading", duration: 10 },
        { id: "html-m1-l2", title: "Structure: head, body, and semantic tags", type: "reading", duration: 12 },
        { id: "html-m1-l3", title: "Links, Images, Lists, and Tables", type: "reading", duration: 12 },
        { id: "html-m1-l4", title: "Forms and Input Elements", type: "reading", duration: 12 },
        { id: "html-m1-l5", title: "Build Your First Webpage", type: "exercise", duration: 30 },
      ]},
      { id: "html-m2", title: "CSS Styling", lessons: [
        { id: "html-m2-l1", title: "Selectors, Properties, and the Cascade", type: "reading", duration: 12 },
        { id: "html-m2-l2", title: "The Box Model", type: "reading", duration: 10 },
        { id: "html-m2-l3", title: "Flexbox Layouts", type: "reading", duration: 15 },
        { id: "html-m2-l4", title: "CSS Grid", type: "reading", duration: 15 },
        { id: "html-m2-l5", title: "Responsive Design with Media Queries", type: "reading", duration: 12 },
        { id: "html-m2-l6", title: "Build a Responsive Landing Page", type: "exercise", duration: 40 },
        { id: "html-m2-l7", title: "HTML & CSS Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "javascript-essentials",
    title: "JavaScript Essentials",
    subtitle: "Make web pages interactive with JavaScript",
    description: "JavaScript is the language of the web. Add interactivity, handle user events, fetch data from APIs, and manipulate the DOM. Learn modern JavaScript (ES6+) the right way.",
    track: "web-dev", trackColor: "cyan",
    difficulty: "beginner", prerequisites: ["html-css-fundamentals"], estimatedHours: 9,
    icon: "🌐",
    outcomes: [
      "Write modern JavaScript with ES6+ features",
      "Manipulate the DOM to create interactive pages",
      "Handle events and user interactions",
      "Fetch data from REST APIs",
      "Use async/await for asynchronous code",
    ],
    tags: ["javascript", "dom", "es6", "fetch", "events"],
    modules: [
      { id: "js-m1", title: "JavaScript Foundations", lessons: [
        { id: "js-m1-l1", title: "Variables, Types, and Operators", type: "reading", duration: 12 },
        { id: "js-m1-l2", title: "Functions and Arrow Functions", type: "reading", duration: 12 },
        { id: "js-m1-l3", title: "Arrays and Array Methods", type: "reading", duration: 15 },
        { id: "js-m1-l4", title: "Objects and Destructuring", type: "reading", duration: 12 },
        { id: "js-m1-l5", title: "JS Foundations Practice", type: "exercise", duration: 25 },
      ]},
      { id: "js-m2", title: "The DOM and Events", lessons: [
        { id: "js-m2-l1", title: "DOM Manipulation", type: "reading", duration: 15 },
        { id: "js-m2-l2", title: "Event Listeners and Callbacks", type: "reading", duration: 12 },
        { id: "js-m2-l3", title: "Build an Interactive To-Do App", type: "exercise", duration: 35 },
      ]},
      { id: "js-m3", title: "Async JavaScript", lessons: [
        { id: "js-m3-l1", title: "Promises and the Event Loop", type: "reading", duration: 15 },
        { id: "js-m3-l2", title: "async/await and fetch()", type: "reading", duration: 12 },
        { id: "js-m3-l3", title: "Fetch Data from a Real API", type: "exercise", duration: 30 },
        { id: "js-m3-l4", title: "JavaScript Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "react-nextjs",
    title: "React & Next.js",
    subtitle: "Build modern web applications with React",
    description: "React is the world's most popular UI library. Learn components, props, state, hooks, and then move to Next.js for server-side rendering, routing, and full-stack capabilities — the exact stack powering DAQS Learn.",
    track: "web-dev", trackColor: "cyan",
    difficulty: "intermediate", prerequisites: ["javascript-essentials"], estimatedHours: 14,
    icon: "🌐",
    outcomes: [
      "Build reusable React components",
      "Manage state with useState and useReducer",
      "Fetch data with useEffect and React Query",
      "Build full-stack apps with Next.js App Router",
      "Style with Tailwind CSS",
    ],
    tags: ["react", "nextjs", "hooks", "tailwind", "typescript"],
    modules: [
      { id: "react-m1", title: "React Fundamentals", lessons: [
        { id: "react-m1-l1", title: "Components and JSX", type: "reading", duration: 15 },
        { id: "react-m1-l2", title: "Props and Component Composition", type: "reading", duration: 12 },
        { id: "react-m1-l3", title: "useState — Managing Component State", type: "reading", duration: 12 },
        { id: "react-m1-l4", title: "useEffect — Side Effects", type: "reading", duration: 12 },
        { id: "react-m1-l5", title: "Build a React App from Scratch", type: "exercise", duration: 40 },
      ]},
      { id: "react-m2", title: "Next.js", lessons: [
        { id: "react-m2-l1", title: "Next.js App Router and File-Based Routing", type: "reading", duration: 12 },
        { id: "react-m2-l2", title: "Server vs Client Components", type: "reading", duration: 12 },
        { id: "react-m2-l3", title: "API Routes in Next.js", type: "reading", duration: 12 },
        { id: "react-m2-l4", title: "Data Fetching Patterns", type: "reading", duration: 12 },
        { id: "react-m2-l5", title: "Build a Full-Stack Next.js App", type: "exercise", duration: 50 },
        { id: "react-m2-l6", title: "React & Next.js Quiz", type: "quiz", duration: 20 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 9 — DATA ENGINEERING
  // ════════════════════════════════════════════════════════════
  {
    id: "sql-fundamentals",
    title: "SQL for Data Analysis",
    subtitle: "Query and analyse data with SQL",
    description: "SQL is the most used data skill in the world. Every data-driven company uses it. Learn to write queries from simple SELECTs to complex multi-table JOINs, window functions, and subqueries.",
    track: "data-engineering", trackColor: "lime",
    difficulty: "beginner", prerequisites: [], estimatedHours: 7,
    icon: "🗄️",
    outcomes: [
      "Write SELECT queries to retrieve data",
      "Filter, sort, and aggregate data",
      "Join multiple tables",
      "Use window functions for running totals and rankings",
      "Write subqueries and CTEs",
    ],
    tags: ["sql", "database", "queries", "beginner"],
    modules: [
      { id: "sql-m1", title: "SQL Basics", lessons: [
        { id: "sql-m1-l1", title: "What is a Relational Database?", type: "reading", duration: 10 },
        { id: "sql-m1-l2", title: "SELECT, FROM, WHERE", type: "reading", duration: 12 },
        { id: "sql-m1-l3", title: "Aggregate Functions: COUNT, SUM, AVG", type: "reading", duration: 10 },
        { id: "sql-m1-l4", title: "GROUP BY and HAVING", type: "reading", duration: 10 },
        { id: "sql-m1-l5", title: "ORDER BY and LIMIT", type: "reading", duration: 8 },
        { id: "sql-m1-l6", title: "SQL Basics Practice", type: "exercise", duration: 30 },
      ]},
      { id: "sql-m2", title: "Joins and Advanced Queries", lessons: [
        { id: "sql-m2-l1", title: "INNER, LEFT, RIGHT, FULL OUTER JOIN", type: "reading", duration: 15 },
        { id: "sql-m2-l2", title: "Subqueries and CTEs", type: "reading", duration: 12 },
        { id: "sql-m2-l3", title: "Window Functions: ROW_NUMBER, RANK, LAG/LEAD", type: "reading", duration: 15 },
        { id: "sql-m2-l4", title: "Advanced SQL Practice", type: "exercise", duration: 35 },
        { id: "sql-m2-l5", title: "SQL Final Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "data-engineering-python",
    title: "Data Engineering with Python",
    subtitle: "Build data pipelines, ETL, and batch processing systems",
    description: "Data engineers build the infrastructure that powers data science and ML. Learn to build ETL pipelines, work with Airflow for orchestration, process big data with PySpark, and architect data warehouses.",
    track: "data-engineering", trackColor: "lime",
    difficulty: "advanced", prerequisites: ["python-intermediate", "sql-fundamentals"], estimatedHours: 12,
    icon: "🗄️",
    outcomes: [
      "Build ETL pipelines with Python",
      "Orchestrate workflows with Apache Airflow",
      "Process large datasets with PySpark",
      "Work with data warehouse patterns (Star Schema, Lakehouse)",
      "Use dbt for data transformation",
    ],
    tags: ["etl", "airflow", "spark", "data pipeline", "dbt"],
    modules: [
      { id: "de-m1", title: "ETL and Pipelines", lessons: [
        { id: "de-m1-l1", title: "The Data Engineering Landscape", type: "reading", duration: 10 },
        { id: "de-m1-l2", title: "ETL vs ELT", type: "reading", duration: 10 },
        { id: "de-m1-l3", title: "Build an ETL Pipeline with Python", type: "exercise", duration: 40 },
        { id: "de-m1-l4", title: "Workflow Orchestration with Airflow", type: "reading", duration: 15 },
      ]},
      { id: "de-m2", title: "Big Data", lessons: [
        { id: "de-m2-l1", title: "Introduction to PySpark", type: "reading", duration: 15 },
        { id: "de-m2-l2", title: "Data Warehouse Patterns", type: "reading", duration: 12 },
        { id: "de-m2-l3", title: "dbt: Data Build Tool", type: "reading", duration: 12 },
        { id: "de-m2-l4", title: "Data Engineering Project", type: "exercise", duration: 50 },
        { id: "de-m2-l5", title: "Data Engineering Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // TRACK 10 — CAREER & ETHICS
  // ════════════════════════════════════════════════════════════
  {
    id: "ai-ethics",
    title: "AI Ethics & Responsible AI",
    subtitle: "Build AI that is fair, safe, and beneficial",
    description: "As AI becomes more powerful, using it responsibly becomes critical. Understand bias in AI systems, fairness metrics, privacy concerns, AI safety, and how to build ethical AI products. This course is relevant for everyone building with AI.",
    track: "career", trackColor: "pink",
    difficulty: "beginner", prerequisites: ["ai-fundamentals"], estimatedHours: 5,
    icon: "🎯",
    outcomes: [
      "Identify and mitigate bias in AI systems",
      "Understand AI safety and alignment challenges",
      "Apply fairness metrics in ML models",
      "Navigate GDPR and data privacy in AI",
      "Develop a personal framework for ethical AI",
    ],
    tags: ["ethics", "fairness", "bias", "safety", "responsible ai"],
    modules: [
      { id: "ethics-m1", title: "AI Bias and Fairness", lessons: [
        { id: "ethics-m1-l1", title: "What is Algorithmic Bias?", type: "reading", duration: 12 },
        { id: "ethics-m1-l2", title: "Fairness Metrics and Tradeoffs", type: "reading", duration: 15 },
        { id: "ethics-m1-l3", title: "Case Studies: When AI Went Wrong", type: "reading", duration: 12 },
      ]},
      { id: "ethics-m2", title: "Safety and Governance", lessons: [
        { id: "ethics-m2-l1", title: "AI Safety and Alignment", type: "reading", duration: 15 },
        { id: "ethics-m2-l2", title: "Privacy, GDPR, and Data Rights", type: "reading", duration: 12 },
        { id: "ethics-m2-l3", title: "AI Governance Frameworks", type: "reading", duration: 10 },
        { id: "ethics-m2-l4", title: "Your Ethical AI Framework", type: "exercise", duration: 20 },
        { id: "ethics-m2-l5", title: "AI Ethics Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },

  {
    id: "building-ai-products",
    title: "Building AI Products",
    subtitle: "Ship AI-powered applications from idea to launch",
    description: "Turn your AI knowledge into real products. Product design, user experience for AI, evaluation and safety, cost management, and the full journey from prototype to paying customers. For builders and founders.",
    track: "career", trackColor: "pink",
    difficulty: "advanced", prerequisites: ["prompt-engineering", "ml-fundamentals"], estimatedHours: 8,
    icon: "🎯",
    outcomes: [
      "Design AI product experiences users trust",
      "Evaluate AI system quality rigorously",
      "Manage LLM costs at scale",
      "Build AI product roadmaps",
      "Launch and monetise an AI product",
    ],
    tags: ["product", "startup", "ai product", "launch", "monetisation"],
    modules: [
      { id: "aip-m1", title: "AI Product Design", lessons: [
        { id: "aip-m1-l1", title: "What Makes an AI Product Different", type: "reading", duration: 10 },
        { id: "aip-m1-l2", title: "UX Patterns for AI: Trust and Transparency", type: "reading", duration: 12 },
        { id: "aip-m1-l3", title: "Evals: How to Know Your AI Actually Works", type: "reading", duration: 15 },
        { id: "aip-m1-l4", title: "Cost Management and LLM Optimisation", type: "reading", duration: 12 },
        { id: "aip-m1-l5", title: "Building an AI Product Roadmap", type: "exercise", duration: 35 },
        { id: "aip-m1-l6", title: "From Prototype to Product: Launch Checklist", type: "reading", duration: 12 },
        { id: "aip-m1-l7", title: "Monetisation: SaaS, API, Credits, Enterprise", type: "reading", duration: 10 },
        { id: "aip-m1-l8", title: "AI Products Quiz", type: "quiz", duration: 15 },
      ]},
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getCoursesByTrack(trackId: string): Course[] {
  return courses.filter((c) => c.track === trackId);
}

export function getPrerequisiteCourses(courseId: string): Course[] {
  const course = getCourse(courseId);
  if (!course) return [];
  return course.prerequisites.map((pid) => getCourse(pid)!).filter(Boolean);
}

export function getTotalLessons(course: Course): number {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function isEnrollable(courseId: string, completedCourseIds: string[]): boolean {
  const course = getCourse(courseId);
  if (!course) return false;
  return course.prerequisites.every((pid) => completedCourseIds.includes(pid));
}
