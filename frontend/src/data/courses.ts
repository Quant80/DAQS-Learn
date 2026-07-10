export type LessonType = "video" | "reading" | "exercise" | "quiz";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutes
  content?: string; // markdown for reading lessons
  notebookFile?: string; // filename in /public/notebooks/ — links to Jupyter
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
  { id: "python", label: "Python", color: "sky", icon: "/Python-Logo.png" },
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
    title: "Python Beginner",
    subtitle: "Master the building blocks of Python programming",
    description: "Start your coding journey with Python — the world's most popular programming language. You will go from writing your very first line of code to building real programs with functions, loops, and data structures.",
    track: "python", trackColor: "sky",
    difficulty: "beginner", prerequisites: [], estimatedHours: 8,
    icon: "/Python-Logo.png",
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
            id: "py-m1-l1", title: "What is Python and Why Learn It?", type: "reading", duration: 10,
            notebookFile: "02_hello_python.ipynb",
            content: `## What is Python?\n\nPython is a **simple, general purpose, dynamic, object-oriented, interpreted and compiled, high-level programming language**.\n\n| **Property** | **What it means** |\n|---|---|\n| **Simple** | Easy to learn and code — reads almost like English |\n| **General Purpose** | Can be used to build just about anything |\n| **High-Level** | Human-readable — easily understandable by people |\n| **Easy to Debug** | Easy to find and fix errors in your code |\n| **Dynamic** | No need to declare variable types — Python handles it |\n| **Object-Oriented** | Code can be structured and grouped based on behaviour |\n| **Interpreted + Compiled** | Source code → Bytecode → PVM → Output |\n\n## How Python Runs Your Code\n\nPython's execution is a two-step process: first your code is compiled to **bytecode**, then the **PVM (Python Virtual Machine)** interprets and runs it.\n\n\`\`\`\nYour Code (.py)  →  Python Compiler  →  Bytecode (.pyc)  →  PVM  →  Output\n\`\`\`\n\n> Python is technically a **compiled-interpreted language** — compile to bytecode first, then interpret. Because the PVM runs the same bytecode on any platform, Python is **platform independent** — the same program runs on Windows, Mac, and Linux.\n\n## 4 Reasons to Study Python\n\n1. One of the **easiest** programming languages to learn for beginners\n2. The **fastest growing** language in the world (Stack Overflow surveys)\n3. Vast **implementation areas** — web, AI, science, games, automation\n4. Used in **many companies** — Google, NASA, Netflix, Spotify, Instagram\n\n## History of Python\n\n| **When** | **Milestone** |\n|---|---|\n| **Early 1990s** | Development began in the Netherlands by **Guido Van Rossum**, derived from the ABC language; open source from the start |\n| **1991** | Guido released the first version publicly |\n| **January 1994** | Python 1.0 released officially |\n| **October 2000** | Python 2.0 released — added garbage collection, Unicode support |\n| **December 2008** | Python 3.0 released — major redesign, **NOT backward-compatible** with Python 2 |\n| **February 2024** | Python 3.12 — current stable version |\n\n> **Why "Python"?** While creating Python, Guido was reading scripts from **"Monty Python's Flying Circus"** — a British comedy TV show from the 1970s. He needed a short, unique name and chose "Python" after the show — **not the snake!**\n>\n> **Important:** Python 3 is NOT backward compatible with Python 2. Python 2 programs may NOT run in Python 3. This course uses Python 3.\n\n## Features of Python\n\n| **Feature** | **Description** |\n|---|---|\n| **Simple** | Python syntax is very easy — easier to learn and understand than most other languages |\n| **Open Source** | Download freely and customise the source code as well |\n| **Platform Independent** | Not dependent on any specific OS — same program runs on Windows, Mac, and Linux |\n| **Portable** | Gives the same result on any platform — write once, run anywhere |\n| **Huge Library** | A big ecosystem of libraries to fulfil many requirements |\n| **Database Connectivity** | Provides interfaces to connect with Oracle, MySQL, PostgreSQL, and more |\n\n## Simplicity: Python vs C\n\n\`\`\`c\n// Hello World in C — 7 lines:\n#include <stdio.h>\nint main() {\n    printf("Hello World");\n    return 0;\n}\n\`\`\`\n\n\`\`\`python\n# Hello World in Python — 1 line:\nprint("Hello World")\n\`\`\`\n\n7 lines in C vs 1 line in Python — same output! This is why Python is the recommended language for beginners.\n\n## 10 Application Areas of Python\n\n| **#** | **Application Area** | **Python Tools** | **Real Examples** |\n|---|---|---|---|\n| **1** | **Web Development** | Flask, Django | Instagram, Pinterest |\n| **2** | **Game Development** | PyGame | 2D/3D video games |\n| **3** | **AI & Machine Learning** | TensorFlow, PyTorch, Pandas, Scikit-Learn, NumPy | YouTube recommendations, self-driving cars |\n| **4** | **Desktop & Mobile Apps** | Tkinter, Kivy | GUI desktop applications |\n| **5** | **Image Processing** | OpenCV, PIL | Face recognition systems |\n| **6** | **Text Processing / NLP** | NLTK, SpaCy | Facebook hate speech detection, chatbots |\n| **7** | **Audio & Video** | Pyo, pyAudioAnalysis, Scikit-video, OpenCV | Spotify, Netflix, YouTube |\n| **8** | **Web Scraping** | BeautifulSoup, Selenium, Requests | Price tracking, news aggregators |\n| **9** | **Data Science & Visualisation** | Matplotlib, Seaborn, Pandas | Dashboards, BI reports |\n| **10** | **Scientific & Numeric** | SciPy, FreeCAD, Abaqus | Physics simulation, engineering tools |\n\n> *Python is an extremely robust and versatile language — its ability to be deployed into virtually any domain is remarkable, thanks to its vast ecosystem of diverse libraries.*`,
          },
          { id: "py-m1-l2", title: "Installing Python & Setting Up Jupyter", type: "reading", duration: 12,
            notebookFile: "01_get_started.ipynb",
            content: `## Machine Language vs High-Level Language\n\n| **Aspect** | **Machine Language** | **High-Level Language** |\n|---|---|---|\n| **Form** | Binary (0s and 1s) | Human-readable words |\n| **Example** | \`01001000 01100101\` | \`print("Hello")\` |\n| **Speed** | Fastest — CPU reads directly | Slower — needs translation |\n| **Portability** | Not portable (CPU-specific) | Portable across platforms |\n| **Ease** | Very difficult | Easy to learn and write |\n\n## Compiler vs Interpreter\n\n| **Aspect** | **Compiler** | **Interpreter** |\n|---|---|---|\n| **Process** | Translates entire program at once | Translates one statement at a time |\n| **Speed** | Faster execution | Slower execution |\n| **Error reporting** | All errors reported together at the end | Stops at first error |\n| **Output** | Produces an executable file | No separate executable |\n| **Examples** | C, C++, Java (javac) | Python, Ruby |\n\n> **Movie Analogy:** A compiler is like subtitling an entire Italian movie before the audience watches it. An interpreter is like having a live translator in the cinema who translates sentence by sentence as the film plays.\n\n## IDE Comparison\n\n| **IDE** | **Best For** | **Key Feature** |\n|---|---|---|\n| **Jupyter Notebook** | Data Science, ML | Interactive cells, inline visualisations |\n| **VS Code** | All-purpose development | Extensions, debugging, Git integration |\n| **PyCharm** | Large projects | Full IDE, refactoring tools |\n| **IDLE** | Beginners | Comes bundled with Python |\n| **Spyder** | Scientific computing | Variable explorer, console |\n\n## Installing Jupyter Notebook (via Anaconda)\n\n\`\`\`\nStep 1  →  Visit https://www.anaconda.com/download\nStep 2  →  Select your OS (Windows / Mac / Linux)\nStep 3  →  Download the current Python version\nStep 4  →  Open the downloaded file and click Continue\nStep 5  →  Select 'Install for me only'\nStep 6  →  Wait for: 'The installation was completed successfully'\nStep 7  →  Click Close\n\`\`\`\n\n## Running Code in Jupyter\n\n\`\`\`\nStep 1  →  Open Anaconda Prompt (Windows) or Terminal (Mac/Linux)\nStep 2  →  Navigate to your desired folder\nStep 3  →  Type: jupyter notebook   (opens in your browser)\nStep 4  →  Click New → Python 3\nStep 5  →  Write your code in a cell\nStep 6  →  Press Shift + Enter to run\nStep 7  →  Output appears below the cell\n\`\`\`\n\n## Jupyter Keyboard Shortcuts\n\n| **Shortcut** | **Action** |\n|---|---|\n| **Shift + Enter** | Run current cell and move to next |\n| **Ctrl + Enter** | Run current cell and stay in place |\n| **B** (command mode) | Add new cell below |\n| **A** (command mode) | Add new cell above |\n| **D, D** (command mode) | Delete current cell |\n| **Esc** | Switch to command mode |\n| **Enter** | Switch to edit mode |\n| **M** (command mode) | Change cell to Markdown |\n| **Y** (command mode) | Change cell to Code |\n| **Ctrl + S** | Save notebook |\n\n## Python is Case-Sensitive\n\n\`\`\`python\nprint("Hello World")   # works correctly\nPrint("Hello World")   # NameError — capital P is not recognised!\nPRINT("Hello World")   # NameError!\n\`\`\`\n\n## Python as a Calculator\n\n\`\`\`python\nprint(10 + 5)    # 15   — addition\nprint(10 - 3)    # 7    — subtraction\nprint(4 * 6)     # 24   — multiplication\nprint(20 / 4)    # 5.0  — division (ALWAYS returns float!)\nprint(2 ** 10)   # 1024 — exponentiation (2 to the power 10)\nprint(20 // 3)   # 6    — floor division (rounds DOWN)\nprint(20 % 3)    # 2    — modulo (remainder)\n\`\`\``,
          },
          {
            id: "py-m1-l3", title: "Your First Python Program", type: "exercise", duration: 15,
            notebookFile: "02_hello_python.ipynb",
            content: `## Exercise: Write Your First Python Programs\n\nOpen the notebook and complete each task in your own cells.\n\n### Task 1 — Hello World (the classic first program)\n\`\`\`python\nprint("Hello World")\n\`\`\`\n\n### Task 2 — Python facts with print()\n\`\`\`python\nprint("Python was created by Guido van Rossum in", 1991)\nprint("Python version:", 3.12)\nprint(2 ** 10)   # 1024\n\`\`\`\n\n### Task 3 — Comments\n\`\`\`python\n# This is a single-line comment — Python ignores it entirely\nprint("Comments make code readable")  # inline comment\n# print("This line is commented out — Python will NOT run it")\n\`\`\`\n\n### Task 4 — Python History Quiz\n\`\`\`python\nprint("1. Python was created by Guido van Rossum")\nprint("2. Python was created in the Netherlands")\nprint("3. Python was named after Monty Python\\'s Flying Circus")\nprint("4. Python was derived from the ABC language")\nprint("5. Python 3.0 was released in December 2008")\n\`\`\`\n\n### Task 5 — Use variables\n\`\`\`python\nname           = "Your name here"\nfavourite_area = "Data Science"   # change to your favourite area\nprint(name, "wants to use Python for", favourite_area)\n\`\`\`\n\n### Challenge — Application Areas Table\n\`\`\`python\nprint("Application Area      | Tool")\nprint("----------------------+---------------------------")\nprint("Web Development       | Flask, Django")\nprint("AI & Machine Learning | TensorFlow, PyTorch")\nprint("Data Science          | Pandas, Matplotlib")\nprint("Game Development      | PyGame")\nprint("Web Scraping          | BeautifulSoup, Selenium")\n\`\`\``,
          },
        ],
      },
      {
        id: "py-m2", title: "Variables & Data Types",
        lessons: [
          { id: "py-m2-l1", title: "Variables — Storing Data in Memory", type: "reading", duration: 15,
            notebookFile: "03_variables.ipynb",
            content: `## What is a Variable?\n\nThink of a variable like a **shelf in a library** — the shelf has a label (name), and you store a book (value) on it. You can always go back to that shelf by its label to get or change the book.\n\n> A **variable** is a named storage location in memory that holds a value. The value can change during the program — that's why it's called a *variable*.\n\nEvery variable in Python has **5 properties**:\n\n| **Property** | **Description** | **Example** |\n|---|---|---|\n| **Name** | What you call it (the label) | \`learner_name\` |\n| **Value** | What it stores | \`"Sipho"\` |\n| **Type** | Kind of data | \`str\` |\n| **Memory address** | Where it lives in RAM | use \`id()\` to see |\n| **Scope** | Where it can be used | local / global |\n\n## Creating Variables — 3 Ways to Print\n\n\`\`\`python\nlearner_name = "Sipho"\nage          = 17\npass_rate    = 73.5\nhas_passed   = True\n\n# Method 1 — comma-separated (spaces added automatically)\nprint("My name is", learner_name, "and I am", age, "years old.")\n\n# Method 2 — f-string (recommended — most readable)\nprint(f"My name is {learner_name} and I am {age} years old.")\n\n# Method 3 — concatenation (must convert non-strings with str())\nprint("My name is " + learner_name + " and I am " + str(age) + " years old.")\n\`\`\`\n\n## The input() Function\n\nUse \`input()\` to get data from the user. It always returns a **string** — convert it if you need a number.\n\n\`\`\`python\nname = input("What is your name? ")          # returns str\nage  = int(input("How old are you? "))       # convert to int\ngpa  = float(input("What is your GPA? "))    # convert to float\nprint(f"Hello {name}, you are {age} years old with a GPA of {gpa}.")\n\`\`\`\n\nThe \`\\n\` inside a string creates a new line:\n\`\`\`python\na = int(input("Enter your age\\n"))   # \\n moves cursor to next line before user types\n\`\`\`\n\n## Variable Naming Rules — 6 Rules\n\n| **Rule** | **Valid** | **Invalid** |\n|---|---|---|\n| **Letters, digits, underscores only — no spaces** | \`student_name\` | \`student name\` |\n| **Cannot start with a digit** | \`student2\` | \`2student\` |\n| **Cannot use Python keywords** | \`my_class\` | \`class\` |\n| **Case-sensitive** | \`Name\` ≠ \`name\` | — |\n| **Use snake_case convention** | \`first_name\` | \`firstName\` |\n| **UPPERCASE for constants** | \`PI = 3.14159\` | — |\n\n## Python's 35 Reserved Keywords\n\nThese words are part of Python's syntax — you **cannot** use them as variable names:\n\n| | | | | |\n|---|---|---|---|---|\n| \`False\` | \`None\` | \`True\` | \`and\` | \`as\` |\n| \`assert\` | \`async\` | \`await\` | \`break\` | \`class\` |\n| \`continue\` | \`def\` | \`del\` | \`elif\` | \`else\` |\n| \`except\` | \`finally\` | \`for\` | \`from\` | \`global\` |\n| \`if\` | \`import\` | \`in\` | \`is\` | \`lambda\` |\n| \`nonlocal\` | \`not\` | \`or\` | \`pass\` | \`raise\` |\n| \`return\` | \`try\` | \`while\` | \`with\` | \`yield\` |\n\n## Multiple Assignment and Swap\n\n\`\`\`python\n# Assign different values at once\na, b, c = 1, 2, 3\nprint(a, b, c)   # 1 2 3\n\n# Assign same value to multiple variables\nx = y = z = 0\nprint(x, y, z)   # 0 0 0\n\n# Pythonic variable swap — uses tuple unpacking!\na, b = 10, 20\na, b = b, a\nprint(a, b)   # 20 10\n\`\`\`\n\n## Memory Operations — id(), reassign, del\n\n\`\`\`python\ndollar = 69\nprint("Value:", dollar)\nprint("Memory address:", id(dollar))   # unique location in RAM\n\ndollar = 72              # reassignment — Python points to a NEW object\nprint("New address:", id(dollar))      # different address!\n\ndel dollar               # delete the variable from memory\n# print(dollar)          # NameError — it's gone!\n\`\`\`\n\n## Constants\n\nBy convention, constants are written in **UPPERCASE** with underscores:\n\n\`\`\`python\nPI          = 3.14159265358979\nMAX_STUDENTS = 30\nDATABASE_URL = "postgresql://localhost/daqs"\n\`\`\``,
          },
          { id: "py-m2-l2", title: "Data Types — A Complete Map", type: "reading", duration: 15,
            notebookFile: "04_data_types.ipynb",
            content: `## What is a Data Type?\n\nAll programming exists to **create data and perform operations on it**. Before a computer can process data, it needs to know what *kind* of data it is.\n\n> **Data Type** is the type of data to be stored in a variable. Python needs to know this to process it correctly.\n\n## Python's Built-in Data Types\n\n| **Data Type** | **Description** | **Example** |\n|---|---|---|\n| **None** | No value / absence of value | \`None\` |\n| **bool** | True or False only | \`True\`, \`False\` |\n| **int** | Whole numbers (no size limit!) | \`5\`, \`-12\`, \`9999\` |\n| **float** | Decimal numbers | \`3.14\`, \`-0.5\`, \`9.81\` |\n| **complex** | Real + imaginary parts | \`3+6j\`, \`2-5.5j\` |\n| **str** | Text / characters | \`"Hello"\`, \`'World'\` |\n| **list** | Ordered, mutable collection | \`[1, 'a', 3.0]\` |\n| **tuple** | Ordered, immutable collection | \`(1, 'a', 3.0)\` |\n| **set** | Unordered, no duplicates | \`{1, 2, 3}\` |\n| **dict** | Key-value pairs | \`{'name': 'John'}\` |\n\nUse \`type()\` to check any variable's data type at runtime:\n\`\`\`python\nx = 42\nprint(type(x))   # <class 'int'>\ny = "Hello"\nprint(type(y))   # <class 'str'>\n\`\`\`\n\n## None — The Absence of Value\n\n\`None\` is like an **empty box** — the variable exists, but nothing is inside yet.\n\`\`\`python\nresult = None\nprint(result)           # None\nprint(type(result))     # <class 'NoneType'>\nprint(result is None)   # True — use 'is', not '==' for None checks\n\`\`\`\n\n## bool — True or False\n\nPython stores \`True\` as \`1\` and \`False\` as \`0\` — you can do arithmetic with booleans!\n\`\`\`python\nprint(True + True)     # 2\nprint(True + False)    # 1\nprint(False + False)   # 0\nprint(int(True))       # 1\nprint(int(False))      # 0\n\`\`\`\n\n## int — Whole Numbers (No Size Limit!)\n\nPython's \`int\` has **no upper limit** — it can store numbers as large as your RAM allows:\n\`\`\`python\nbig = 99999999999999999999999999999999999999999\nprint(type(big))    # <class 'int'>  — Python handles it!\nprint(2 ** 100)     # a 31-digit number!\n\`\`\`\n\n## float — Decimal Numbers\n\n**Important:** Division \`/\` ALWAYS returns a float, even for whole-number results:\n\`\`\`python\nprint(10 / 2)    # → 5.0  (float!)\nprint(10 // 2)   # → 5    (int — floor division)\nprint(type(10 / 2))    # <class 'float'>\nprint(type(10 // 2))   # <class 'int'>\n\`\`\`\n\n## complex — Real + Imaginary Numbers\n\n\`\`\`python\na = 3 + 6j\nprint(a.real)   # 3.0  — real part\nprint(a.imag)   # 6.0  — imaginary part\nprint(type(a))  # <class 'complex'>\n\`\`\`\n\n## str — String (3 Quote Styles)\n\n| **Style** | **When to use** | **Example** |\n|---|---|---|\n| **Single \`' '\`** | No apostrophe in text | \`name = 'John'\` |\n| **Double \`" "\`** | Text contains apostrophe | \`book = "John's book"\` |\n| **Triple \`''' '''\`** | Text has both \`'\` and \`"\` | \`v = \\'\\'\\'\"John's book\"\\'\\'\\'\` |\n\n## Comments — Notes for Programmers\n\n\`\`\`python\n# Single-line comment — Python ignores this line entirely\nprint("Hello")  # inline comment\n\n"""\nMulti-line comment:\nThis entire block is ignored by Python.\nUseful for longer explanations or disabling code.\n"""\n\`\`\`\n\n## Collections — Comparison Table\n\n| **Type** | **Brackets** | **Ordered?** | **Duplicates?** | **Mutable?** | **Best Use** |\n|---|---|---|---|---|---|\n| **str** | \`" "\` | Yes | Yes | No | Text, names, messages |\n| **list** | \`[ ]\` | Yes | Yes | Yes | Shopping cart, marks list |\n| **tuple** | \`( )\` | Yes | Yes | No | GPS coords, fixed records |\n| **set** | \`{ }\` | No | No | Yes | Unique values, deduplication |\n| **dict** | \`{k:v}\` | Yes (3.7+) | Keys: No | Yes | Student records, config |\n\n\`\`\`python\n# list — mutable, ordered\ndetail = [1, 'John', 9.5, 'pass']\n\n# tuple — immutable, ordered\ncoords = (10.5, -23.8)\n\n# set — unique values only (duplicate 1 removed automatically!)\nunique = {1, 'John', 9.5, 1}\nprint(unique)   # {1, 9.5, 'John'}\n\n# dict — key:value pairs\nstudent = {'name': 'Sipho', 'age': 21, 'gpa': 3.7}\nprint(student['name'])   # Sipho\n\`\`\`\n\n## Type Conversion\n\n| **Function** | **Converts to** | **Note** |\n|---|---|---|\n| \`int(x)\` | Integer | Truncates decimal — does NOT round |\n| \`float(x)\` | Float | Adds decimal point |\n| \`complex(x)\` | Complex | Adds \`+0j\` imaginary part |\n| \`bool(x)\` | Boolean | \`0\` → \`False\`, non-zero → \`True\` |\n| \`str(x)\` | String | Wraps value in quotes |\n| \`list(x)\` | List | Converts any iterable |\n| \`tuple(x)\` | Tuple | Converts any iterable |\n| \`set(x)\` | Set | Converts iterable, removes duplicates |\n| \`ord(char)\` | int | Returns ASCII value of a character |\n| \`chr(number)\` | str | Returns character from ASCII number |\n\n\`\`\`python\nfloat(65)        # → 65.0\nint(65.89)       # → 65  (NOT 66 — truncates toward zero, does not round!)\nint(-3.9)        # → -3  (truncates, not -4)\nstr(42)          # → "42"\nint("42")        # → 42\n\n# ASCII — every character has a unique integer code:\nord('A')   # → 65\nord('a')   # → 97\nchr(65)    # → 'A'\nchr(97)    # → 'a'\nchr(48)    # → '0'\n\`\`\``,
          },
          { id: "py-m2-l3", title: "Strings in Depth", type: "reading", duration: 15,
            notebookFile: "08_strings.ipynb",
            content: `## Strings\n\nStrings hold text. Use single or double quotes (be consistent):\n\`\`\`python\ngreeting = "Hello, South Africa!"\nquote = 'Learning is the key to the future'\n\`\`\`\n\n## Indexing — Positive and Negative\n\`\`\`python\nword = "Python"\n#        P  y  t  h  o  n\n# index: 0  1  2  3  4  5\n# neg:  -6 -5 -4 -3 -2 -1\n\nprint(word[0])     # 'P'\nprint(word[-1])    # 'n'  (last character)\nprint(word[-3])    # 'h'\n\`\`\`\n\n## Slicing \`[start:stop:step]\`\n\`\`\`python\nword = "Python"\nprint(word[0:3])   # 'Pyt'    (stop is exclusive)\nprint(word[2:])    # 'thon'   (from index 2 to end)\nprint(word[:4])    # 'Pyth'   (from start to index 3)\nprint(word[::-1])  # 'nohtyP' (reverse the string!)\nprint(word[::2])   # 'Pto'    (every second character)\n\`\`\`\n\n## f-Strings (the modern way)\n\`\`\`python\nname = "Sipho"\nage = 19\nprint(f"My name is {name} and I am {age} years old.")\nprint(f"Next year I will be {age + 1}.")  # expressions work!\n\`\`\`\n\n## Key String Methods\n\`\`\`python\ns = "  Hello, World!  "\nprint(s.strip())           # "Hello, World!" — removes spaces\nprint(s.lstrip())          # "Hello, World!  " — left only\nprint(s.rstrip())          # "  Hello, World!" — right only\nprint(s.lower())           # "  hello, world!  "\nprint(s.upper())           # "  HELLO, WORLD!  "\nprint(s.title())           # "  Hello, World!  "\nprint(s.replace("World", "DAQS"))  # "  Hello, DAQS!  "\nprint(s.split(","))        # ['  Hello', ' World!  ']\nprint(len(s))              # 18\n\`\`\`\n\n## find() vs index() — Critical Difference\n\`\`\`python\ns = "Together"\nprint(s.find("get"))     # 2  — position of 'get'\nprint(s.find("xyz"))     # -1 — SAFE: returns -1 if not found\nprint(s.index("get"))    # 2\n# print(s.index("xyz"))  # ValueError — CRASHES if not found!\nprint(s.count("e"))      # 2 — count occurrences\n\`\`\`\n\n## String Validation\n\`\`\`python\nprint("hello".islower())   # True\nprint("HELLO".isupper())   # True\nprint("Hello".istitle())   # True\nprint("abc123".isalnum())  # True — letters and/or digits\nprint("123".isdigit())     # True\nprint("abc".isalpha())     # True\n\`\`\`\n\n## Practical: Password Validator\n\`\`\`python\np = input("Enter Password: ")\nif len(p) > 8:\n    if not p.islower():       # has at least one uppercase\n        if not p.isupper():   # has at least one lowercase\n            if not p.isdigit():  # has at least one non-digit\n                print("Password set successfully!")\n            else:\n                print("Password cannot be all digits")\n        else:\n            print("Password cannot be all uppercase")\n    else:\n        print("Password cannot be all lowercase")\nelse:\n    print("Password must be longer than 8 characters")\n\`\`\``,
          },
          { id: "py-m2-l4", title: "Operators", type: "reading", duration: 15,
            notebookFile: "05_operators.ipynb",
            content: `## Python Operators — 9 Types\n\nAn **operator** acts on one or more **operands** to produce a result.\n\n| **Type** | **Operators** | **Example** |\n|---|---|---|\n| **Unary Minus** | \`-\` | \`-a\` |\n| **Assignment** | \`=\` | \`x = 5\` |\n| **Arithmetic** | \`+\`, \`-\`, \`*\`, \`/\`, \`//\`, \`%\`, \`**\` | \`5 + 3\` |\n| **Compound (Augmented)** | \`+=\`, \`-=\`, \`*=\`, etc. | \`x += 1\` |\n| **Relational** | \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\` | \`5 > 3\` |\n| **Identity** | \`is\`, \`is not\` | \`x is None\` |\n| **Logical** | \`and\`, \`or\`, \`not\` | \`x > 0 and x < 10\` |\n| **Bitwise** | \`&\`, \`|\`, \`^\`, \`~\`, \`>>\`, \`<<\` | \`a & b\` |\n| **Membership** | \`in\`, \`not in\` | \`"a" in "cat"\` |\n\n## Arithmetic Operators\n\n| **Operator** | **Meaning** | **Example** | **Result** |\n|---|---|---|---|\n| \`+\` | Addition | \`5 + 3\` | \`8\` |\n| \`-\` | Subtraction | \`5 - 3\` | \`2\` |\n| \`*\` | Multiplication | \`5 * 3\` | \`15\` |\n| \`/\` | Division (always float!) | \`7 / 2\` | \`3.5\` |\n| \`//\` | Floor division | \`7 // 2\` | \`3\` |\n| \`%\` | Modulo (remainder) | \`7 % 2\` | \`1\` |\n| \`**\` | Exponentiation | \`2 ** 8\` | \`256\` |\n\n\`\`\`python\na, b = 20, 12\nprint(a + b)    # 32\nprint(a / b)    # 1.6666...  (always float!)\nprint(a // b)   # 1          (floor — rounds DOWN)\nprint(a % b)    # 8          (20 = 1×12 + 8)\nprint(a ** 2)   # 400\n\`\`\`\n\n## The math Module\n\n| **Function** | **Description** | **Example** | **Result** |\n|---|---|---|---|\n| \`sqrt(x)\` | Square root | \`sqrt(16)\` | \`4.0\` |\n| \`factorial(n)\` | n! | \`factorial(5)\` | \`120\` |\n| \`ceil(x)\` | Round UP | \`ceil(3.2)\` | \`4\` |\n| \`floor(x)\` | Round DOWN | \`floor(3.9)\` | \`3\` |\n| \`round(x)\` | Standard rounding | \`round(3.7)\` | \`4\` |\n| \`pi\` | π constant | — | \`3.14159...\` |\n| \`log(x, base)\` | Logarithm | \`log(100, 10)\` | \`2.0\` |\n| \`sin/cos/tan\` | Trig (radians) | \`sin(radians(90))\` | \`1.0\` |\n\n\`\`\`python\nfrom math import *\nprint(sqrt(16))           # 4.0\nprint(factorial(5))       # 120\nprint(sin(radians(90)))   # 1.0\nprint(ceil(3.2))          # 4\nprint(floor(3.9))         # 3\nprint(pi)                 # 3.141592653589793\nprint(log(100, 10))       # 2.0\n\`\`\`\n\n## Compound (Augmented) Assignment Operators\n\n\`\`\`python\nx = 10\nx += 5    # x = x + 5  → 15\nx -= 3    # x = x - 3  → 12\nx *= 2    # x = x * 2  → 24\nx //= 5   # x = x // 5 → 4\nx **= 3   # x = x ** 3 → 64\n\n# Real-world example — bank balance\nbalance = 5000\nbalance += 1500   # deposit R1500\nbalance -= 200    # withdrawal of R200\nprint(f"Balance: R{balance}")   # R6300\n\`\`\`\n\n## Relational (Comparison) Operators\n\n\`\`\`python\nprint(5 == 5)   # True  — equal to\nprint(5 != 4)   # True  — not equal to\nprint(5 > 3)    # True  — greater than\nprint(5 < 3)    # False — less than\nprint(5 >= 5)   # True  — greater than or equal to\nprint(5 <= 4)   # False — less than or equal to\n\`\`\`\n\n## Identity Operators: is / is not\n\n\`is\` checks if two variables point to the **same memory object**; \`==\` checks if they have the **same value** — these are different!\n\n\`\`\`python\na = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)   # True  — same VALUES\nprint(a is b)   # False — different OBJECTS in memory!\nprint(a is c)   # True  — c points to the SAME object as a\n\n# Python caches small integers:\nx = 5\ny = 5\nprint(x is y)   # True — Python reuses small int objects\n\`\`\`\n\n## Logical Operators\n\n\`\`\`python\nage, has_id = 20, True\n\n# and — both must be True\nif age >= 18 and has_id:\n    print("Access granted")\n\n# or — at least one must be True\nif age < 13 or age > 65:\n    print("Discount applies")\n\n# not — inverts True/False\nif not has_id:\n    print("ID required")\n\`\`\``,
          },
          { id: "py-m2-l5", title: "Data Types Practice", type: "exercise", duration: 20, notebookFile: "04_data_types.ipynb" },
        ],
      },
      {
        id: "py-m3", title: "Control Flow",
        lessons: [
          { id: "py-m3-l1", title: "Conditional Statements", type: "reading", duration: 18,
            notebookFile: "06_conditional_statements.ipynb",
            content: `## What are Conditional Statements?\n\n**Conditional statements** are statements executed based on a condition — they allow a program to make decisions. Python has **4 types**:\n\n| **Type** | **Description** |\n|---|---|\n| **if** | Executes a block only when condition is \`True\`; skips it when \`False\` |\n| **if else** | One block for \`True\`, another for \`False\` |\n| **Nested if** | An \`if\` statement placed inside another \`if\` statement |\n| **if elif else** | Multiple conditions evaluated in order; first \`True\` wins |\n\n> **Indentation is mandatory!** Python uses indentation (4 spaces or 1 tab) to define code blocks — unlike C or Java which use curly braces \`{}\`. Incorrect indentation causes an \`IndentationError\`. The colon \`:\` after every condition is also mandatory.\n\n## The if Statement\n\n\`\`\`python\na = int(input("Enter your age\\n"))\n\nif a > 17:\n    print("Pass for interview.")   # only runs when a > 17\n\nprint("Thank you!")   # always runs\n\`\`\`\n\n## The if else Statement\n\n\`\`\`python\na = int(input("Enter your age\\n"))\n\nif a > 17:\n    print("Pass for interview.")\nelse:\n    print("Application Denied.")\n\`\`\`\n\n## Logical Operators — Building Compound Conditions\n\n| **Operator** | **Description** |\n|---|---|\n| **and** | \`True\` only if BOTH arguments are \`True\` |\n| **or** | \`True\` if AT LEAST ONE argument is \`True\` |\n| **not** | Complement — opposite of the boolean value |\n\n\`\`\`python\n# and — both conditions must be True\na = int(input("Enter your age\\n"))\nif a > 17 and a < 45:\n    print("Pass for interview.")\nelse:\n    print("Application Denied.")\n\`\`\`\n\n## Nested if — Multi-Level Decisions\n\n\`\`\`python\na = int(input("Enter your age\\n"))\nc = float(input("Enter your GPA\\n"))\n\nif a > 17 and a < 45:\n    if c > 9:\n        print("Accepted.")\n    else:\n        print("Waiting List...")\nelse:\n    print("Application Denied.")\n\`\`\`\n\n## The if elif else Statement\n\n\`\`\`python\na = int(input("Enter your age\\n"))\nc = float(input("Enter your GPA\\n"))\n\nif a > 17 and a < 45 and c > 9:\n    print("Accepted.")\nelif a > 17 and a < 45 and c > 7 and c < 9:\n    print("Pass for interview.")\nelse:\n    print("Application Denied.")\n\`\`\`\n\n## Ternary (Conditional) Operator — One Line\n\n\`\`\`python\n# Syntax: value_if_True  if  condition  else  value_if_False\na = float(input("Enter 1st No: "))\nb = float(input("Enter 2nd No: "))\n\nlargest = a if a > b else b\nprint("Largest No. =", largest)\n\n# More examples:\nstatus = "adult" if age >= 18 else "minor"\nlabel  = "pass"  if score >= 50 else "fail"\n\`\`\`\n\n## Finding the Largest of Three Numbers\n\n\`\`\`python\na = float(input('Enter 1st No: '))\nb = float(input('Enter 2nd No: '))\nc = float(input('Enter 3rd No: '))\n\nif a >= b:\n    if a >= c:\n        largest = a\n    else:\n        largest = c\nelse:\n    if b >= c:\n        largest = b\n    else:\n        largest = c\n\nprint("The largest No is", largest)\n\`\`\`\n\n## Variable Swapping — 4 Techniques\n\n| **Technique** | **Code** |\n|---|---|\n| **Third variable (temp)** | \`temp = a; a = b; b = temp\` |\n| **Pythonic tuple unpacking** | \`a, b = b, a\` |\n| **Arithmetic operators** | \`a=a+b; b=a-b; a=a-b\` |\n| **XOR bitwise operator** | \`a=a^b; b=a^b; a=a^b\` |\n\n\`\`\`python\na, b = 1, 2\nprint("Before:", a, b)\na, b = b, a          # the Pythonic way — most readable!\nprint("After:", a, b)   # 2 1\n\`\`\`\n\n## Bitwise Operators\n\n| **Operator** | **Symbol** | **Description** |\n|---|---|---|\n| **Bitwise AND** | \`&\` | 1 only if both bits are 1 |\n| **Bitwise OR** | \`|\` | 1 if at least one bit is 1 |\n| **Bitwise NOT** | \`~\` | Flips all bits (complement) |\n| **Bitwise XOR** | \`^\` | 1 if bits are different |\n| **Right Shift** | \`>>\` | Shifts bits right — divides by 2ⁿ |\n| **Left Shift** | \`<<\` | Shifts bits left — multiplies by 2ⁿ |\n\n\`\`\`python\na, b = 12, 10   # 12 = 1100₂, 10 = 1010₂\nprint(a & b)    # 8    (AND:  1000₂)\nprint(a | b)    # 14   (OR:   1110₂)\nprint(a ^ b)    # 6    (XOR:  0110₂)\nprint(~a)       # -13  (NOT — bitwise complement)\nprint(a << 1)   # 24   (left shift = multiply by 2)\nprint(a >> 1)   # 6    (right shift = divide by 2)\n\n# Bus Stop Problem — stops are: 1 → 2 → 4 → 8 → 16 → 32\nc = int(input("Enter current stop: "))\np = c >> 1    # previous stop (divide by 2)\nn = c << 1    # next stop (multiply by 2)\nprint(f"Previous: {p}, Current: {c}, Next: {n}")\n\`\`\`\n\n## Membership Operators\n\n| **Operator** | **Description** |\n|---|---|\n| **in** | \`True\` if element IS found in the sequence |\n| **not in** | \`True\` if element is NOT found in the sequence |\n\n\`\`\`python\nclass_10A = ["John", "Eden", "Bob"]\n\nprint("john" in class_10A)       # False — case-sensitive!\nprint("John" in class_10A)       # True\nprint("Alice" not in class_10A)  # True\n\n# Works on strings too:\nprint("Wel" in "Welcome")    # True\nprint("wel" in "Welcome")    # False — case-sensitive!\n\`\`\`\n\n## The eval() Function\n\nTakes a **string expression** and evaluates it as Python code, returning the result.\n\n\`\`\`python\neval('10 + 10')        # → 20\neval('2 ** 8')         # → 256\neval('1 > 2')          # → False\neval('2 << 3')         # → 16\n\n# Interactive live calculator:\nresult = eval(input("Enter expression: "))\n# User types: 20 - 12 + 3 * 4    → result: 20\n\n# Works with math module:\nfrom math import *\nprint(eval('log(1)'))    # 0.0\nprint(eval('sqrt(625)')) # 25.0\nprint(eval('ceil(6.5)')) # 7\n\`\`\``,
          },
          { id: "py-m3-l2", title: "for Loops and range()", type: "reading", duration: 12,
            notebookFile: "06_conditional_statements.ipynb",
            content: `## for Loops\n\nIterate over any sequence:\n\`\`\`python\nfruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)\n\`\`\`\n\n## range() — Generate Number Sequences\n\`\`\`python\nfor i in range(5):          # 0, 1, 2, 3, 4\n    print(i)\n\nfor i in range(1, 6):       # 1, 2, 3, 4, 5\n    print(i)\n\nfor i in range(0, 10, 2):   # 0, 2, 4, 6, 8  (step=2)\n    print(i)\n\nfor i in range(10, 0, -1):  # 10, 9, 8, ..., 1  (countdown)\n    print(i)\n\`\`\`\n\n## enumerate() — Get Index and Value\n\`\`\`python\nstudents = ["Amara", "Sipho", "Lindiwe"]\nfor i, name in enumerate(students, start=1):\n    print(f"{i}. {name}")\n# 1. Amara\n# 2. Sipho\n# 3. Lindiwe\n\`\`\`\n\n## while Loops\n\`\`\`python\ncount = 0\nwhile count < 5:\n    print(f"Count: {count}")\n    count += 1  # always update or you get an infinite loop!\n\`\`\`\n\n## break and continue\n\`\`\`python\nfor i in range(10):\n    if i == 3:\n        continue  # skip 3, continue to next iteration\n    if i == 7:\n        break     # stop the loop entirely at 7\n    print(i)  # prints 0,1,2,4,5,6\n\`\`\``,
          },
          { id: "py-m3-l3", title: "Control Flow Challenges", type: "exercise", duration: 20, notebookFile: "06_conditional_statements.ipynb" },
        ],
      },
      {
        id: "py-m4", title: "Functions",
        lessons: [
          { id: "py-m4-l1", title: "Defining and Calling Functions", type: "reading", duration: 25,
            notebookFile: "07_functions.ipynb",
            content: `## Why Functions?\n\nWhen you go to school every morning, you always do the same steps: get up, wash, brush teeth, wear uniform, eat, and go. Your mum does not explain all these steps each morning — she just says **"Get ready for school"**. In coding, if a group of statements is **repeatedly required**, it is not good to write them separately each time. Instead, define them once in a **function block** and call them whenever needed.\n\n> A **function** is a group of statements or a block of code that performs a certain task. A function is a block of code which only runs when it is **called**.\n\n**Advantages of using functions:**\n- Maintaining code is easier\n- Organise and manage code into logical pieces\n- **Code re-usability** — write once, use many times\n\n## Types of Functions\n\n| **Type** | **Description** | **Examples** |\n|---|---|---|\n| **Pre-defined (Built-in)** | Created by Python itself, installed with Python | \`print()\`, \`input()\`, \`type()\`, \`id()\`, \`len()\` |\n| **User-defined** | Created by the developer to meet requirements | \`def add():\` ... (what we focus on this chapter) |\n\n## Anatomy of a Function\n\n\`\`\`\ndef  function_name  ( parameters ) :\n     # body of function (indented)\n     return value   ← optional\n\`\`\`\n\n\`\`\`python\n# Define a function\ndef function_name(parameters):\n    # body of function\n    return value\n\n# Call a function\nfunction_name(parameters)\n\`\`\`\n\n> **Note:** \`return\` is optional — if there is no \`return\`, the function returns \`None\` by default. When a function is called once it executes once; called twice it executes twice.\n\n## Example — Defining and Calling\n\n\`\`\`python\ndef add():\n    a, b = 1, 2\n    c = a + b\n    return c\n\nadd()   # calling the function → 3\n\`\`\`\n\n## 5 Types of Arguments\n\n| **#** | **Type** | **How it works** |\n|---|---|---|\n| **1** | **Positional** | Matched by order: \`add(5, 2)\` |\n| **2** | **Keyword** | Matched by name: \`add(b=2, a=5)\` |\n| **3** | **Positional + Keyword** | Mixed — positional must come first: \`add(5, b=2)\` |\n| **4** | **Variable Length** (\`*args\`) | Any number of positional values stored as a tuple |\n| **5** | **Keyword Variable** (\`**kwargs\`) | Any number of key-value pairs stored as a dict |\n\n### 1. Positional Arguments\n\nActual arguments are received by formal arguments in the **same order** they are sent. Both number and position must match.\n\n\`\`\`python\ndef sub(a, b):\n    c = a - b\n    print(c)\n\nsub(5, 2)   # a=5, b=2 → 3\nsub(2, 5)   # a=2, b=5 → -3 (different result — order matters!)\n\`\`\`\n\n### 2. Keyword Arguments\n\nSend values using the **name of the parameter** as a key — order no longer matters.\n\n\`\`\`python\ndef sub(a, b):\n    c = a - b\n    print(c)\n\nsub(b=2, a=5)   # same as sub(5, 2) — order doesn't matter\n\`\`\`\n\n### 3. Default Arguments\n\nAssign a **default value** to a parameter in the function definition — used when the caller does not pass that argument.\n\n\`\`\`python\ndef sub(a, b=0):   # b defaults to 0 if not provided\n    c = a - b\n    print(c)\n\nsub(a=5, b=2)  # b provided: 5-2 = 3\nsub(a=5)       # b omitted: 5-0 = 5 (default used)\n\`\`\`\n\n> **Rule:** Default arguments must come **after** all non-default arguments in the definition.\n\n### 4. Variable Length (*args)\n\nWhen the programmer does not know how many values will be passed — stored internally as a **tuple**.\n\n\`\`\`python\ndef detail(name, *others):\n    print(name, others)\n\ndetail("John")              # others = () empty tuple\ndetail("John", 20)          # others = (20,)\ndetail("John", 20, 3.7)     # others = (20, 3.7)\n\`\`\`\n\n### 5. Keyword Variable (**kwargs)\n\nAccept any number of **key-value pair** arguments — stored internally as a **dictionary**.\n\n\`\`\`python\ndef detail(**others):\n    print(others)\n\ndetail(name='John', age=20, gpa=3.7)\n# Output: {'name': 'John', 'age': 20, 'gpa': 3.7}\n\`\`\`\n\n## Return Value — Assigning to a Variable\n\n\`\`\`python\ndef add(a, b):\n    return a + b\n\nx = add(1, 2)\nprint("Sum of two numbers is:", x)   # 3\n\`\`\`\n\n## Function Calling Another Function\n\nIt is possible for a function to **call another function** inside its body.\n\n\`\`\`python\ndef add(a, b):\n    return a + b\n\ndef average(a, b):\n    sum = add(a, b)   # calling add() from inside average()\n    avg = sum / 2\n    print("Average =", avg)\n\naverage(7, 3)   # Average = 5.0\n\`\`\`\n\n## Nested Functions\n\nA function defined **inside** another function. The inner function must be called from within the outer function.\n\n\`\`\`python\ndef average(a, b):\n    def add():          # inner function defined inside outer\n        return a + b\n    sum = add()         # call inner function\n    avg = sum / 2\n    print("Average =", avg)\n\naverage(7, 3)\n\`\`\`\n\n## Passing a Function as a Parameter\n\nIn Python, functions are **first-class objects** — they can be passed as arguments to other functions.\n\n\`\`\`python\ndef add(a, b):\n    return a + b\n\ndef average(sum):\n    avg = sum / 2\n    print("Average =", avg)\n\naverage(add(7, 3))   # add(7,3) result passed as argument to average()\n\`\`\`\n\n## Recursive Functions\n\nA recursive function **calls itself** from within its own body. Every recursive function must have a **base case** — a condition that stops the recursion.\n\n**Advantages:**\n- Reduces length of code and improves readability\n- Solves complex problems in an elegant way\n\n\`\`\`python\n# factorial(4) = 4 × factorial(3)\n# factorial(3) = 4 × 3 × factorial(2)\n# factorial(2) = 4 × 3 × 2 × factorial(1)\n# factorial(1) = 4 × 3 × 2 × 1 × factorial(0)\n# factorial(0) = 1  ← BASE CASE (stops recursion)\n\ndef factorial(n):\n    if n == 0:                        # base case: stop here\n        result = 1\n    else:\n        result = n * factorial(n - 1) # recursive call\n    return result\n\nx = factorial(4)\nprint("Factorial of 4 is:", x)   # 24\n\`\`\``,
          },
          { id: "py-m4-l2", title: "Scope and Lambda Functions", type: "reading", duration: 20,
            notebookFile: "07_functions.ipynb",
            content: `## Variable Scope\n\nBased on where they are declared, variables are classified into two types:\n\n| **Local Variables** | **Global Variables** |\n|---|---|\n| Declared INSIDE a function | Declared OUTSIDE all functions |\n| Accessible only WITHIN that function | Accessible from ANY function in the program |\n| Destroyed when function exits | Persist for the entire program lifetime |\n\n## Local Variables\n\n\`\`\`python\ndef add():\n    a, b = 5, 2   # local variables — only exist inside add()\n    print(a + b)  # works fine\n\nadd()\n# print(a)   # NameError — 'a' only exists inside add()\n\`\`\`\n\n## Global Variables\n\n\`\`\`python\na, b = 5, 2   # global — declared outside all functions\n\ndef add():\n    print(a + b)  # can access global a and b\n\ndef sub():\n    print(a - b)  # can also access global a and b\n\nadd()   # 7\nsub()   # 3\n\`\`\`\n\n> **Shadowing:** If a local variable has the same name as a global variable, the local one "shadows" the global inside that function.\n\n\`\`\`python\na, b = 5, 2   # global a = 5\n\ndef add():\n    a = 9        # local a = 9 (shadows global a inside add)\n    print(a + b) # uses local a=9: 9+2 = 11\n\ndef sub():\n    print(a - b) # uses global a=5: 5-2 = 3\n\nadd()   # 11\nsub()   # 3\n\`\`\`\n\n## The \`global\` Keyword\n\nUse \`global\` inside a function to make it refer to and **modify** the global variable instead of creating a local copy.\n\n**Two purposes:**\n- To **declare** a global variable inside a function\n- To make an existing global variable available for **modification** inside a function\n\n\`\`\`python\na, b = 5, 2\n\ndef add():\n    global a      # now 'a' inside refers to the global a\n    a = 9         # changes the GLOBAL a to 9\n    print(a + b)  # 9 + 2 = 11\n\ndef sub():\n    print(a - b)  # global a has been changed to 9: 9-2 = 7\n\nadd()   # 11\nsub()   # 7\n\`\`\`\n\n## The \`globals()\` Built-in\n\n\`globals()\` returns a dictionary of all current global variables. Use it to access the global variable when a local with the same name exists.\n\n\`\`\`python\na, b = 5, 2\n\ndef add():\n    a = 9                        # local a = 9\n    print(a + b)                 # uses local a=9: 9+2 = 11\n    print(globals()['a'] + b)    # uses global a=5: 5+2 = 7\n\nadd()\n\`\`\`\n\n## Lambda (Anonymous) Functions\n\nThe \`lambda\` keyword lets you define a simple one-line function **without a name** — called a **lambda function** or **anonymous function**.\n\n| **Normal Function** | **Lambda Function** |\n|---|---|\n| \`def square(a):\` | \`square = lambda a: a * a\` |\n| \`    return a * a\` | |\n| \`square(4) → 16\` | \`square(4) → 16\` |\n\n**Syntax:** \`lambda arguments_list : expression\`\n\n> **Notes:**\n> - Can take any number of arguments but only **one expression**\n> - Returns the expression result automatically — no \`return\` keyword needed\n> - Best for simple, short operations; most powerful with \`filter()\`, \`map()\`, \`reduce()\`\n\n\`\`\`python\n# Single argument\ns = lambda a: a * a\nprint(s(4))      # 16\n\n# Two arguments\nmul = lambda a, b: a * b\nprint(mul(4, 5)) # 20\n\`\`\`\n\n## Lambda with filter(), map(), reduce()\n\n| **Function** | **What it does** |\n|---|---|\n| **filter()** | Keeps only elements that satisfy the condition |\n| **map()** | Applies the function to EVERY element, returns new sequence |\n| **reduce()** | Reduces the sequence to a single value |\n\n\`\`\`python\nfrom functools import reduce\n\na = [1, 2, 3, 4]\n\n# filter — keep elements greater than 2\nx = list(filter(lambda x: x > 2, a))\nprint(x)   # [3, 4]\n\n# map — add 2 to every element\nx = list(map(lambda x: x + 2, a))\nprint(x)   # [3, 4, 5, 6]\n\n# reduce — sum all elements: 1+2=3, 3+3=6, 6+4=10\ng = reduce(lambda x, y: x + y, a)\nprint(g)   # 10\n\`\`\``,
          },
          { id: "py-m4-l3", title: "Decorators and Generators", type: "reading", duration: 18,
            notebookFile: "07_functions.ipynb",
            content: `## What is a Decorator?\n\nA **decorator** is a special function that adds extra functionality to an existing function — without changing the original function's code.\n\n> A decorator is a function that **accepts** a function as a parameter and **returns** a function.\n\n**Steps to create a decorator:**\n\n| **Step** | **Action** |\n|---|---|\n| **Step 1** | Decorator takes a function as an argument |\n| **Step 2** | Decorator body has an inner function |\n| **Step 3** | Decorator returns the inner function |\n| **Step 4** | Extra functionality is added in the body of the inner function |\n\n**Syntax:**\n\`\`\`python\ndef decor(func):\n    def inner_function():\n        # extra functionality\n        return func()\n    return inner_function\n\`\`\`\n\n\`\`\`python\n# Decorator: treats negative arguments as 0 before adding\ndef decor(func):\n    def inner_function(x, y):\n        if x < 0:\n            x = 0\n        if y < 0:\n            y = 0\n        return func(x, y)\n    return inner_function\n\ndef add(a, b):\n    return a + b\n\nadd = decor(add)   # wrap add with the decorator\n\nprint(add(20, 30))    # 50\nprint(add(-10, 5))    # 0 + 5 = 5 (negative treated as 0)\n\`\`\`\n\n## The @ Symbol — Cleaner Decorator Syntax\n\nInstead of writing \`add = decor(add)\`, use \`@decor\` placed directly above the function definition. The decorator can also be reused for any other function.\n\n\`\`\`python\ndef decor(func):\n    def inner_function(x, y):\n        if x < 0: x = 0\n        if y < 0: y = 0\n        return func(x, y)\n    return inner_function\n\n@decor   # equivalent to: sub = decor(sub)\ndef sub(a, b):\n    return a - b\n\nprint(sub(30, 20))    # 10\nprint(sub(10, -5))    # 10 - 0 = 10\n\`\`\`\n\n## What are Generators?\n\n**Generators** are special functions that produce a sequence of values **one at a time** using \`yield\` instead of \`return\`. They remember their state between calls.\n\n| **Normal Function** | **Generator** |\n|---|---|\n| Uses \`return\` | Uses \`yield\` |\n| Returns ONE value | Produces MULTIPLE values |\n| Exits after \`return\` | PAUSES at \`yield\`, resumes later |\n| Stores all data in memory | Generates values ON-THE-FLY |\n\n**Advantages:**\n- **Memory Efficiency** — generates values on-the-fly, not all at once\n- **Lazy Evaluation** — values computed only when needed\n- **Iteration Support** — naturally iterable, easy to loop over\n- **Infinite Sequences** — handle sequences too large to fit in memory\n\n## Using yield and next()\n\nThe \`next()\` function retrieves the next value from a generator.\n\n\`\`\`python\ndef my_gen():\n    n = 1\n    print(n)\n    yield n       # pause here, return n=1\n\n    n += 1\n    print(n)\n    yield n       # pause here, return n=2\n\n    n += 1\n    print(n)\n    yield n       # pause here, return n=3\n\na = my_gen()    # creates generator object — nothing runs yet!\n\nnext(a)         # runs until first yield → prints 1\nnext(a)         # resumes until second yield → prints 2\nnext(a)         # resumes until third yield → prints 3\n\`\`\`\n\n## Generator in a Loop\n\n\`\`\`python\ndef countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor val in countdown(5):\n    print(val)   # 5, 4, 3, 2, 1\n\`\`\`\n\n## Memory Advantage\n\n\`\`\`python\nimport sys\n\n# List: stores ALL values in RAM\nbig_list = [x**2 for x in range(1_000_000)]\nprint(sys.getsizeof(big_list))   # ~8 MB\n\n# Generator: computes one at a time\nbig_gen = (x**2 for x in range(1_000_000))\nprint(sys.getsizeof(big_gen))    # ~120 bytes!\n\nprint(sum(big_gen))   # same answer, tiny memory usage\n\`\`\``,
          },
          { id: "py-m4-l4", title: "Function Practice Problems", type: "exercise", duration: 25, notebookFile: "07_functions.ipynb" },
          { id: "py-m4-l5", title: "Functions Quiz", type: "quiz", duration: 10 },
        ],
      },
      {
        id: "py-m5", title: "Data Structures",
        lessons: [
          { id: "py-m5-l1", title: "Lists — Python's Workhorse", type: "reading", duration: 18,
            notebookFile: "09_list_tuple.ipynb",
            content: `## Lists\n\nLists are ordered, mutable collections of any data type:\n\`\`\`python\nstudents = ["Amara", "Sipho", "Lindiwe", "Thabo"]\nscores   = [85, 92, 78, 95]\nmixed    = [1, "hello", True, 3.14]\n\`\`\`\n\n## Creating Lists — 3 Ways\n\`\`\`python\n# 1. Literal\nfruits = ["apple", "banana", "cherry"]\n\n# 2. list() constructor from any iterable\nletters = list("Python")   # ['P','y','t','h','o','n']\nnumbers = list(range(1, 6)) # [1, 2, 3, 4, 5]\n\n# 3. List comprehension\nsquares = [x**2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]\n\`\`\`\n\n## Accessing and Slicing\n\`\`\`python\nfruits = ["apple", "banana", "cherry", "mango"]\nprint(fruits[0])      # apple  (first)\nprint(fruits[-1])     # mango  (last)\nprint(fruits[1:3])    # ['banana', 'cherry']\nprint(fruits[::-1])   # reversed list\n\n# enumerate gives index + value\nfor i, fruit in enumerate(fruits, start=1):\n    print(f"{i}. {fruit}")\n\`\`\`\n\n## Inserting Elements\n\`\`\`python\nfruits.append("grape")          # add to end: O(1)\nfruits.insert(1, "avocado")     # insert at index 1\nfruits.extend(["kiwi", "lime"]) # add multiple at end\ncombined = fruits + ["peach"]   # new list with +\n\`\`\`\n\n## Deleting Elements\n\`\`\`python\nfruits.remove("banana")   # remove by VALUE (first occurrence)\npopped = fruits.pop()     # remove and return LAST element\npopped = fruits.pop(0)    # remove and return at index 0\ndel fruits[1]             # delete by index\nfruits.clear()            # empty the list\n\`\`\`\n\n## Sorting and Reversing\n\`\`\`python\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\nnumbers.sort()            # sort in place (ascending)\nnumbers.sort(reverse=True) # descending\nnumbers.reverse()         # reverse in place\n\n# sorted() returns a NEW list, original unchanged\nnew_list = sorted(numbers)\n\`\`\`\n\n## Aliasing vs Cloning — A Critical Bug\n\`\`\`python\n# ALIASING — both variables point to the SAME list!\nmy_list   = ["bag", "pen", "cap"]\ntwin_list = my_list           # alias!\ntwin_list[0] = "book"\nprint(my_list)  # ["book", "pen", "cap"] — ALSO changed!\n\n# CLONING — independent copy\ntwin_list = my_list.copy()    # method 1\ntwin_list = my_list[:]        # method 2 (slice)\ntwin_list = list(my_list)     # method 3\n\nimport copy\ntwin_list = copy.deepcopy(my_list)  # for NESTED lists!\n\`\`\`\n\n## List Comprehensions\n\`\`\`python\nsquares = [x**2 for x in range(1, 6)]   # [1, 4, 9, 16, 25]\nevens   = [x for x in range(20) if x % 2 == 0]\nupper   = [name.upper() for name in ["alice", "bob"]]\n\`\`\``,
          },
          { id: "py-m5-l2", title: "Tuples — Immutable Sequences", type: "reading", duration: 10,
            notebookFile: "09_list_tuple.ipynb",
            content: `## What is a Tuple?\n\nA tuple is an **ordered, immutable** sequence — like a list, but you cannot change it after creation.\n\n\`\`\`python\n# Creating tuples\ncoordinates = (10.5, -23.8)\nrgb          = (255, 128, 0)\nstudent      = ("Sipho", 21, "CompSci")  # mixed types\n\n# Single-element tuple — the COMMA is REQUIRED!\nname = ("Sipho",)   # tuple ✓\nname = ("Sipho")    # str — NOT a tuple!\n\n# Parentheses are actually optional\npoint = 3, 4        # this is still a tuple!\n\`\`\`\n\n## Why Use Tuples?\n\n1. **Immutability protects data** — no accidental modification\n2. **Faster than lists** — less memory overhead\n3. **Can be used as dictionary keys** — lists cannot\n4. **Represents naturally grouped data** — (x, y), (name, age, gpa)\n\n\`\`\`python\n# Tuples as dict keys — useful for grid coordinates\ngrid = {(0, 0): "origin", (1, 0): "right", (0, 1): "up"}\nprint(grid[(0, 0)])   # 'origin'\n\`\`\`\n\n## Tuple Packing and Unpacking\n\`\`\`python\n# Packing\nstudent = "Lindiwe", 22, 3.8   # creates a tuple\n\n# Unpacking — assign each element to a variable\nname, age, gpa = student\nprint(name)   # Lindiwe\nprint(gpa)    # 3.8\n\n# Pythonic variable swap — uses tuple unpacking!\na, b = 10, 20\na, b = b, a\nprint(a, b)   # 20 10\n\`\`\`\n\n## Tuple Methods\n\`\`\`python\nt = (1, 2, 3, 2, 4, 2)\nprint(t.count(2))   # 3 — count occurrences of 2\nprint(t.index(3))   # 2 — position of first 3\n\`\`\`\n\n## List vs Tuple\n| Feature | list | tuple |\n|---|---|---|\n| Syntax | \`[1, 2, 3]\` | \`(1, 2, 3)\` |\n| Mutable | Yes | No |\n| As dict key | No | Yes |\n| Speed | Slower | Faster |\n| Use for | Dynamic data | Fixed/record data |`,
          },
          { id: "py-m5-l3", title: "Dictionaries and Sets", type: "reading", duration: 15,
            notebookFile: "12_dictionary.ipynb",
            content: `## Dictionaries\n\nKey-value stores — like a real dictionary where you look up definitions by word:\n\`\`\`python\nstudent = {\n    "name": "Sipho Dlamini",\n    "age": 21,\n    "gpa": 3.7,\n    "enrolled": True\n}\n\n# Access\nprint(student["name"])          # Sipho Dlamini\nprint(student.get("age", 0))   # 21 (safe — no KeyError)\n\n# Modify\nstudent["age"] = 22             # update\nstudent["city"] = "Cape Town"  # add new key\ndel student["enrolled"]         # remove key\n\n# Iterate\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\`\`\`\n\n## Dict Comprehensions\n\`\`\`python\nscores = {"Math": 85, "Science": 92, "English": 78}\npassed = {subject: score for subject, score in scores.items() if score >= 80}\n# {'Math': 85, 'Science': 92}\n\`\`\`\n\n## Sets\nUnordered collections of unique values — great for deduplication:\n\`\`\`python\nmy_set = {1, 2, 3, 2, 1}\nprint(my_set)  # {1, 2, 3} — duplicates removed!\n\n# IMPORTANT: {} creates a dict, NOT a set\nempty_set  = set()    # correct empty set\nempty_dict = {}       # this is a dict!\n\nset_a = {1, 2, 3, 4}\nset_b = {3, 4, 5, 6}\nprint(set_a & set_b)  # intersection: {3, 4}\nprint(set_a | set_b)  # union: {1, 2, 3, 4, 5, 6}\nprint(set_a - set_b)  # difference: {1, 2}\nprint(set_a ^ set_b)  # symmetric difference: {1, 2, 5, 6}\n\`\`\``,
          },
          { id: "py-m5-l4", title: "Data Structures Practice", type: "exercise", duration: 30, notebookFile: "09_list_tuple.ipynb" },
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
    icon: "/Python-Logo.png",
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
        id: "pyint-loops", title: "Advanced Loops & Comprehensions",
        lessons: [
          { id: "pyint-loops-l1", title: "while Loops and Infinite Loops", type: "reading", duration: 12,
            notebookFile: "10_control_flow.ipynb",
            content: `## Why Loops?\n\nWithout loops, printing 1 to 100 means writing 100 print statements. Loops eliminate repetition — a core programming principle (DRY: Don't Repeat Yourself).\n\n## while Loops\n\nRuns as long as a condition is \`True\`. Structure: **initialise → condition → body → update**.\n\n\`\`\`python\n# Countdown\ncount = 10\nwhile count > 0:\n    print(count)\n    count -= 1    # ALWAYS update — or infinite loop!\nprint("Blast off!")\n\n# Sentinel value — loop until user types 'quit'\nuser_input = ""\nwhile user_input != "quit":\n    user_input = input("Enter command (or 'quit' to exit): ")\n    print(f"You entered: {user_input}")\n\`\`\`\n\n## Infinite Loops\n\`\`\`python\n# Intentional infinite loop — controlled with break\nwhile True:\n    answer = input("Type 'yes' to continue: ")\n    if answer == "yes":\n        break\nprint("Continuing...")\n\`\`\`\n\n## for Loops — The Python Way\n\n\`\`\`python\n# Iterate over any sequence\nfruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)\n\n# range(start, stop, step)\nfor i in range(0, 11, 2):    # 0, 2, 4, 6, 8, 10 (even numbers)\n    print(i, end=" ")\n\nfor i in range(10, 0, -1):   # 10, 9, 8, ..., 1 (countdown)\n    print(i, end=" ")\n\`\`\`\n\n## enumerate() and Nested Loops\n\`\`\`python\n# enumerate — get index + value\nstudents = ["Amara", "Sipho", "Lindiwe"]\nfor i, name in enumerate(students, start=1):\n    print(f"{i}. {name}")\n\n# Nested loops — multiplication table\nfor i in range(1, 4):\n    for j in range(1, 4):\n        print(f"{i}×{j}={i*j}", end="  ")\n    print()   # new row\n\`\`\``,
          },
          { id: "pyint-loops-l2", title: "break, continue, and pass", type: "reading", duration: 10,
            notebookFile: "10_control_flow.ipynb",
            content: `## Loop Control Statements\n\n### break — Exit the Loop Immediately\n\`\`\`python\nfor i in range(1, 11):\n    if i == 5:\n        break           # stop when i reaches 5\n    print(i)            # prints 1, 2, 3, 4\nprint("Loop ended early")\n\`\`\`\n\n### continue — Skip This Iteration\n\`\`\`python\nfor i in range(1, 11):\n    if i % 2 == 0:\n        continue        # skip even numbers\n    print(i)            # prints 1, 3, 5, 7, 9\n\`\`\`\n\n### pass — Do Nothing (Placeholder)\n\`\`\`python\n# pass is NOT the same as a comment —\n# it is a real statement that satisfies the\n# syntax requirement for a code block.\nfor i in range(5):\n    if i == 3:\n        pass    # placeholder — will implement later\n    print(i)   # prints 0, 1, 2, 3, 4 (pass has no effect)\n\n# Useful for empty class or function stubs:\nclass ComingSoon:\n    pass\n\ndef not_yet_implemented():\n    pass\n\`\`\`\n\n## Combining break + else\n\`\`\`python\n# The else block after a loop runs only if the loop\n# completed WITHOUT hitting a break\nfor num in [2, 4, 6, 8, 9]:\n    if num % 2 != 0:\n        print(f"Found odd: {num}")\n        break\nelse:\n    print("All numbers are even")  # only if no break\n\`\`\``,
          },
          { id: "pyint-loops-l3", title: "List Comprehensions", type: "reading", duration: 12,
            notebookFile: "10_control_flow.ipynb",
            content: `## List Comprehensions\n\nA one-line shorthand for building lists from loops:\n\n\`\`\`python\n# Traditional loop\nsquares = []\nfor x in range(1, 6):\n    squares.append(x**2)\n\n# List comprehension — cleaner, Pythonic\nsquares = [x**2 for x in range(1, 6)]\n# [1, 4, 9, 16, 25]\n\`\`\`\n\n## Syntax\n\`\`\`\n[expression  for  item  in  iterable  if  condition]\n\`\`\`\n\n## Examples\n\`\`\`python\n# Even numbers 0–18\nevens = [x for x in range(20) if x % 2 == 0]\n# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\n\n# Filter and transform\nnumbers = [1, 4, 7, 10, 13, 16, 19]\neven_doubled = [i * 2 for i in numbers if i % 2 == 0]\n# [8, 20, 32]\n\n# Transform strings\nwords = ["hello", "world", "python"]\nupper = [w.upper() for w in words]\n# ['HELLO', 'WORLD', 'PYTHON']\n\n# Nested — flatten a 2D list\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat   = [num for row in matrix for num in row]\n# [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\`\`\`\n\n## Dict and Set Comprehensions\n\`\`\`python\n# Dict comprehension\nsquared = {n: n**2 for n in range(1, 6)}\n# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\n\n# Set comprehension — unique results only\nunique_lengths = {len(word) for word in ["hi", "hello", "hey", "world"]}\n# {2, 5}\n\`\`\`\n\n## Note: Tuple Comprehension\n\`\`\`python\n# (x for x in range(5)) creates a GENERATOR, not a tuple\ngen = (x**2 for x in range(5))   # generator object\ntup = tuple(x**2 for x in range(5))  # convert to tuple\n\`\`\``,
          },
          { id: "pyint-loops-l4", title: "Star and Number Patterns", type: "reading", duration: 10,
            notebookFile: "10_control_flow.ipynb",
            content: `## Pattern Generation with Nested Loops\n\nPatterns are excellent practice for understanding nested loop logic.\n\n## Square Pattern\n\`\`\`python\nn = 5\nfor i in range(n):\n    for j in range(n):\n        print("* ", end="")\n    print()   # new line\n# Output:\n# * * * * *\n# * * * * *\n# * * * * *\n# * * * * *\n# * * * * *\n\`\`\`\n\n## Right Triangle\n\`\`\`python\nfor i in range(1, n + 1):\n    for j in range(i):\n        print("* ", end="")\n    print()\n# *\n# * *\n# * * *\n# * * * *\n# * * * * *\n\`\`\`\n\n## Number Triangle\n\`\`\`python\nfor i in range(1, n + 1):\n    for j in range(1, i + 1):\n        print(j, end=" ")\n    print()\n# 1\n# 1 2\n# 1 2 3\n# 1 2 3 4\n# 1 2 3 4 5\n\`\`\`\n\n## Alphabet Pattern\n\`\`\`python\nfor i in range(5):\n    for j in range(i + 1):\n        print(chr(65 + j), end=" ")  # chr(65)='A', chr(66)='B'...\n    print()\n# A\n# A B\n# A B C\n# A B C D\n# A B C D E\n\`\`\``,
          },
          { id: "pyint-loops-l5", title: "Loop Challenges", type: "exercise", duration: 25, notebookFile: "10_control_flow.ipynb" },
        ],
      },
      {
        id: "pyint-sets", title: "Sets and Frozen Sets",
        lessons: [
          { id: "pyint-sets-l1", title: "Introduction to Sets", type: "reading", duration: 12,
            notebookFile: "11_set.ipynb",
            content: `## What is a Set?\n\nA set is an **unordered collection of unique values** — like a mathematical set.\n\n**5 Key Properties:**\n1. **Unordered** — no index, no guaranteed order\n2. **Unique** — duplicates automatically removed\n3. **Mutable** — can add/remove elements\n4. **No indexing** — cannot do \`s[0]\`\n5. **Heterogeneous** — can hold different types (if hashable)\n\n\`\`\`python\n# Duplicates removed automatically\nfruits = {"apple", "banana", "mango", "apple", "banana"}\nprint(fruits)  # {'apple', 'mango', 'banana'} — order varies!\n\n# Deduplication of a list\nnumbers = [1, 2, 3, 2, 1, 4, 3]\nunique  = set(numbers)\nprint(unique)  # {1, 2, 3, 4}\n\`\`\`\n\n## CRITICAL: Empty Set\n\`\`\`python\nd = {}       # dict! (empty dict, NOT a set)\ns = set()   # correct empty set\n\nprint(type({}))      # <class 'dict'>\nprint(type(set()))   # <class 'set'>\n\`\`\`\n\n## Adding and Removing\n\`\`\`python\ns = {1, 2, 3}\n\ns.add(4)              # add single element\ns.update([5, 6, 7])   # add multiple elements\n\ns.remove(3)           # remove — raises KeyError if missing\ns.discard(99)         # remove — SAFE (no error if missing)\npopped = s.pop()      # remove and return an arbitrary element\ns.clear()             # empty the set\n\nclone = s.copy()      # independent copy\n\`\`\``,
          },
          { id: "pyint-sets-l2", title: "Set Operations — Venn Diagrams in Code", type: "reading", duration: 15,
            notebookFile: "11_set.ipynb",
            content: `## Set Theory Operations\n\nSets support all classic mathematical set operations.\n\n\`\`\`python\nbarcelona = {"Messi", "Fati", "Pedri"}\nspain     = {"Fati", "Pedri", "Torres"}\n\n# Union (|) — all elements from BOTH sets\nprint(barcelona | spain)\n# {'Messi', 'Fati', 'Pedri', 'Torres'}\nprint(barcelona.union(spain))   # same result\n\n# Intersection (&) — elements in BOTH sets\nprint(barcelona & spain)\n# {'Fati', 'Pedri'}\nprint(barcelona.intersection(spain))\n\n# Difference (-) — in first but NOT in second\nprint(barcelona - spain)\n# {'Messi'}\nprint(barcelona.difference(spain))\n\n# Symmetric Difference (^) — in ONE but NOT both\nprint(barcelona ^ spain)\n# {'Messi', 'Torres'}\nprint(barcelona.symmetric_difference(spain))\n\`\`\`\n\n## Subset, Superset, Disjoint\n\`\`\`python\na = {1, 2}\nb = {1, 2, 3, 4}\nc = {5, 6}\n\nprint(a.issubset(b))     # True  — a ⊆ b\nprint(b.issuperset(a))   # True  — b ⊇ a\nprint(a.isdisjoint(c))   # True  — no shared elements\nprint(a.isdisjoint(b))   # False — they share 1 and 2\n\`\`\`\n\n## Mathematical Functions on Sets\n\`\`\`python\nnumbers = {3, 1, 4, 1, 5, 9, 2, 6}   # {1, 2, 3, 4, 5, 6, 9}\nprint(len(numbers))    # 7\nprint(max(numbers))    # 9\nprint(min(numbers))    # 1\nprint(sum(numbers))    # 30\nprint(5 in numbers)    # True\n\`\`\``,
          },
          { id: "pyint-sets-l3", title: "Frozen Sets — Immutable Sets", type: "reading", duration: 8,
            notebookFile: "11_set.ipynb",
            content: `## Frozen Sets\n\nA frozen set is an **immutable** set — once created, it cannot be changed. This means it can be used as a dictionary key or stored inside another set.\n\n\`\`\`python\n# Create from any iterable\nbarcelona = frozenset({"Messi", "Fati", "Pedri"})\n\n# Frozen sets support all read operations\nprint("Fati" in barcelona)       # True\nprint(len(barcelona))             # 3\n\n# But mutation raises AttributeError\nbarcelona.add("Ronaldo")          # AttributeError!\nbarcelona.discard("Messi")        # AttributeError!\n\`\`\`\n\n## Use Case: Dict Key\n\`\`\`python\n# Regular sets cannot be dict keys (unhashable)\n# Frozen sets CAN be dict keys\n\nvocab = {\n    frozenset(["cat", "dog"]): "animals",\n    frozenset(["rose", "tulip"]): "flowers",\n}\n\nkey = frozenset(["cat", "dog"])\nprint(vocab[key])   # 'animals'\n\`\`\`\n\n## set vs frozenset\n| Feature | set | frozenset |\n|---|---|---|\n| Mutable | Yes | No |\n| Hashable | No | Yes |\n| Dict key | No | Yes |\n| Set operations | Yes | Yes (read) |`,
          },
          { id: "pyint-sets-l4", title: "Set Practice", type: "exercise", duration: 20, notebookFile: "11_set.ipynb" },
        ],
      },
      {
        id: "pyint-dicts", title: "Dictionaries — Advanced",
        lessons: [
          { id: "pyint-dicts-l1", title: "5 Ways to Create Dictionaries", type: "reading", duration: 12,
            notebookFile: "12_dictionary.ipynb",
            content: `## Dictionary Characteristics\n\nA dictionary stores data as **key:value pairs**. 8 properties:\n1. Mutable\n2. Ordered (Python 3.7+)\n3. Keys must be unique\n4. Keys must be hashable (str, int, tuple — not list)\n5. Values can be any type\n6. Heterogeneous keys and values\n7. Dynamic size\n8. Accessed by key, not index\n\n## 5 Creation Methods\n\n\`\`\`python\n# Method 1: Empty dict\nd = {}\n\n# Method 2: Literal — most common\nstudent = {"name": "Sipho", "age": 21, "gpa": 3.7}\n\n# Method 3: dict() constructor\nstudent = dict(name="Sipho", age=21, gpa=3.7)\n\n# Method 4: fromkeys() — all keys with same default\nplayers  = ["Salah", "Kane", "Son"]\nscores   = dict.fromkeys(players, 0)\n# {'Salah': 0, 'Kane': 0, 'Son': 0}\n\n# Method 5: zip() — merge two parallel lists\nsubjects = ["Maths", "Science", "English"]\ngrades   = [85, 92, 78]\nresult   = dict(zip(subjects, grades))\n# {'Maths': 85, 'Science': 92, 'English': 78}\n\`\`\``,
          },
          { id: "pyint-dicts-l2", title: "Accessing, Updating, and Deleting", type: "reading", duration: 12,
            notebookFile: "12_dictionary.ipynb",
            content: `## Accessing Dictionary Values\n\n\`\`\`python\nd = {"name": "Sipho", "age": 21, "city": "Johannesburg"}\n\n# Direct — raises KeyError if key missing\nprint(d["name"])          # "Sipho"\n\n# get() — SAFE, returns None or default if missing\nprint(d.get("score"))          # None — no error!\nprint(d.get("score", "N/A"))   # "N/A" — custom default\n\n# setdefault() — insert key with default if it doesn't exist\nd.setdefault("email", "unknown@daqs.com")\nprint(d["email"])   # "unknown@daqs.com"\n\n# Iterating\nfor key in d.keys():             # iterate over keys\n    print(key)\n\nfor value in d.values():         # iterate over values\n    print(value)\n\nfor key, value in d.items():     # iterate over key-value pairs\n    print(f"{key}: {value}")\n\`\`\`\n\n## Updating and Deleting\n\`\`\`python\nd = {"name": "Sipho", "age": 21}\n\n# Update\nd["age"] = 22                 # modify existing\nd["gpa"] = 3.8                # add new key\nd.update({"city": "Joburg", "email": "s@daqs.com"})\n\n# Delete\ndel d["email"]                # KeyError if missing\nval = d.pop("gpa")            # remove and return value\nlast = d.popitem()            # remove and return last (key,value)\nd.clear()                     # empty the dict\ncopy = d.copy()               # independent copy\n\`\`\``,
          },
          { id: "pyint-dicts-l3", title: "Dictionary Comprehensions", type: "reading", duration: 12,
            notebookFile: "12_dictionary.ipynb",
            content: `## Dictionary Comprehensions\n\nBuild dictionaries from iterables in one line:\n\n\`\`\`python\n# Syntax: {key: value  for  item  in  iterable  if  condition}\n\n# Square numbers\nsquared = {n: n**2 for n in range(1, 6)}\n# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\n\n# Invert a dictionary (swap keys and values)\noriginal = {"a": 1, "b": 2, "c": 3}\ninverted = {v: k for k, v in original.items()}\n# {1: 'a', 2: 'b', 3: 'c'}\n\n# Filter while building\nscores = {"Alice": 85, "Bob": 52, "Charlie": 91, "Diana": 48}\npassed = {name: s for name, s in scores.items() if s >= 60}\n# {'Alice': 85, 'Charlie': 91}\n\n# String manipulation\nwords = ["hello", "world", "python"]\nlengths = {word: len(word) for word in words}\n# {'hello': 5, 'world': 5, 'python': 6}\n\`\`\`\n\n## Practical: Word Frequency Counter\n\`\`\`python\ntext  = "the quick brown fox jumps over the lazy dog the fox"\nwords = text.split()\n\nfreq = {}\nfor word in words:\n    freq[word] = freq.get(word, 0) + 1\n\n# One-liner using comprehension + Counter\nfrom collections import Counter\nfreq = Counter(words)\n\n# Sort by frequency (highest first)\nsorted_freq = dict(sorted(freq.items(), key=lambda x: x[1], reverse=True))\nprint(sorted_freq)\n# {'the': 3, 'fox': 2, 'quick': 1, ...}\n\`\`\`\n\n## Comparing All 4 Data Structures\n| Feature | list | tuple | set | dict |\n|---|---|---|---|---|\n| Ordered | Yes | Yes | No | Yes (3.7+) |\n| Mutable | Yes | No | Yes | Yes |\n| Duplicates | Yes | Yes | No | Keys: No |\n| Access by | Index | Index | — | Key |\n| Syntax | \`[]\` | \`()\` | \`{}\` | \`{k:v}\` |`,
          },
          { id: "pyint-dicts-l4", title: "Word Frequency Counter", type: "exercise", duration: 20, notebookFile: "12_dictionary.ipynb" },
          { id: "pyint-dicts-l5", title: "Data Structures Deep Dive Quiz", type: "quiz", duration: 10 },
        ],
      },
      {
        id: "pyint-m1", title: "Object-Oriented Programming",
        lessons: [
          { id: "pyint-m1-l1", title: "Classes and Objects", type: "reading", duration: 20,
            notebookFile: "13_oop.ipynb",
            content: `## What is OOP?\n\nObject-Oriented Programming organises code around **objects** — bundles of data (attributes) and behaviour (methods). This mirrors how we think about the real world.\n\n**3 Programming Paradigms:**\n1. **Procedural** — step-by-step instructions\n2. **Functional** — functions as building blocks\n3. **Object-Oriented** — objects as building blocks\n\n**Key Terms:** Class (blueprint), Object/Instance (built from blueprint), Attribute (data), Method (function), \`self\` (the object itself)\n\n## Defining a Class\n\`\`\`python\nclass Television:\n    """A Television class — the blueprint for TV objects."""\n\n    # Parameterized constructor\n    def __init__(self, brand, model, screen_size):\n        self.brand       = brand        # instance variable\n        self.model       = model\n        self.screen_size = screen_size\n        self.is_on       = False\n\n    def turn_on(self):\n        self.is_on = True\n        print(f"{self.brand} TV is ON")\n\n    def turn_off(self):\n        self.is_on = False\n        print(f"{self.brand} TV is OFF")\n\n    def __str__(self):\n        return f"{self.brand} {self.model} ({self.screen_size}\\\")\"\n\n\n# Create instances from the blueprint\nsamsung = Television("Samsung", "Neo QLED", 65)\nlg      = Television("LG", "OLED C2", 55)\n\nsamsung.turn_on()\nprint(samsung)   # Samsung Neo QLED (65")\n\`\`\`\n\n## Class Variables vs Instance Variables\n\`\`\`python\nclass Student:\n    school = "DAQS High"    # class variable — SHARED by all instances\n    student_count = 0\n\n    def __init__(self, name, gpa):\n        self.name = name     # instance variable — UNIQUE per student\n        self.gpa  = gpa\n        Student.student_count += 1\n\ns1 = Student("Sipho", 3.7)\ns2 = Student("Amara", 3.9)\n\nprint(Student.school)        # DAQS High\nprint(Student.student_count) # 2\nprint(s1.name)               # Sipho\nprint(s2.gpa)                # 3.9\n\`\`\``,
          },
          { id: "pyint-m1-l2", title: "Encapsulation and Properties", type: "reading", duration: 15,
            notebookFile: "13_oop.ipynb",
            content: `## Encapsulation — Controlling Access\n\nEncapsulation bundles data and methods together, restricting direct access to internals. Python uses naming conventions:\n\n| Convention | Access Level | Example |\n|---|---|---|\n| \`name\` | Public | \`self.name\` — accessible anywhere |\n| \`_name\` | Protected | \`self._balance\` — intended for internal use |\n| \`__name\` | Private | \`self.__pin\` — name-mangled by Python |\n\n\`\`\`python\nclass BankAccount:\n    def __init__(self, owner, balance):\n        self.owner    = owner            # public\n        self._balance = balance          # protected\n        self.__pin    = "1234"           # private (name-mangled)\n\n    def get_balance(self):\n        return self._balance             # public getter\n\n    def deposit(self, amount):\n        if amount > 0:\n            self._balance += amount\n\n    def withdraw(self, amount):\n        if 0 < amount <= self._balance:\n            self._balance -= amount\n        else:\n            raise ValueError("Insufficient funds")\n\n    def __verify_pin(self, pin):         # private method\n        return self.__pin == pin\n\n\naccount = BankAccount("Sipho", 1000)\nprint(account.get_balance())         # 1000\n# print(account.__pin)               # AttributeError!\nprint(account._BankAccount__pin)     # "1234" — mangled name\n\`\`\`\n\n## Class, Instance, and Static Methods\n\`\`\`python\nclass Student:\n    school = "DAQS"\n\n    def __init__(self, name):\n        self.name = name\n\n    def study(self):              # instance method — gets self\n        return f"{self.name} is studying"\n\n    @classmethod\n    def get_school(cls):          # class method — gets cls\n        return f"School: {cls.school}"\n\n    @staticmethod\n    def is_valid_grade(grade):    # static method — gets neither\n        return 0 <= grade <= 100\n\ns = Student("Sipho")\nprint(s.study())                  # Sipho is studying\nprint(Student.get_school())       # School: DAQS\nprint(Student.is_valid_grade(85)) # True\n\`\`\`\n\n## Properties (@property decorator)\n\`\`\`python\nclass Circle:\n    def __init__(self, radius):\n        self._radius = radius\n\n    @property\n    def radius(self):\n        return self._radius\n\n    @radius.setter\n    def radius(self, value):\n        if value < 0:\n            raise ValueError("Radius cannot be negative")\n        self._radius = value\n\n    @property\n    def area(self):\n        import math\n        return math.pi * self._radius ** 2\n\nc = Circle(5)\nprint(c.radius)   # 5 — calls getter\nc.radius = 10     # calls setter\nprint(c.area)     # 314.159...\n\`\`\``,
          },
          { id: "pyint-m1-l3", title: "Inheritance", type: "reading", duration: 15,
            notebookFile: "13_oop.ipynb",
            content: `## Inheritance — Reusing Code\n\nInheritance lets a child class inherit attributes and methods from a parent class.\n\n## Single Inheritance\n\`\`\`python\nclass Television:\n    def __init__(self, brand, model, screen_size):\n        self.brand = brand\n        self.model = model\n        self.screen_size = screen_size\n\n    def turn_on(self):\n        print(f"{self.brand} TV is ON")\n\n\nclass SmartTelevision(Television):    # inherits from Television\n    def __init__(self, brand, model, screen_size, os):\n        super().__init__(brand, model, screen_size)  # call parent\n        self.os = os\n\n    def connect_internet(self):\n        print(f"Connected via {self.os}")\n\n\nmy_tv = SmartTelevision("Samsung", "Neo QLED", 65, "Tizen")\nmy_tv.turn_on()            # inherited from Television\nmy_tv.connect_internet()   # own method\n\`\`\`\n\n## Multilevel Inheritance\n\`\`\`python\nclass Animal:\n    def breathe(self): print("Breathing...")\n\nclass Mammal(Animal):\n    def nurse_young(self): print("Nursing...")\n\nclass Dog(Mammal):\n    def bark(self): print("Woof!")\n\ndog = Dog()\ndog.breathe()     # from Animal (grandparent)\ndog.nurse_young() # from Mammal (parent)\ndog.bark()        # own method\n\`\`\`\n\n## Multiple Inheritance\n\`\`\`python\nclass Father:\n    def coding(self): print("Codes in Python")\n\nclass Mother:\n    def cooking(self): print("Cooks traditional food")\n\nclass Child(Father, Mother):   # inherits from BOTH\n    def playing(self): print("Plays games")\n\nc = Child()\nc.coding()    # from Father\nc.cooking()   # from Mother\nc.playing()   # own\n\`\`\`\n\n## Polymorphism and super()\n\`\`\`python\nclass Shape:\n    def area(self):\n        return 0\n\nclass Circle(Shape):\n    def __init__(self, r): self.r = r\n    def area(self):\n        import math\n        return math.pi * self.r ** 2   # override parent method\n\nclass Square(Shape):\n    def __init__(self, s): self.s = s\n    def area(self): return self.s ** 2\n\nshapes = [Circle(5), Square(4), Circle(3)]\nfor s in shapes:\n    print(f"Area: {s.area():.2f}")   # each calls its OWN area()\n\`\`\``,
          },
          { id: "pyint-m1-l4", title: "Abstraction", type: "reading", duration: 12,
            notebookFile: "13_oop.ipynb",
            content: `## Abstraction — Hiding Complexity\n\nAbstraction shows only the essential details and hides implementation. Python's \`abc\` module provides abstract base classes (ABCs).\n\n\`\`\`python\nfrom abc import ABC, abstractmethod\n\nclass Television(ABC):   # abstract class — CANNOT instantiate directly\n    @abstractmethod\n    def turn_on(self):\n        pass   # child MUST implement this\n\n    @abstractmethod\n    def turn_off(self):\n        pass\n\n    def display_info(self):   # concrete method — can be inherited\n        print("Generic television display")\n\n\nclass SamsungTV(Television):\n    def turn_on(self):    print("Samsung TV ON — QLED display")\n    def turn_off(self):   print("Samsung TV OFF")\n\nclass LGTV(Television):\n    def turn_on(self):    print("LG TV ON — OLED display")\n    def turn_off(self):   print("LG TV OFF")\n\n\n# Television()   # TypeError — cannot instantiate abstract class!\nsamsung = SamsungTV()\nsamsung.turn_on()\nsamsung.display_info()\n\`\`\`\n\n## Interface Pattern (all methods abstract)\n\`\`\`python\nfrom abc import ABC, abstractmethod\n\nclass Payable(ABC):   # interface\n    @abstractmethod\n    def calculate_pay(self): pass\n\n    @abstractmethod\n    def display_pay(self): pass\n\n\nclass FullTimeEmployee(Payable):\n    def __init__(self, salary):\n        self.salary = salary\n\n    def calculate_pay(self):\n        return self.salary\n\n    def display_pay(self):\n        print(f"Monthly salary: R{self.calculate_pay():,.0f}")\n\nclass ContractEmployee(Payable):\n    def __init__(self, rate, hours):\n        self.rate  = rate\n        self.hours = hours\n\n    def calculate_pay(self):\n        return self.rate * self.hours\n\n    def display_pay(self):\n        print(f"Contract pay: R{self.calculate_pay():,.0f}")\n\nfor emp in [FullTimeEmployee(25000), ContractEmployee(350, 80)]:\n    emp.display_pay()\n\`\`\``,
          },
          { id: "pyint-m1-l5", title: "OOP Practice: School Management System", type: "exercise", duration: 35, notebookFile: "13_oop.ipynb" },
        ],
      },
      {
        id: "pyint-m2", title: "Exception Handling",
        lessons: [
          { id: "pyint-m2-l1", title: "Introduction to Exceptions", type: "reading", duration: 12,
            notebookFile: "14_exception_handling.ipynb",
            content: `## Errors vs Exceptions\n\n**Syntax errors** — detected before the program runs (e.g. missing colon, wrong indentation).\n\n**Runtime exceptions** — occur during execution when something unexpected happens.\n\n\`\`\`python\n# Common built-in exceptions:\nZeroDivisionError   # 10 / 0\nTypeError           # "hello" + 5\nValueError          # int("abc")\nNameError           # print(undefined_var)\nIndexError          # [1,2,3][99]\nKeyError            # {"a": 1}["b"]\nFileNotFoundError   # open("missing.txt")\nAttributeError      # "hello".no_such_method()\n\`\`\`\n\n## Normal vs Abnormal Flow\n\`\`\`python\n# Without exception handling — program CRASHES\ndistance      = 100\nfuel_consumed = 0\nmileage = distance / fuel_consumed   # ZeroDivisionError! Program stops here.\nprint("This line never runs.")\n\n# With exception handling — program SURVIVES\ntry:\n    mileage = distance / fuel_consumed\nexcept ZeroDivisionError:\n    print("Fuel consumed cannot be zero.")\nprint("This line DOES run — program continues normally.")\n\`\`\``,
          },
          { id: "pyint-m2-l2", title: "try / except / finally", type: "reading", duration: 15,
            notebookFile: "14_exception_handling.ipynb",
            content: `## The try-except Block\n\n\`\`\`python\ndef safe_divide(a, b):\n    try:\n        result = int(a) / int(b)\n    except ZeroDivisionError:\n        print("Cannot divide by zero.")\n        return None\n    except ValueError:\n        print("Please enter valid numbers.")\n        return None\n    else:\n        # Runs ONLY if NO exception occurred\n        print(f"Success: {a} / {b} = {result}")\n        return result\n    finally:\n        # ALWAYS runs — exception or not\n        print("safe_divide() completed")\n\nsafe_divide(10, 2)    # Success\nsafe_divide(10, 0)    # ZeroDivisionError handled\nsafe_divide(10, "x")  # ValueError handled\n\`\`\`\n\n## Catching Multiple Exceptions\n\`\`\`python\n# Method 1: Separate except blocks (different handling)\ntry:\n    x = int(input("Enter number: "))\n    print(10 / x)\nexcept ValueError:\n    print("Not a valid number!")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\n\n# Method 2: Single except for multiple types\ntry:\n    # some code\n    pass\nexcept (ValueError, TypeError, ZeroDivisionError):\n    print("One of these errors occurred")\n\n# Method 3: Catch-all (use carefully — hides bugs!)\ntry:\n    # some code\n    pass\nexcept Exception as e:\n    print(f"Unexpected error: {e}")\n\`\`\`\n\n## finally — Guaranteed Cleanup\n\`\`\`python\ntry:\n    file = open("data.txt")\n    data = file.read()\nexcept FileNotFoundError as e:\n    print(f"Error: {e}")\nfinally:\n    print("Closing resources...")   # ALWAYS runs\n    # file.close()  — would go here\n\`\`\``,
          },
          { id: "pyint-m2-l3", title: "Custom Exceptions", type: "reading", duration: 12,
            notebookFile: "14_exception_handling.ipynb",
            content: `## Creating Custom Exception Classes\n\nCustom exceptions make your code more expressive and allow callers to catch specific error types.\n\n\`\`\`python\n# Define a custom exception by inheriting from Exception\nclass NegativeError(Exception):\n    def __init__(self, message):\n        super().__init__(message)\n\ndef calculate_area(length):\n    if length < 0:\n        raise NegativeError("Length cannot be negative.")\n    return length * length\n\ntry:\n    area = calculate_area(-5)\nexcept NegativeError as e:\n    print(f"Custom error caught: {e}")\n\`\`\`\n\n## Multiple Custom Exceptions\n\`\`\`python\nclass InsufficientFundsError(Exception):\n    def __init__(self, amount, balance):\n        super().__init__(f"Cannot withdraw R{amount} — balance is R{balance}")\n        self.amount  = amount\n        self.balance = balance\n\nclass NegativeAmountError(Exception):\n    def __init__(self, amount):\n        super().__init__(f"Amount cannot be negative: R{amount}")\n\n\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner   = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount < 0:\n            raise NegativeAmountError(amount)\n        self.balance += amount\n        print(f"Deposited R{amount}. Balance: R{self.balance}")\n\n    def withdraw(self, amount):\n        if amount < 0:\n            raise NegativeAmountError(amount)\n        if amount > self.balance:\n            raise InsufficientFundsError(amount, self.balance)\n        self.balance -= amount\n        print(f"Withdrew R{amount}. Balance: R{self.balance}")\n\n\naccount = BankAccount("Sipho", 1000)\ntry:\n    account.withdraw(500)    # OK\n    account.withdraw(800)    # InsufficientFundsError\nexcept InsufficientFundsError as e:\n    print(e)\nexcept NegativeAmountError as e:\n    print(e)\n\`\`\``,
          },
          { id: "pyint-m2-l4", title: "Exception Handling Practice", type: "exercise", duration: 25, notebookFile: "14_exception_handling.ipynb" },
          { id: "pyint-m2-l5", title: "Exception Handling Quiz", type: "quiz", duration: 10 },
        ],
      },
      {
        id: "pyint-m3", title: "File I/O and Modules",
        lessons: [
          { id: "pyint-m3-l1", title: "Reading and Writing Files", type: "reading", duration: 12,
            content: `## File I/O in Python\n\nPython can read and write files — text files, CSVs, JSON, binary, and more.\n\n\`\`\`python\n# Always use 'with' — it closes the file automatically!\nwith open("students.txt", "r") as f:\n    content = f.read()        # entire file as one string\n    print(content)\n\n# Read line by line — memory efficient for large files\nwith open("students.txt", "r") as f:\n    for line in f:\n        print(line.strip())   # strip() removes trailing \\n\n\n# Read all lines as a list\nwith open("students.txt", "r") as f:\n    lines = f.readlines()     # ['line1\\n', 'line2\\n', ...]\n\`\`\`\n\n## Writing Files\n\`\`\`python\n# Write — creates file or OVERWRITES existing\nwith open("output.txt", "w") as f:\n    f.write("Line 1\\n")\n    f.write("Line 2\\n")\n\n# Append — adds to end, never overwrites\nwith open("output.txt", "a") as f:\n    f.write("Line 3\\n")\n\n# Write multiple lines at once\nlines = ["Alice\\n", "Bob\\n", "Charlie\\n"]\nwith open("names.txt", "w") as f:\n    f.writelines(lines)\n\`\`\`\n\n## File Modes\n| Mode | Meaning |\n|---|---|\n| \`"r"\` | Read — error if file doesn't exist |\n| \`"w"\` | Write — creates or overwrites |\n| \`"a"\` | Append — adds to end |\n| \`"x"\` | Create — error if file exists |\n| \`"rb"\` | Read binary |\n| \`"wb"\` | Write binary |`,
          },
          { id: "pyint-m3-l2", title: "Working with CSV and JSON", type: "reading", duration: 12,
            content: `## CSV Files\n\n\`\`\`python\nimport csv\n\n# Reading CSV\nwith open("students.csv", "r") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)   # each row is a list\n\n# Reading into dicts (first row = headers)\nwith open("students.csv", "r") as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(row["name"], row["score"])\n\n# Writing CSV\nstudents = [\n    ["Sipho", 85, "Joburg"],\n    ["Amara", 92, "Cape Town"],\n]\nwith open("output.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["Name", "Score", "City"])  # header\n    writer.writerows(students)\n\`\`\`\n\n## JSON Files\n\`\`\`python\nimport json\n\n# Read JSON\nwith open("config.json", "r") as f:\n    data = json.load(f)   # → Python dict or list\n\nprint(data["database"]["host"])\n\n# Write JSON\nconfig = {"host": "localhost", "port": 5432, "name": "daqs_db"}\nwith open("config.json", "w") as f:\n    json.dump(config, f, indent=4)   # indent=4 for readable output\n\n# Convert without files\njson_string = json.dumps(config)          # dict → JSON string\nconfig_back = json.loads(json_string)     # JSON string → dict\n\`\`\``,
          },
          { id: "pyint-m3-l3", title: "Creating Python Modules", type: "reading", duration: 10,
            content: `## What is a Module?\n\nAny Python file is a module. Split large programs into separate files for organisation.\n\n\`\`\`python\n# math_utils.py — your custom module\ndef add(a, b): return a + b\ndef subtract(a, b): return a - b\nPI = 3.14159\n\n# main.py — import and use\nimport math_utils\nprint(math_utils.add(3, 5))   # 8\nprint(math_utils.PI)           # 3.14159\n\n# Import specific names\nfrom math_utils import add, PI\nprint(add(3, 5))   # 8\n\n# Import with alias\nimport math_utils as mu\nprint(mu.subtract(10, 3))   # 7\n\`\`\`\n\n## __name__ == "__main__"\n\`\`\`python\n# In math_utils.py:\ndef add(a, b): return a + b\n\nif __name__ == "__main__":\n    # Only runs when this file is executed directly,\n    # NOT when it is imported by another module\n    print("Running math_utils directly")\n    print(add(3, 5))\n\`\`\`\n\n## Packages — Organising Multiple Modules\n\`\`\`\nmyapp/\n    __init__.py       # makes this folder a package\n    utils.py\n    models.py\n    data/\n        __init__.py\n        loader.py\n\`\`\`\n\`\`\`python\nfrom myapp.utils import add\nfrom myapp.data.loader import load_csv\n\`\`\``,
          },
          { id: "pyint-m3-l4", title: "File I/O Practice", type: "exercise", duration: 25 },
        ],
      },
      {
        id: "pyint-m4", title: "Advanced Patterns",
        lessons: [
          { id: "pyint-m4-l1", title: "Comprehensions — All Types", type: "reading", duration: 12,
            content: `## Python Comprehensions\n\nComprehensions are concise, Pythonic ways to create collections.\n\n## List Comprehension\n\`\`\`python\n# [expression for item in iterable if condition]\nsquares = [x**2 for x in range(1, 11)]\nevens   = [x for x in range(20) if x % 2 == 0]\nupper   = [w.upper() for w in ["hello", "world"]]\n\`\`\`\n\n## Dict Comprehension\n\`\`\`python\n# {key: value for item in iterable if condition}\nsquared   = {n: n**2 for n in range(1, 6)}\ninverted  = {v: k for k, v in {"a": 1, "b": 2}.items()}\nfiltered  = {k: v for k, v in scores.items() if v >= 80}\n\`\`\`\n\n## Set Comprehension\n\`\`\`python\n# {expression for item in iterable if condition}\nunique_lengths = {len(w) for w in ["hi", "hello", "hey"]}\n# {2, 5}\n\`\`\`\n\n## Generator Expression\n\`\`\`python\n# (expression for item in iterable if condition)\n# Produces values lazily — extremely memory efficient\ngen    = (x**2 for x in range(1_000_000))\ntotal  = sum(x**2 for x in range(1_000_000))  # no list created!\n\`\`\`\n\n## Nested Comprehensions\n\`\`\`python\n# Flatten a 2D matrix\nmatrix = [[1,2,3],[4,5,6],[7,8,9]]\nflat   = [n for row in matrix for n in row]\n# [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n# Transpose a matrix\ntransposed = [[row[i] for row in matrix] for i in range(3)]\n\`\`\``,
          },
          { id: "pyint-m4-l2", title: "Generators and yield", type: "reading", duration: 15,
            notebookFile: "07_functions.ipynb",
            content: `## Generators — Lazy Evaluation\n\nA generator produces values **one at a time, on demand** — no need to store everything in memory at once.\n\n\`\`\`python\ndef my_range(n):\n    i = 0\n    while i < n:\n        yield i    # yield pauses and returns i\n        i += 1     # resumes here on next call\n\ngen = my_range(5)\nprint(next(gen))   # 0\nprint(next(gen))   # 1\nprint(next(gen))   # 2\n\n# Or just iterate:\nfor value in my_range(5):\n    print(value)\n\`\`\`\n\n## Memory Comparison\n\`\`\`python\nimport sys\n\n# List — stores all 1M numbers at once\nbig_list = [x**2 for x in range(1_000_000)]\nprint(sys.getsizeof(big_list))   # ~8 MB\n\n# Generator — one value at a time\nbig_gen  = (x**2 for x in range(1_000_000))\nprint(sys.getsizeof(big_gen))    # ~120 bytes!\n\nprint(sum(big_gen))   # same answer — tiny memory\n\`\`\`\n\n## Generator with Multiple yield\n\`\`\`python\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nfor num in fibonacci(10):\n    print(num, end=" ")   # 0 1 1 2 3 5 8 13 21 34\n\`\`\`\n\n## When to Use Generators\n- Processing large files line by line\n- Infinite sequences (e.g. live data streams)\n- Building data pipelines\n- Any case where you don't need all values at once`,
          },
          { id: "pyint-m4-l3", title: "Decorators", type: "reading", duration: 15,
            notebookFile: "07_functions.ipynb",
            content: `## What is a Decorator?\n\nA decorator **wraps** a function to add behaviour before and/or after it runs — without modifying the original.\n\n\`\`\`python\n# A decorator is just a function that takes and returns a function\ndef timer(func):\n    import time\n    def wrapper(*args, **kwargs):\n        start  = time.time()\n        result = func(*args, **kwargs)   # run the original\n        end    = time.time()\n        print(f"{func.__name__} took {end - start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_sum(n):\n    return sum(range(n))\n\nslow_sum(1_000_000)\n# slow_sum took 0.0412s\n\`\`\`\n\n\`@timer\` is syntactic sugar for: \`slow_sum = timer(slow_sum)\`\n\n## Practical Decorator — Input Sanitiser\n\`\`\`python\ndef sanitise(func):\n    def inner(x, y):\n        if x < 0: x = 0   # clamp negatives to 0 before calling func\n        if y < 0: y = 0\n        return func(x, y)\n    return inner\n\n@sanitise\ndef subtract(a, b):\n    return a - b\n\nprint(subtract(10, 3))    # 7\nprint(subtract(-5, 3))    # 0 (negative sanitised)\n\`\`\`\n\n## Chaining Decorators\n\`\`\`python\n@decorator_a\n@decorator_b\ndef my_function():\n    pass\n\n# Equivalent to:\nmy_function = decorator_a(decorator_b(my_function))\n\`\`\`\n\n## functools.wraps — Preserve Metadata\n\`\`\`python\nfrom functools import wraps\n\ndef logger(func):\n    @wraps(func)   # preserves func.__name__, func.__doc__\n    def wrapper(*args, **kwargs):\n        print(f"Calling {func.__name__}")\n        return func(*args, **kwargs)\n    return wrapper\n\`\`\``,
          },
          { id: "pyint-m4-l4", title: "Context Managers with 'with'", type: "reading", duration: 10,
            content: `## The Problem: Resource Cleanup\n\nWhen working with files, database connections, or locks, you must always close/release them — even if an error occurs.\n\n\`\`\`python\n# Risky — if error occurs, file never closes\nf = open("data.txt", "r")\ndata = f.read()\nf.close()\n\n# Better — use 'with'\nwith open("data.txt", "r") as f:\n    data = f.read()\n# f is automatically closed here, even on exception!\n\`\`\`\n\n## Multiple Context Managers\n\`\`\`python\nwith open("input.txt", "r") as src, open("output.txt", "w") as dst:\n    for line in src:\n        dst.write(line.upper())\n\`\`\`\n\n## Custom Context Manager\n\nAny object with \`__enter__\` and \`__exit__\` methods works with \`with\`:\n\n\`\`\`python\nclass DatabaseConnection:\n    def __enter__(self):\n        print("Opening DB connection...")\n        return self\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        print("Closing DB connection...")\n        return False   # don't suppress exceptions\n\nwith DatabaseConnection() as db:\n    print("Running queries...")\n# Output:\n# Opening DB connection...\n# Running queries...\n# Closing DB connection...\n\`\`\`\n\n## contextlib.contextmanager\n\`\`\`python\nfrom contextlib import contextmanager\n\n@contextmanager\ndef timer():\n    import time\n    start = time.time()\n    yield   # code inside 'with' runs here\n    elapsed = time.time() - start\n    print(f"Elapsed: {elapsed:.4f}s")\n\nwith timer():\n    sum(range(1_000_000))\n# Elapsed: 0.0281s\n\`\`\``,
          },
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
    icon: "/Python-Logo.png",
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
      {
        id: "pyadv-m5", title: "Python Capstone — Integrated Practice",
        lessons: [
          { id: "pyadv-m5-l1", title: "Capstone Overview and Setup", type: "reading", duration: 10,
            notebookFile: "Tutoriall.ipynb",
            content: `## Python Capstone Practice\n\nThis capstone module integrates everything from the Python track into a single hands-on practice session. You will work through exercises that combine:\n\n- **Variables, data types, and operators** (Chapters 3-5)\n- **Control flow** — conditionals and loops (Chapters 6, 10)\n- **Functions** — all argument types, scope, lambda, decorators, generators (Chapter 7)\n- **Data structures** — lists, tuples, sets, dictionaries (Chapters 8-12)\n- **OOP** — classes, inheritance, encapsulation, polymorphism, abstraction (Chapter 13)\n- **Exception handling** — try/except/finally, custom exceptions (Chapter 14)\n\n## How to Use This Module\n\n1. Open the notebook by clicking **"Open in Notebook"** above\n2. Work through each section's exercises in the Jupyter cells\n3. Run the grader cell at the bottom to check your answers\n4. Use the DAQS AI Tutor for hints if you get stuck\n\n## Capstone Exercises Preview\n\n\`\`\`python\n# Exercise 1: Variable properties\nx = 42\nprint(f"Value: {x}, Type: {type(x).__name__}, ID: {id(x)}")\n\n# Exercise 2: String manipulation\nname = "python programming"\nprint(name.title())          # Python Programming\nprint(name[::-1])            # gnimmargorp nohtyp\nprint(name.count("p"))       # 2\n\n# Exercise 3: List operations\nnums = [5, 2, 8, 1, 9, 3, 7, 4, 6]\nnums.sort()\nprint(nums)        # [1, 2, 3, 4, 5, 6, 7, 8, 9]\nprint(nums[::2])   # [1, 3, 5, 7, 9] — odd-indexed elements\n\`\`\``,
          },
          { id: "pyadv-m5-l2", title: "OOP Capstone: Design a System", type: "exercise", duration: 45,
            notebookFile: "Tutoriall.ipynb",
            content: `## OOP Capstone Exercise\n\nDesign and implement a **School Management System** using all OOP concepts.\n\n### Requirements\n\n1. **Abstract base class** \`Person\` with abstract method \`get_info()\`\n2. **Student** class inheriting from Person:\n   - Private attribute \`__grades\` (list)\n   - Method to add a grade\n   - Property to calculate average grade\n   - \`__str__\` method\n3. **Lecturer** class inheriting from Person:\n   - Attribute \`subjects\` (list)\n   - Method to add a subject\n4. **School** class:\n   - Class variable tracking total schools created\n   - Methods: \`enrol_student()\`, \`hire_lecturer()\`, \`display_all()\`\n5. **Custom exceptions**: \`EnrolmentError\`, \`InvalidGradeError\`\n\n### Starter Code\n\`\`\`python\nfrom abc import ABC, abstractmethod\n\nclass Person(ABC):\n    def __init__(self, name, age):\n        self.name = name\n        self._age  = age     # protected\n\n    @abstractmethod\n    def get_info(self):\n        pass\n\n    @property\n    def age(self):\n        return self._age\n\n\nclass Student(Person):\n    def __init__(self, name, age, student_id):\n        super().__init__(name, age)\n        self.student_id = student_id\n        self.__grades   = []   # private\n\n    def add_grade(self, grade):\n        if not 0 <= grade <= 100:\n            raise InvalidGradeError(f"Grade {grade} out of range")\n        self.__grades.append(grade)\n\n    @property\n    def average(self):\n        if not self.__grades:\n            return 0\n        return sum(self.__grades) / len(self.__grades)\n\n    def get_info(self):\n        return f"Student: {self.name} | Avg: {self.average:.1f}%"\n\n    def __str__(self):\n        return self.get_info()\n\n\n# TODO: implement Lecturer, School, and custom exceptions\n# Then test your system:\nschool = School("DAQS High")\nsipho  = Student("Sipho", 17, "STU001")\nsipho.add_grade(85)\nsipho.add_grade(92)\nschool.enrol_student(sipho)\nprint(sipho)\n\`\`\``,
          },
          { id: "pyadv-m5-l3", title: "Algorithms and Complexity", type: "reading", duration: 20,
            notebookFile: "Tutoriall.ipynb",
            content: `## Algorithm Complexity — Big O Notation\n\nBig O describes how an algorithm's performance scales with input size.\n\n| Notation | Name | Example |\n|---|---|---|\n| O(1) | Constant | Dict lookup, list append |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | List search, for loop |\n| O(n log n) | Linearithmic | Merge sort, Tim sort |\n| O(n²) | Quadratic | Nested loops, bubble sort |\n| O(2ⁿ) | Exponential | Recursive Fibonacci |\n\n## Common Algorithm Patterns\n\n### Binary Search — O(log n)\n\`\`\`python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# List must be SORTED for binary search to work\nnums = [1, 3, 5, 7, 9, 11, 13, 15]\nprint(binary_search(nums, 7))    # 3 (index)\nprint(binary_search(nums, 6))    # -1 (not found)\n\`\`\`\n\n### Recursion — Fibonacci\n\`\`\`python\n# Naive recursion — O(2ⁿ) — very slow!\ndef fib_naive(n):\n    if n <= 1: return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\n# Dynamic programming / memoization — O(n)\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\nprint(fib(50))   # instant with memoization!\n\`\`\`\n\n### Sorting Algorithms\n\`\`\`python\n# Bubble Sort — O(n²) — educational, not production\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\n# Python's built-in sort — Tim sort, O(n log n)\nnums = [3, 1, 4, 1, 5, 9, 2, 6]\nnums.sort()               # in-place\nsorted_nums = sorted(nums) # new list\n\`\`\``,
          },
          { id: "pyadv-m5-l4", title: "Full Python Capstone Assessment", type: "quiz", duration: 30, notebookFile: "Tutoriall.ipynb" },
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
