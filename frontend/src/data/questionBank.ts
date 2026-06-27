export type QuestionType = "mcq" | "short_answer" | "code";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface BankQuestion {
  id: string;
  subject: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  points: number;
  options?: string[];
  correct?: number;
  starter_code?: string;
  hint?: string;
  solution: {
    answer: string;
    explanation: string;
    concepts: string[];
  };
  tags: string[];
}

export const questionBank: BankQuestion[] = [

  // ─── PYTHON BEGINNER ──────────────────────────────────────────────────────
  {
    id: "py-b-01", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the output of `print(type(3.14))`?",
    options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"],
    correct: 1,
    solution: { answer: "<class 'float'>", explanation: "3.14 is a floating-point number (float) in Python. Python uses `float` for decimal numbers. There is no `double` type in Python — floats are already 64-bit.", concepts: ["data types", "float"] },
    tags: ["python", "types"],
  },
  {
    id: "py-b-02", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "Which of the following correctly creates an empty dictionary in Python?",
    options: ["d = []", "d = ()", "d = {}", "d = set()"],
    correct: 2,
    solution: { answer: "d = {}", explanation: "`{}` creates an empty dictionary. `[]` creates a list, `()` creates a tuple, and `set()` creates an empty set (you cannot use `{}` for an empty set because Python treats it as a dict).", concepts: ["dictionaries", "data structures"] },
    tags: ["python", "dict"],
  },
  {
    id: "py-b-03", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does the `len()` function return?",
    options: ["The last element of a list", "The number of items in an object", "The memory size of an object", "The type of an object"],
    correct: 1,
    solution: { answer: "The number of items in an object", explanation: "`len()` returns the number of items in a sequence or collection. For strings it returns character count, for lists it returns element count, for dicts it returns key count.", concepts: ["built-in functions", "len"] },
    tags: ["python", "builtins"],
  },
  {
    id: "py-b-04", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What will `print(10 // 3)` output?",
    options: ["3.33", "3", "4", "3.0"],
    correct: 1,
    solution: { answer: "3", explanation: "`//` is the floor division operator. It divides and rounds down to the nearest integer. 10 ÷ 3 = 3.33..., floored to 3. Note it returns an int when both operands are ints.", concepts: ["operators", "floor division"] },
    tags: ["python", "operators"],
  },
  {
    id: "py-b-05", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "Which keyword is used to check membership in a list?",
    options: ["has", "contains", "in", "exists"],
    correct: 2,
    solution: { answer: "in", explanation: "The `in` keyword checks if an element exists in a sequence. e.g., `3 in [1, 2, 3]` returns True. It works for lists, tuples, strings, sets, and dictionary keys.", concepts: ["membership operators", "in"] },
    tags: ["python", "operators"],
  },
  {
    id: "py-b-06", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the correct syntax to define a function that takes two parameters?",
    options: ["function add(a, b):", "def add(a, b):", "define add(a, b):", "func add(a, b):"],
    correct: 1,
    solution: { answer: "def add(a, b):", explanation: "Python uses the `def` keyword to define functions, followed by the name, parameters in parentheses, and a colon. The body is indented below.", concepts: ["functions", "def"] },
    tags: ["python", "functions"],
  },
  {
    id: "py-b-07", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `[1, 2, 3].append(4)` do?",
    options: ["Creates a new list [1,2,3,4]", "Adds 4 to the beginning", "Adds 4 to the end in-place and returns None", "Returns [1,2,3,4]"],
    correct: 2,
    solution: { answer: "Adds 4 to the end in-place and returns None", explanation: "`append()` mutates the list in place — it modifies the original list and returns None, not the new list. This is a common mistake: `new_list = lst.append(4)` will set new_list to None.", concepts: ["lists", "mutation", "append"] },
    tags: ["python", "list"],
  },
  {
    id: "py-b-08", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the result of `bool(0)` in Python?",
    options: ["True", "False", "0", "Error"],
    correct: 1,
    solution: { answer: "False", explanation: "In Python, 0 is falsy. `bool(0)` returns False. Falsy values include: 0, 0.0, '', [], {}, None, set(). Everything else is truthy.", concepts: ["booleans", "truthy/falsy"] },
    tags: ["python", "bool"],
  },
  {
    id: "py-b-09", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "Which method converts a string to all uppercase?",
    options: [".upper()", ".toUpper()", ".capitalize()", ".UP()"],
    correct: 0,
    solution: { answer: ".upper()", explanation: "`.upper()` converts all characters to uppercase. `.capitalize()` only capitalises the first letter. `.toUpper()` and `.UP()` don't exist in Python.", concepts: ["strings", "methods"] },
    tags: ["python", "strings"],
  },
  {
    id: "py-b-10", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the output of `'hello'[1]`?",
    options: ["h", "e", "hello", "Error"],
    correct: 1,
    solution: { answer: "e", explanation: "Python strings are zero-indexed. Index 0 = 'h', index 1 = 'e', index 2 = 'l', etc. Strings are sequences so you access individual characters with square bracket notation.", concepts: ["strings", "indexing"] },
    tags: ["python", "strings"],
  },
  {
    id: "py-b-11", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "How do you get input from the user in Python?",
    options: ["get()", "scan()", "input()", "read()"],
    correct: 2,
    solution: { answer: "input()", explanation: "`input()` reads a line from standard input and returns it as a string. Always returns a string — use `int()` or `float()` to convert: `age = int(input('Age: '))`", concepts: ["input", "user interaction"] },
    tags: ["python", "io"],
  },
  {
    id: "py-b-12", subject: "Python", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `range(1, 6)` produce?",
    options: ["[1, 2, 3, 4, 5, 6]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4, 5]", "[1, 6]"],
    correct: 1,
    solution: { answer: "[1, 2, 3, 4, 5]", explanation: "`range(start, stop)` produces numbers from start up to but NOT including stop. So `range(1, 6)` gives 1, 2, 3, 4, 5. Think of it as: start ≤ x < stop.", concepts: ["range", "loops"] },
    tags: ["python", "range"],
  },
  {
    id: "py-b-c01", subject: "Python", difficulty: "beginner", type: "code", points: 5,
    question: "Write a function `is_even(n)` that returns True if n is even, False otherwise.",
    starter_code: `def is_even(n):
    # Your code here
    pass

print(is_even(4))   # True
print(is_even(7))   # False
print(is_even(0))   # True`,
    hint: "Use the modulo operator %. A number is even if n % 2 == 0",
    solution: {
      answer: `def is_even(n):
    return n % 2 == 0`,
      explanation: "The modulo operator `%` returns the remainder of division. If n % 2 equals 0, the number is divisible by 2 and therefore even. We directly return the boolean expression `n % 2 == 0` rather than writing an if/else.",
      concepts: ["functions", "modulo", "boolean expressions"],
    },
    tags: ["python", "functions", "modulo"],
  },
  {
    id: "py-b-c02", subject: "Python", difficulty: "beginner", type: "code", points: 5,
    question: "Write a function `sum_list(lst)` that returns the sum of all numbers in a list without using the `sum()` built-in.",
    starter_code: `def sum_list(lst):
    # Your code here
    pass

print(sum_list([1, 2, 3, 4, 5]))  # 15
print(sum_list([]))                 # 0
print(sum_list([10, -5, 3]))       # 8`,
    hint: "Use a loop and accumulate a running total starting at 0",
    solution: {
      answer: `def sum_list(lst):
    total = 0
    for num in lst:
        total += num
    return total`,
      explanation: "We initialise a `total` variable to 0, then loop through each element adding it to total. The empty list case is handled naturally — the loop doesn't execute and we return 0.",
      concepts: ["loops", "accumulator pattern", "for loops"],
    },
    tags: ["python", "loops"],
  },
  {
    id: "py-b-c03", subject: "Python", difficulty: "beginner", type: "code", points: 6,
    question: "Write a function `reverse_string(s)` that returns the string reversed, without using slicing or reversed().",
    starter_code: `def reverse_string(s):
    # Your code here
    pass

print(reverse_string("hello"))  # "olleh"
print(reverse_string("DAQS"))   # "SQAD"
print(reverse_string(""))       # ""`,
    hint: "Build the result by looping through the string and prepending each character",
    solution: {
      answer: `def reverse_string(s):
    result = ""
    for char in s:
        result = char + result
    return result`,
      explanation: "We loop through each character and prepend it to the result. Note: the Pythonic way is `s[::-1]` (reverse slice) but building it manually demonstrates loop logic. You could also use `result += char` in the wrong order — prepending char before result is key.",
      concepts: ["strings", "loops", "string concatenation"],
    },
    tags: ["python", "strings", "loops"],
  },

  // ─── PYTHON INTERMEDIATE ──────────────────────────────────────────────────
  {
    id: "py-i-01", subject: "Python", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What is the difference between a list and a tuple in Python?",
    options: [
      "Lists are ordered, tuples are not",
      "Lists are mutable, tuples are immutable",
      "Tuples can hold more elements",
      "Lists cannot contain strings",
    ],
    correct: 1,
    solution: { answer: "Lists are mutable, tuples are immutable", explanation: "The key difference: lists `[]` can be modified (append, remove, change elements), while tuples `()` cannot be changed after creation. Tuples are therefore faster and can be used as dictionary keys.", concepts: ["mutability", "list vs tuple"] },
    tags: ["python", "data structures"],
  },
  {
    id: "py-i-02", subject: "Python", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What does `*args` do in a Python function definition?",
    options: [
      "Multiplies all arguments",
      "Accepts any number of positional arguments as a tuple",
      "Accepts any number of keyword arguments as a dict",
      "Makes all arguments optional",
    ],
    correct: 1,
    solution: { answer: "Accepts any number of positional arguments as a tuple", explanation: "`*args` collects extra positional arguments into a tuple. `**kwargs` collects keyword arguments into a dict. e.g., `def f(*args): print(args)` called as `f(1,2,3)` prints `(1, 2, 3)`.", concepts: ["*args", "variadic functions"] },
    tags: ["python", "functions"],
  },
  {
    id: "py-i-03", subject: "Python", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What is a list comprehension that produces squares of even numbers from 0 to 9?",
    options: [
      "[x**2 for x in range(10) if x % 2]",
      "[x**2 for x in range(10) if x % 2 == 0]",
      "[x*x if x % 2 == 0 for x in range(10)]",
      "[(x**2) for even x in range(10)]",
    ],
    correct: 1,
    solution: { answer: "[x**2 for x in range(10) if x % 2 == 0]", explanation: "List comprehension syntax: `[expression for item in iterable if condition]`. `x % 2 == 0` filters to even numbers. `x % 2` alone would be truthy for ODD numbers (remainder 1). Result: [0, 4, 16, 36, 64]", concepts: ["list comprehensions", "filtering"] },
    tags: ["python", "comprehensions"],
  },
  {
    id: "py-i-04", subject: "Python", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What does the `@` symbol mean before a function in Python?",
    options: ["It marks a private method", "It's a decorator syntax", "It creates a class method", "It's the matrix multiplication operator"],
    correct: 1,
    solution: { answer: "It's a decorator syntax", explanation: "`@decorator_name` applies a decorator to the function below it. A decorator is a function that wraps another function to modify its behaviour. e.g., `@staticmethod`, `@property`, `@app.route('/home')` in Flask.", concepts: ["decorators", "functions"] },
    tags: ["python", "decorators"],
  },
  {
    id: "py-i-05", subject: "Python", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What is the output of: `d = {'a': 1, 'b': 2}; d.get('c', 0)`?",
    options: ["None", "KeyError", "0", "False"],
    correct: 2,
    solution: { answer: "0", explanation: "`dict.get(key, default)` returns the value for key if it exists, otherwise returns the default value. Since 'c' is not in the dict, it returns 0. This avoids a KeyError unlike `d['c']`.", concepts: ["dictionaries", "get method"] },
    tags: ["python", "dict"],
  },
  {
    id: "py-i-06", subject: "Python", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What does `enumerate(['a', 'b', 'c'])` yield?",
    options: [
      "('a', 'b', 'c')",
      "(0, 'a'), (1, 'b'), (2, 'c')",
      "{'a': 0, 'b': 1, 'c': 2}",
      "[0, 1, 2]",
    ],
    correct: 1,
    solution: { answer: "(0, 'a'), (1, 'b'), (2, 'c')", explanation: "`enumerate()` yields (index, value) tuples. Use it instead of `for i in range(len(lst)): item = lst[i]`. Cleaner: `for i, item in enumerate(lst):`. You can set the start: `enumerate(lst, start=1)`.", concepts: ["enumerate", "loops", "tuples"] },
    tags: ["python", "builtins"],
  },
  {
    id: "py-i-07", subject: "Python", difficulty: "intermediate", type: "short_answer", points: 5,
    question: "Explain the difference between `deepcopy` and shallow copy in Python. When would you use `deepcopy`?",
    hint: "Think about what happens when you copy a list of lists.",
    solution: {
      answer: "A shallow copy creates a new object but references the same nested objects. A deep copy creates completely independent copies of all nested objects. Use deepcopy when you have nested mutable objects (lists of lists, dicts of dicts) and don't want changes to the copy affecting the original.",
      explanation: "Example: `a = [[1,2],[3,4]]; b = a.copy()` (shallow) — if you do `b[0].append(5)`, `a[0]` also changes because both share the same inner list. `copy.deepcopy(a)` creates fully independent copies at all levels.",
      concepts: ["copying", "references", "mutable objects"],
    },
    tags: ["python", "memory", "copy"],
  },
  {
    id: "py-i-c01", subject: "Python", difficulty: "intermediate", type: "code", points: 8,
    question: "Write a function `word_frequency(text)` that takes a string and returns a dictionary with each word as a key and its frequency as the value. Words should be lowercased and punctuation stripped.",
    starter_code: `def word_frequency(text):
    # Your code here
    pass

result = word_frequency("Hello world hello Python world world")
print(result)  # {'hello': 2, 'world': 3, 'python': 1}`,
    hint: "Split the string into words, lowercase them, and use a dict to count.",
    solution: {
      answer: `def word_frequency(text):
    words = text.lower().split()
    freq = {}
    for word in words:
        word = word.strip('.,!?;:"\\'')
        freq[word] = freq.get(word, 0) + 1
    return freq`,
      explanation: "1. Convert to lowercase for case-insensitive counting. 2. Split on whitespace. 3. Strip common punctuation. 4. Use `dict.get(key, 0)` to safely increment — if key doesn't exist yet, default to 0 then add 1. This is more Pythonic than checking `if word in freq` first.",
      concepts: ["dictionaries", "string methods", "counting patterns"],
    },
    tags: ["python", "dict", "strings"],
  },
  {
    id: "py-i-c02", subject: "Python", difficulty: "intermediate", type: "code", points: 8,
    question: "Write a function `flatten(nested)` that takes a nested list (up to 2 levels deep) and returns a single flat list.",
    starter_code: `def flatten(nested):
    # Your code here
    pass

print(flatten([[1, 2], [3, 4], [5]]))        # [1, 2, 3, 4, 5]
print(flatten([[1, [2, 3]], [4], [5, 6]]))   # [1, 2, 3, 4, 5, 6]
print(flatten([]))                            # []`,
    hint: "Check if each element is a list using isinstance(). If so, iterate through it.",
    solution: {
      answer: `def flatten(nested):
    result = []
    for item in nested:
        if isinstance(item, list):
            for sub in item:
                if isinstance(sub, list):
                    result.extend(sub)
                else:
                    result.append(sub)
        else:
            result.append(item)
    return result`,
      explanation: "We iterate through the outer list. If an element is a list, we iterate through it too. `isinstance(item, list)` checks the type. For fully arbitrary depth, you'd use recursion. `extend()` adds all elements of an iterable, `append()` adds a single element.",
      concepts: ["nested lists", "isinstance", "extend vs append"],
    },
    tags: ["python", "lists", "nested"],
  },
  {
    id: "py-i-c03", subject: "Python", difficulty: "intermediate", type: "code", points: 8,
    question: "Write a decorator `timer` that measures and prints how long a function takes to execute.",
    starter_code: `import time

def timer(func):
    # Your decorator here
    pass

@timer
def slow_function():
    time.sleep(0.1)
    return "done"

slow_function()  # Should print: "slow_function took X.XXX seconds"`,
    hint: "A decorator is a function that returns a wrapper function. Use time.time() before and after calling func.",
    solution: {
      answer: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.3f} seconds")
        return result
    return wrapper`,
      explanation: "A decorator takes a function and returns a new function (wrapper) that adds behaviour. `*args, **kwargs` ensures the wrapper can handle any arguments the original function accepts. We record time before and after calling `func`, then return the original result so the function still works normally.",
      concepts: ["decorators", "closures", "time module"],
    },
    tags: ["python", "decorators", "advanced"],
  },

  // ─── PYTHON ADVANCED ──────────────────────────────────────────────────────
  {
    id: "py-a-01", subject: "Python", difficulty: "advanced", type: "mcq", points: 4,
    question: "What is a generator in Python and what makes it memory-efficient?",
    options: [
      "A function that returns a list",
      "A function that yields values one at a time and pauses execution between yields",
      "A class that generates random numbers",
      "A built-in that generates sequences",
    ],
    correct: 1,
    solution: { answer: "A function that yields values one at a time and pauses execution between yields", explanation: "Generators use `yield` instead of `return`. They produce values lazily — one at a time on demand — so they never load the entire sequence into memory. `range()` is generator-like. Use when processing large datasets.", concepts: ["generators", "yield", "lazy evaluation"] },
    tags: ["python", "generators"],
  },
  {
    id: "py-a-02", subject: "Python", difficulty: "advanced", type: "mcq", points: 4,
    question: "What is the output of: `x = [1,2,3]; y = x; y.append(4); print(x)`?",
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "Error", "[4]"],
    correct: 1,
    solution: { answer: "[1, 2, 3, 4]", explanation: "`y = x` doesn't copy the list — it creates another reference to the SAME list object. Both `x` and `y` point to the same memory. Modifying `y` modifies `x`. To copy: `y = x.copy()` or `y = x[:]` or `y = list(x)`.", concepts: ["references", "mutability", "aliasing"] },
    tags: ["python", "memory", "references"],
  },
  {
    id: "py-a-c01", subject: "Python", difficulty: "advanced", type: "code", points: 10,
    question: "Implement a generator function `fibonacci()` that yields Fibonacci numbers indefinitely. Then write code to get the first 10 Fibonacci numbers.",
    starter_code: `def fibonacci():
    # Your generator here
    pass

# Get first 10 Fibonacci numbers
from itertools import islice
result = list(islice(fibonacci(), 10))
print(result)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
    hint: "Use yield and maintain two variables for the current and next value. The loop runs forever — that's OK for generators.",
    solution: {
      answer: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
result = list(islice(fibonacci(), 10))
print(result)`,
      explanation: "The generator maintains state between yields using two variables `a` and `b`. `while True` runs forever but the generator pauses at each `yield`. `islice` from itertools safely takes only N values from an infinite generator. The simultaneous assignment `a, b = b, a + b` is a clean Pythonic swap.",
      concepts: ["generators", "yield", "infinite sequences", "itertools"],
    },
    tags: ["python", "generators", "fibonacci"],
  },
  {
    id: "py-a-c02", subject: "Python", difficulty: "advanced", type: "code", points: 10,
    question: "Write a function `memoize(func)` that caches the results of function calls and returns cached results for repeated calls with the same arguments.",
    starter_code: `def memoize(func):
    # Your implementation here
    pass

@memoize
def expensive(n):
    print(f"Computing {n}...")
    return n * n

print(expensive(5))  # Computing 5... then 25
print(expensive(5))  # Just 25 (cached, no "Computing" print)
print(expensive(3))  # Computing 3... then 9`,
    hint: "Use a dictionary as a cache. The key should be the function arguments.",
    solution: {
      answer: `def memoize(func):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper`,
      explanation: "We use a dictionary `cache` in the closure. The key is `args` (a tuple, which is hashable). If the args are already in cache, return the cached value; otherwise compute and store it. This is essentially what `@functools.lru_cache` does under the hood.",
      concepts: ["memoization", "closures", "caching", "dynamic programming"],
    },
    tags: ["python", "memoization", "closures"],
  },
  {
    id: "py-a-c03", subject: "Python", difficulty: "advanced", type: "code", points: 12,
    question: "Implement a `Stack` class using a list that supports: `push(item)`, `pop()`, `peek()` (return top without removing), `is_empty()`, and `size()`. Include proper error handling.",
    starter_code: `class Stack:
    # Your implementation here
    pass

s = Stack()
s.push(1); s.push(2); s.push(3)
print(s.peek())     # 3
print(s.pop())      # 3
print(s.size())     # 2
print(s.is_empty()) # False
s.pop(); s.pop()
print(s.is_empty()) # True
s.pop()             # Should raise IndexError: "Stack is empty"`,
    hint: "Use self._data = [] internally. peek() looks at index -1. pop() on empty list should raise IndexError.",
    solution: {
      answer: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):
        self._data.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data[-1]

    def is_empty(self):
        return len(self._data) == 0

    def size(self):
        return len(self._data)`,
      explanation: "A Stack follows LIFO (Last In, First Out). We use Python's list as the underlying storage — `append()` adds to the end (push) and `pop()` removes from the end. `_data` with underscore indicates a private attribute. Error handling prevents operations on empty stacks, which would otherwise give confusing errors.",
      concepts: ["OOP", "classes", "data structures", "Stack", "error handling"],
    },
    tags: ["python", "OOP", "data structures"],
  },

  // ─── WEB DEVELOPMENT BEGINNER ─────────────────────────────────────────────
  {
    id: "web-b-01", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does HTML stand for?",
    options: ["Hyperlinks and Text Markup Language", "HyperText Markup Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"],
    correct: 1,
    solution: { answer: "HyperText Markup Language", explanation: "HTML (HyperText Markup Language) is the standard language for creating web pages. 'HyperText' refers to text that contains links to other texts/pages. 'Markup Language' means it uses tags to define structure.", concepts: ["HTML basics"] },
    tags: ["web", "html"],
  },
  {
    id: "web-b-02", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "Which CSS property is used to change the background colour?",
    options: ["background-color", "color", "bg-color", "background"],
    correct: 0,
    solution: { answer: "background-color", explanation: "`background-color` sets the background color. `color` sets the text/foreground color. `background` is a shorthand property that can set background-color AND other properties like background-image.", concepts: ["CSS", "properties"] },
    tags: ["web", "css"],
  },
  {
    id: "web-b-03", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "Which HTML tag is used for the LARGEST heading?",
    options: ["<heading>", "<h6>", "<h1>", "<head>"],
    correct: 2,
    solution: { answer: "<h1>", explanation: "HTML headings go from `<h1>` (largest/most important) to `<h6>` (smallest/least important). `<h1>` should be used once per page for the main title. `<head>` is the document head section, not a visible heading.", concepts: ["HTML", "headings", "semantic markup"] },
    tags: ["web", "html"],
  },
  {
    id: "web-b-04", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "How do you add a comment in JavaScript?",
    options: ["<!-- comment -->", "// comment OR /* comment */", "# comment", "** comment **"],
    correct: 1,
    solution: { answer: "// comment OR /* comment */", explanation: "JavaScript uses `//` for single-line comments and `/* ... */` for multi-line comments. HTML uses `<!-- -->` for comments. Python uses `#` for comments. These are language-specific and not interchangeable.", concepts: ["JavaScript", "comments", "syntax"] },
    tags: ["web", "javascript"],
  },
  {
    id: "web-b-05", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the purpose of the `<div>` element in HTML?",
    options: [
      "It divides the page into two columns",
      "It's a generic block-level container with no semantic meaning",
      "It displays data in a table",
      "It creates a divider line",
    ],
    correct: 1,
    solution: { answer: "It's a generic block-level container with no semantic meaning", explanation: "`<div>` is a block-level container for grouping content. It has no semantic meaning (unlike `<article>`, `<section>`, `<nav>`). Use semantic tags when possible for better accessibility and SEO.", concepts: ["HTML", "block elements", "semantic markup"] },
    tags: ["web", "html"],
  },
  {
    id: "web-b-06", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "Which CSS property controls the space INSIDE an element's border?",
    options: ["margin", "padding", "border-spacing", "gap"],
    correct: 1,
    solution: { answer: "padding", explanation: "Padding = space INSIDE the border (between content and border). Margin = space OUTSIDE the border (between elements). Think: P-A-D-D-I-N-G = the stuffing inside a box. The CSS box model: content → padding → border → margin.", concepts: ["CSS box model", "padding", "margin"] },
    tags: ["web", "css"],
  },
  {
    id: "web-b-07", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `document.getElementById('myDiv')` do in JavaScript?",
    options: [
      "Creates a new div with id 'myDiv'",
      "Deletes an element",
      "Returns the DOM element with id 'myDiv'",
      "Changes the id of an element",
    ],
    correct: 2,
    solution: { answer: "Returns the DOM element with id 'myDiv'", explanation: "`getElementById()` searches the DOM tree and returns the element with the matching id attribute. If not found, returns null. IDs must be unique per page. This is how JavaScript interacts with HTML elements.", concepts: ["DOM", "JavaScript", "getElementById"] },
    tags: ["web", "javascript", "dom"],
  },
  {
    id: "web-b-08", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the correct HTML for creating a hyperlink?",
    options: [
      "<link href='url'>text</link>",
      "<a href='url'>text</a>",
      "<url>text</url>",
      "<hyperlink='url'>text</hyperlink>",
    ],
    correct: 1,
    solution: { answer: "<a href='url'>text</a>", explanation: "The `<a>` (anchor) tag creates hyperlinks. The `href` attribute specifies the destination URL. The text between the tags is what's clickable. Add `target='_blank'` to open in a new tab.", concepts: ["HTML", "anchor", "links"] },
    tags: ["web", "html"],
  },
  {
    id: "web-b-09", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `display: flex` do in CSS?",
    options: [
      "Makes the element invisible",
      "Makes the element flexible in size",
      "Enables Flexbox layout on a container",
      "Makes text flexible",
    ],
    correct: 2,
    solution: { answer: "Enables Flexbox layout on a container", explanation: "`display: flex` turns an element into a flex container. Its direct children become flex items that can be arranged horizontally or vertically, aligned, and distributed using flex properties like `justify-content`, `align-items`, `flex-direction`.", concepts: ["CSS", "Flexbox", "layout"] },
    tags: ["web", "css", "flexbox"],
  },
  {
    id: "web-b-10", subject: "Web Development", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the output of `console.log(typeof 42)` in JavaScript?",
    options: ["'int'", "'integer'", "'number'", "'float'"],
    correct: 2,
    solution: { answer: "'number'", explanation: "JavaScript has one numeric type: `number` (for both integers and decimals). `typeof` returns a string describing the type. Other common results: `typeof 'hello'` → 'string', `typeof true` → 'boolean', `typeof undefined` → 'undefined', `typeof {}` → 'object'.", concepts: ["JavaScript", "typeof", "types"] },
    tags: ["web", "javascript"],
  },

  // ─── WEB DEV INTERMEDIATE ─────────────────────────────────────────────────
  {
    id: "web-i-01", subject: "Web Development", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What is the difference between `==` and `===` in JavaScript?",
    options: [
      "No difference",
      "`==` checks value only, `===` checks value AND type",
      "`===` is for strings, `==` is for numbers",
      "`==` is slower than `===`",
    ],
    correct: 1,
    solution: { answer: "`==` checks value only, `===` checks value AND type", explanation: "`==` uses type coercion: `'5' == 5` is true. `===` is strict: `'5' === 5` is false. Always prefer `===` to avoid unexpected coercion bugs. `null == undefined` is true but `null === undefined` is false.", concepts: ["JavaScript", "equality", "type coercion"] },
    tags: ["web", "javascript"],
  },
  {
    id: "web-i-02", subject: "Web Development", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What is the purpose of the `async/await` syntax in JavaScript?",
    options: [
      "It makes code run faster",
      "It creates multiple threads",
      "It allows writing asynchronous code in a synchronous-looking style",
      "It prevents callbacks",
    ],
    correct: 2,
    solution: { answer: "It allows writing asynchronous code in a synchronous-looking style", explanation: "`async` marks a function as asynchronous. `await` pauses execution until a Promise resolves. This avoids 'callback hell'. `async` functions always return a Promise. Use `try/catch` for error handling with async/await.", concepts: ["async/await", "Promises", "asynchronous JavaScript"] },
    tags: ["web", "javascript", "async"],
  },
  {
    id: "web-i-c01", subject: "Web Development", difficulty: "intermediate", type: "code", points: 8,
    question: "Write a JavaScript function `fetchUserData(userId)` that fetches user data from `https://jsonplaceholder.typicode.com/users/{userId}` and returns the user's name and email as an object. Handle errors gracefully.",
    starter_code: `async function fetchUserData(userId) {
  // Your code here
}

// Test it:
fetchUserData(1).then(console.log);
// Expected: { name: "Leanne Graham", email: "Sincere@april.biz" }`,
    hint: "Use fetch() with await. Check response.ok before parsing JSON.",
    solution: {
      answer: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }
    const data = await response.json();
    return { name: data.name, email: data.email };
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
    return null;
  }
}`,
      explanation: "1. `async` function allows `await`. 2. Template literal constructs the URL. 3. Always check `response.ok` — a 404 response doesn't throw an error by itself. 4. `await response.json()` parses the response body. 5. Return only needed fields. 6. `try/catch` handles network errors.",
      concepts: ["fetch API", "async/await", "error handling", "REST APIs"],
    },
    tags: ["web", "javascript", "fetch", "async"],
  },
  {
    id: "web-i-c02", subject: "Web Development", difficulty: "intermediate", type: "code", points: 8,
    question: "Write a JavaScript function `debounce(func, delay)` that returns a debounced version of `func` — it only calls `func` after `delay` milliseconds have passed since the last call.",
    starter_code: `function debounce(func, delay) {
  // Your implementation here
}

const search = debounce((query) => {
  console.log('Searching:', query);
}, 300);

search('a');      // No immediate output
search('ab');     // No immediate output
search('abc');    // After 300ms: "Searching: abc"`,
    hint: "Use setTimeout and clearTimeout. Store the timeout ID between calls.",
    solution: {
      answer: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`,
      explanation: "Debouncing prevents a function from firing too often. Each call clears the previous timer and sets a new one. Only if `delay` ms pass without another call does the function execute. Used for search inputs, window resize, button clicks. `apply(this, args)` preserves the calling context.",
      concepts: ["debouncing", "closures", "setTimeout", "performance"],
    },
    tags: ["web", "javascript", "patterns"],
  },

  // ─── DATA SCIENCE BEGINNER ────────────────────────────────────────────────
  {
    id: "ds-b-01", subject: "Data Science", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does a Pandas DataFrame represent?",
    options: [
      "A single column of data",
      "A 2-dimensional tabular data structure with rows and columns",
      "A chart or graph",
      "A database connection",
    ],
    correct: 1,
    solution: { answer: "A 2-dimensional tabular data structure with rows and columns", explanation: "A DataFrame is like a spreadsheet or SQL table — it has rows and named columns. Each column is a Pandas Series. Create one with `pd.DataFrame({'col1': [1,2,3], 'col2': ['a','b','c']})`.", concepts: ["Pandas", "DataFrame", "data structures"] },
    tags: ["data science", "pandas"],
  },
  {
    id: "ds-b-02", subject: "Data Science", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `df.shape` return for a DataFrame?",
    options: ["The column names", "A tuple (rows, columns)", "The data types", "The memory usage"],
    correct: 1,
    solution: { answer: "A tuple (rows, columns)", explanation: "`df.shape` returns `(number_of_rows, number_of_columns)`. e.g., `(1000, 15)` means 1000 rows and 15 columns. Access individually: `df.shape[0]` for rows, `df.shape[1]` for columns.", concepts: ["Pandas", "DataFrame", "shape"] },
    tags: ["data science", "pandas"],
  },
  {
    id: "ds-b-03", subject: "Data Science", difficulty: "beginner", type: "mcq", points: 2,
    question: "In statistics, what does the 'mean' measure?",
    options: ["The most frequent value", "The middle value when sorted", "The average (sum / count)", "The spread of data"],
    correct: 2,
    solution: { answer: "The average (sum / count)", explanation: "Mean = sum of all values ÷ number of values. It's sensitive to outliers. Median (middle value) is more robust to outliers. Mode is the most frequent value. For skewed data, median is often more representative.", concepts: ["statistics", "mean", "descriptive statistics"] },
    tags: ["data science", "statistics"],
  },
  {
    id: "ds-b-04", subject: "Data Science", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `df['column'].isnull().sum()` compute?",
    options: ["The sum of all values", "The number of non-null values", "The number of missing values", "Whether any value is null"],
    correct: 2,
    solution: { answer: "The number of missing values", explanation: "`isnull()` returns a boolean Series (True for NaN/None, False otherwise). `.sum()` counts True values (since True=1). This is how you count missing values in a column. Use `df.isnull().sum()` for all columns at once.", concepts: ["Pandas", "missing data", "isnull"] },
    tags: ["data science", "pandas", "missing data"],
  },
  {
    id: "ds-b-05", subject: "Data Science", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is a 'feature' in machine learning?",
    options: [
      "A bug in the model",
      "An input variable used to make predictions",
      "The output the model predicts",
      "The accuracy of the model",
    ],
    correct: 1,
    solution: { answer: "An input variable used to make predictions", explanation: "Features (also called 'input variables', 'predictors', or 'X') are the independent variables used as input to a ML model. The output being predicted is the 'target', 'label', or 'y'. Feature engineering — creating useful features — is crucial for model performance.", concepts: ["machine learning", "features", "terminology"] },
    tags: ["data science", "ml", "terminology"],
  },
  {
    id: "ds-b-06", subject: "Data Science", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does the NumPy function `np.array([1,2,3]).mean()` return?",
    options: ["1", "3", "2.0", "[1, 2, 3]"],
    correct: 2,
    solution: { answer: "2.0", explanation: "(1+2+3)/3 = 6/3 = 2.0. NumPy returns a float. NumPy arrays support vectorised operations — `.mean()`, `.sum()`, `.std()`, `.min()`, `.max()` all work directly on arrays without loops.", concepts: ["NumPy", "array operations", "mean"] },
    tags: ["data science", "numpy"],
  },
  {
    id: "ds-b-07", subject: "Data Science", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is overfitting in machine learning?",
    options: [
      "When the model is too simple",
      "When the model learns training data too well and fails on new data",
      "When the model trains too slowly",
      "When there isn't enough data",
    ],
    correct: 1,
    solution: { answer: "When the model learns training data too well and fails on new data", explanation: "Overfitting: model memorises training data (high training accuracy) but generalises poorly (low test accuracy). Solutions: more data, regularisation (L1/L2), dropout, cross-validation, simpler model. Underfitting is the opposite — too simple to learn patterns.", concepts: ["overfitting", "generalisation", "bias-variance tradeoff"] },
    tags: ["data science", "ml", "overfitting"],
  },
  {
    id: "ds-b-08", subject: "Data Science", difficulty: "beginner", type: "short_answer", points: 4,
    question: "What is the difference between supervised and unsupervised learning? Give one real-world example of each.",
    hint: "Think about whether the training data has labels (known correct answers) or not.",
    solution: {
      answer: "Supervised learning uses labelled data (input-output pairs) to train a model. Unsupervised learning finds patterns in unlabelled data. Example supervised: email spam detection (emails labelled spam/not spam). Example unsupervised: customer segmentation (grouping customers by behaviour without predefined groups).",
      explanation: "Supervised: you train on (X, y) pairs where y is the known answer. The model learns to map X → y. Unsupervised: you only have X — the model discovers structure, patterns, or clusters on its own. Semi-supervised uses a small amount of labelled data with lots of unlabelled.",
      concepts: ["supervised learning", "unsupervised learning", "labelled data"],
    },
    tags: ["data science", "ml", "fundamentals"],
  },

  // ─── DATA SCIENCE INTERMEDIATE ────────────────────────────────────────────
  {
    id: "ds-i-01", subject: "Data Science", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What does `df.groupby('category')['sales'].sum()` do?",
    options: [
      "Filters rows where category equals sales",
      "Groups rows by category and computes total sales per category",
      "Sorts by category then by sales",
      "Merges two DataFrames",
    ],
    correct: 1,
    solution: { answer: "Groups rows by category and computes total sales per category", explanation: "`groupby()` splits the DataFrame into groups based on a column. Applying `.sum()` aggregates within each group. This is equivalent to SQL's `GROUP BY category`. Other aggregations: `.mean()`, `.count()`, `.agg({'sales': 'sum', 'units': 'mean'})`.", concepts: ["Pandas", "groupby", "aggregation"] },
    tags: ["data science", "pandas", "groupby"],
  },
  {
    id: "ds-i-02", subject: "Data Science", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What is the purpose of train/test split in machine learning?",
    options: [
      "To make training faster",
      "To evaluate how well the model generalises to unseen data",
      "To clean the data",
      "To balance the classes",
    ],
    correct: 1,
    solution: { answer: "To evaluate how well the model generalises to unseen data", explanation: "We train on one subset (80%) and evaluate on another (20%) that the model never saw during training. If test accuracy ≈ train accuracy, the model generalises well. If test accuracy << train accuracy, the model is overfitting. Use `train_test_split` from sklearn.", concepts: ["model evaluation", "train/test split", "generalisation"] },
    tags: ["data science", "ml", "evaluation"],
  },
  {
    id: "ds-i-c01", subject: "Data Science", difficulty: "intermediate", type: "code", points: 8,
    question: "Given a list of student scores, write a function `grade_stats(scores)` that returns a dictionary with: mean, median, standard deviation, min, max, and pass_rate (percentage scoring ≥ 50).",
    starter_code: `import statistics

def grade_stats(scores):
    # Your code here
    pass

print(grade_stats([45, 72, 88, 56, 39, 91, 67, 83, 50, 62]))
# {'mean': 65.3, 'median': 64.5, 'std': 17.6, 'min': 39, 'max': 91, 'pass_rate': 80.0}`,
    hint: "Use the statistics module for mean, median, stdev. Use list comprehension to count passes.",
    solution: {
      answer: `import statistics

def grade_stats(scores):
    if not scores:
        return {}
    passes = sum(1 for s in scores if s >= 50)
    return {
        'mean': round(statistics.mean(scores), 1),
        'median': round(statistics.median(scores), 1),
        'std': round(statistics.stdev(scores), 1),
        'min': min(scores),
        'max': max(scores),
        'pass_rate': round((passes / len(scores)) * 100, 1)
    }`,
      explanation: "Python's `statistics` module provides `mean()`, `median()`, and `stdev()`. We use a generator expression `sum(1 for s in scores if s >= 50)` to count passes efficiently. `round(x, 1)` rounds to 1 decimal place. Always handle the empty list edge case.",
      concepts: ["statistics module", "descriptive statistics", "generator expressions"],
    },
    tags: ["data science", "statistics", "python"],
  },

  // ─── DATA SCIENCE ADVANCED ────────────────────────────────────────────────
  {
    id: "ds-a-01", subject: "Data Science", difficulty: "advanced", type: "mcq", points: 4,
    question: "What is the bias-variance tradeoff?",
    options: [
      "A tradeoff between speed and accuracy",
      "High bias = underfitting, high variance = overfitting; you must balance both for good generalisation",
      "A tradeoff between data size and model size",
      "A tradeoff between training time and test time",
    ],
    correct: 1,
    solution: { answer: "High bias = underfitting, high variance = overfitting; you must balance both for good generalisation", explanation: "Bias: error from wrong assumptions (model too simple). Variance: error from sensitivity to noise (model too complex). Low bias + low variance = ideal. Increasing model complexity reduces bias but increases variance. Regularisation, cross-validation, and ensemble methods help manage this tradeoff.", concepts: ["bias-variance tradeoff", "overfitting", "underfitting"] },
    tags: ["data science", "ml", "theory"],
  },
  {
    id: "ds-a-c01", subject: "Data Science", difficulty: "advanced", type: "code", points: 10,
    question: "Implement k-fold cross-validation from scratch. Write a function `k_fold_split(data, k)` that splits a list into k roughly equal folds, returning a list of (train, test) tuples.",
    starter_code: `def k_fold_split(data, k):
    # Your implementation here
    pass

data = list(range(10))
folds = k_fold_split(data, 5)
for i, (train, test) in enumerate(folds):
    print(f"Fold {i+1}: test={test}, train={train}")
# Fold 1: test=[0, 1], train=[2, 3, 4, 5, 6, 7, 8, 9]
# Fold 2: test=[2, 3], train=[0, 1, 4, 5, 6, 7, 8, 9] ...`,
    hint: "Divide data into k equal chunks. For each fold, that chunk is the test set; the rest is training.",
    solution: {
      answer: `def k_fold_split(data, k):
    n = len(data)
    fold_size = n // k
    folds = []
    for i in range(k):
        start = i * fold_size
        end = start + fold_size if i < k - 1 else n
        test = data[start:end]
        train = data[:start] + data[end:]
        folds.append((train, test))
    return folds`,
      explanation: "We divide data into k chunks using slice indices. For the last fold, we take all remaining items (handles when n is not perfectly divisible by k). The test set is the current chunk; training is everything else concatenated with list addition.",
      concepts: ["cross-validation", "k-fold", "model evaluation", "slicing"],
    },
    tags: ["data science", "ml", "validation"],
  },

  // ─── ALGORITHMS INTERMEDIATE ──────────────────────────────────────────────
  {
    id: "algo-i-01", subject: "Algorithms", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correct: 2,
    solution: { answer: "O(log n)", explanation: "Binary search halves the search space each iteration. Starting with n elements: n → n/2 → n/4 → ... → 1. That's log₂(n) steps. This requires the data to be sorted. For 1 million items, binary search needs at most 20 comparisons vs 1,000,000 for linear search.", concepts: ["binary search", "time complexity", "O(log n)"] },
    tags: ["algorithms", "complexity"],
  },
  {
    id: "algo-i-02", subject: "Algorithms", difficulty: "intermediate", type: "mcq", points: 3,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort O(n²)", "Merge Sort O(n log n)", "Insertion Sort O(n²)", "Selection Sort O(n²)"],
    correct: 1,
    solution: { answer: "Merge Sort O(n log n)", explanation: "Merge Sort and Quick Sort both achieve O(n log n) average case. Merge Sort is stable (preserves order of equal elements) and always O(n log n) even in worst case. Quick Sort has O(n²) worst case but is often faster in practice. O(n log n) is the theoretical best for comparison-based sorting.", concepts: ["sorting", "merge sort", "time complexity"] },
    tags: ["algorithms", "sorting"],
  },
  {
    id: "algo-i-c01", subject: "Algorithms", difficulty: "intermediate", type: "code", points: 8,
    question: "Implement binary search. Write a function `binary_search(arr, target)` that returns the index of target in a sorted array, or -1 if not found.",
    starter_code: `def binary_search(arr, target):
    # Your implementation here
    pass

print(binary_search([1, 3, 5, 7, 9, 11, 13], 7))   # 3
print(binary_search([1, 3, 5, 7, 9, 11, 13], 6))   # -1
print(binary_search([], 5))                          # -1
print(binary_search([5], 5))                         # 0`,
    hint: "Use low and high pointers. The middle index is (low + high) // 2.",
    solution: {
      answer: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      explanation: "Two pointers narrow the search range. `mid = (low + high) // 2` finds the centre. If target matches, return mid. If target is larger, search the right half (low = mid + 1). If smaller, search the left half (high = mid - 1). When low > high, target doesn't exist.",
      concepts: ["binary search", "two pointers", "divide and conquer"],
    },
    tags: ["algorithms", "search", "binary search"],
  },
  {
    id: "algo-i-c02", subject: "Algorithms", difficulty: "intermediate", type: "code", points: 10,
    question: "Implement merge sort. Write a function `merge_sort(arr)` that sorts a list using the divide-and-conquer merge sort algorithm.",
    starter_code: `def merge_sort(arr):
    # Your implementation here
    pass

print(merge_sort([64, 34, 25, 12, 22, 11, 90]))  # [11, 12, 22, 25, 34, 64, 90]
print(merge_sort([]))                              # []
print(merge_sort([1]))                             # [1]
print(merge_sort([3, 1, 2]))                       # [1, 2, 3]`,
    hint: "Base case: lists of 0 or 1 are already sorted. Recursive case: split in half, sort each half, then merge.",
    solution: {
      answer: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      explanation: "Divide: split list in half recursively until lists of size 1. Conquer: merge sorted halves. The merge step uses two pointers comparing the smallest remaining element from each half, always picking the smaller. Time: O(n log n). Space: O(n) for the temporary arrays.",
      concepts: ["merge sort", "divide and conquer", "recursion", "merging"],
    },
    tags: ["algorithms", "sorting", "recursion"],
  },

  // ─── ALGORITHMS ADVANCED ──────────────────────────────────────────────────
  {
    id: "algo-a-c01", subject: "Algorithms", difficulty: "advanced", type: "code", points: 12,
    question: "Implement a function `two_sum(nums, target)` that returns indices of two numbers that add up to target. Assume exactly one solution exists. Solve it in O(n) time.",
    starter_code: `def two_sum(nums, target):
    # Your O(n) solution here
    pass

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
print(two_sum([3, 2, 4], 6))        # [1, 2]
print(two_sum([3, 3], 6))           # [0, 1]`,
    hint: "Use a hash map (dictionary) to store numbers you've seen and their indices.",
    solution: {
      answer: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      explanation: "For each number, we need to find if its complement (target - num) was seen before. A hash map gives O(1) lookup. We store {number: index} as we go. When we find a complement in the map, we've found our pair. The brute force O(n²) approach would check all pairs — this O(n) approach uses extra O(n) space to trade time for space.",
      concepts: ["hash maps", "two sum", "time-space tradeoff", "O(n)"],
    },
    tags: ["algorithms", "hash map", "classic"],
  },
  {
    id: "algo-a-c02", subject: "Algorithms", difficulty: "advanced", type: "code", points: 12,
    question: "Given a string, write a function `longest_palindrome(s)` that finds the longest palindromic substring. A palindrome reads the same forwards and backwards.",
    starter_code: `def longest_palindrome(s):
    # Your implementation here
    pass

print(longest_palindrome("babad"))   # "bab" or "aba"
print(longest_palindrome("cbbd"))    # "bb"
print(longest_palindrome("a"))       # "a"
print(longest_palindrome("racecar")) # "racecar"`,
    hint: "Use the 'expand around centre' approach. For each character, try expanding outward while characters match.",
    solution: {
      answer: `def longest_palindrome(s):
    if not s:
        return ""

    start, end = 0, 0

    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return left + 1, right - 1

    for i in range(len(s)):
        # Odd length palindromes
        l1, r1 = expand(i, i)
        # Even length palindromes
        l2, r2 = expand(i, i + 1)

        if r1 - l1 > end - start:
            start, end = l1, r1
        if r2 - l2 > end - start:
            start, end = l2, r2

    return s[start:end + 1]`,
      explanation: "Expand around centre: for each index, try both odd-length (single centre) and even-length (two centres) palindromes. Expand outward while left/right characters match. Track the longest found. O(n²) time, O(1) space. Dynamic programming can also solve this in O(n²) time/space.",
      concepts: ["palindromes", "expand around centre", "two pointers", "strings"],
    },
    tags: ["algorithms", "strings", "palindrome"],
  },

  // ─── SQL BEGINNER ─────────────────────────────────────────────────────────
  {
    id: "sql-b-01", subject: "SQL", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `SELECT * FROM employees` do?",
    options: [
      "Selects a specific column called *",
      "Selects all columns from the employees table",
      "Counts all employees",
      "Deletes the employees table",
    ],
    correct: 1,
    solution: { answer: "Selects all columns from the employees table", explanation: "`*` is a wildcard that means 'all columns'. In production, avoid `SELECT *` — list specific columns instead for better performance and to avoid unexpected column additions breaking your code.", concepts: ["SQL", "SELECT", "wildcards"] },
    tags: ["sql", "select"],
  },
  {
    id: "sql-b-02", subject: "SQL", difficulty: "beginner", type: "mcq", points: 2,
    question: "Which SQL clause is used to filter rows?",
    options: ["HAVING", "WHERE", "FILTER", "LIMIT"],
    correct: 1,
    solution: { answer: "WHERE", explanation: "`WHERE` filters rows BEFORE grouping. `HAVING` filters groups AFTER `GROUP BY`. `LIMIT` restricts the number of rows returned. `FILTER` is used in window functions in some databases.", concepts: ["SQL", "WHERE", "filtering"] },
    tags: ["sql", "where"],
  },
  {
    id: "sql-b-03", subject: "SQL", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does the `COUNT()` aggregate function do?",
    options: ["Sums all values", "Returns the maximum value", "Counts the number of rows/non-null values", "Averages values"],
    correct: 2,
    solution: { answer: "Counts the number of rows/non-null values", explanation: "`COUNT(*)` counts ALL rows including NULLs. `COUNT(column)` counts only non-NULL values in that column. `COUNT(DISTINCT column)` counts unique non-null values. Common aggregate functions: COUNT, SUM, AVG, MIN, MAX.", concepts: ["SQL", "aggregate functions", "COUNT"] },
    tags: ["sql", "aggregates"],
  },
  {
    id: "sql-b-04", subject: "SQL", difficulty: "beginner", type: "mcq", points: 2,
    question: "What does `ORDER BY salary DESC` do?",
    options: [
      "Sorts by salary ascending",
      "Deletes records by salary",
      "Sorts by salary descending (highest first)",
      "Filters salaries",
    ],
    correct: 2,
    solution: { answer: "Sorts by salary descending (highest first)", explanation: "`ORDER BY column ASC` sorts ascending (A→Z, 1→9, default). `ORDER BY column DESC` sorts descending (Z→A, 9→1). You can sort by multiple columns: `ORDER BY department ASC, salary DESC`.", concepts: ["SQL", "ORDER BY", "sorting"] },
    tags: ["sql", "order by"],
  },
  {
    id: "sql-b-05", subject: "SQL", difficulty: "beginner", type: "mcq", points: 2,
    question: "What type of JOIN returns all rows where there is a match in BOTH tables?",
    options: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"],
    correct: 3,
    solution: { answer: "INNER JOIN", explanation: "INNER JOIN returns only rows with matches in BOTH tables. LEFT JOIN: all rows from left + matched rows from right (unmatched = NULL). RIGHT JOIN: opposite. FULL OUTER JOIN: all rows from both tables. Most common: INNER JOIN and LEFT JOIN.", concepts: ["SQL", "JOIN types", "INNER JOIN"] },
    tags: ["sql", "joins"],
  },
  {
    id: "sql-b-s01", subject: "SQL", difficulty: "beginner", type: "short_answer", points: 4,
    question: "Write a SQL query to find the top 5 highest-paid employees from an `employees` table that has columns: `name`, `department`, `salary`.",
    hint: "Use ORDER BY and LIMIT.",
    solution: {
      answer: "SELECT name, department, salary FROM employees ORDER BY salary DESC LIMIT 5;",
      explanation: "`ORDER BY salary DESC` sorts highest salary first. `LIMIT 5` restricts to 5 rows. For databases without LIMIT (e.g., SQL Server), use `TOP 5`: `SELECT TOP 5 name, department, salary FROM employees ORDER BY salary DESC`.",
      concepts: ["SELECT", "ORDER BY", "LIMIT", "TOP N queries"],
    },
    tags: ["sql", "top n", "order by"],
  },

  // ─── SQL INTERMEDIATE ─────────────────────────────────────────────────────
  {
    id: "sql-i-c01", subject: "SQL", difficulty: "intermediate", type: "code", points: 8,
    question: "Write a SQL query that finds departments with an average salary above 50000. Use tables: `employees(id, name, department_id, salary)` and `departments(id, name)`.",
    starter_code: `-- Write your SQL query here
-- Tables: employees(id, name, department_id, salary)
--         departments(id, name)`,
    hint: "Join the tables, then use GROUP BY and HAVING to filter aggregated results.",
    solution: {
      answer: `SELECT
    d.name AS department_name,
    AVG(e.salary) AS avg_salary,
    COUNT(e.id) AS employee_count
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.id, d.name
HAVING AVG(e.salary) > 50000
ORDER BY avg_salary DESC;`,
      explanation: "1. JOIN links employees to department names. 2. GROUP BY aggregates by department. 3. HAVING (not WHERE) filters AFTER aggregation — you can't use WHERE to filter on AVG() results. 4. We also include COUNT() and ORDER BY for a more useful result set.",
      concepts: ["GROUP BY", "HAVING", "JOIN", "aggregate functions"],
    },
    tags: ["sql", "groupby", "having", "joins"],
  },

  // ─── MATHEMATICS BEGINNER ────────────────────────────────────────────────
  {
    id: "math-b-01", subject: "Mathematics", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the slope of a line passing through points (2, 3) and (6, 11)?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    solution: { answer: "2", explanation: "Slope m = (y₂ - y₁) / (x₂ - x₁) = (11 - 3) / (6 - 2) = 8 / 4 = 2. The slope represents how much y changes for each unit increase in x. A slope of 2 means: for every 1 step right, go 2 steps up.", concepts: ["slope", "linear functions", "coordinate geometry"] },
    tags: ["math", "algebra", "slope"],
  },
  {
    id: "math-b-02", subject: "Mathematics", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is 2⁸ (2 to the power of 8)?",
    options: ["64", "128", "256", "512"],
    correct: 2,
    solution: { answer: "256", explanation: "2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64, 2⁷=128, 2⁸=256. Powers of 2 are fundamental in computing — they represent byte sizes (256 = 2⁸ = values in one byte, i.e., 0-255).", concepts: ["exponents", "powers of 2", "binary"] },
    tags: ["math", "exponents"],
  },
  {
    id: "math-b-03", subject: "Mathematics", difficulty: "beginner", type: "mcq", points: 2,
    question: "If f(x) = 3x + 5, what is f(4)?",
    options: ["12", "16", "17", "20"],
    correct: 2,
    solution: { answer: "17", explanation: "f(4) = 3(4) + 5 = 12 + 5 = 17. Function notation f(x) means: substitute x with the given value and evaluate. Functions are a fundamental concept in both maths and programming.", concepts: ["functions", "substitution", "linear equations"] },
    tags: ["math", "functions"],
  },
  {
    id: "math-b-04", subject: "Mathematics", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the probability of rolling a 6 on a fair die?",
    options: ["1/5", "1/6", "6/1", "1/3"],
    correct: 1,
    solution: { answer: "1/6", explanation: "A fair die has 6 equally likely outcomes (1,2,3,4,5,6). The probability of any one outcome = 1/6 ≈ 0.167 ≈ 16.7%. Probability = favourable outcomes / total outcomes. Basic probability: 0 (impossible) to 1 (certain).", concepts: ["probability", "sample space", "equally likely outcomes"] },
    tags: ["math", "probability"],
  },
  {
    id: "math-b-05", subject: "Mathematics", difficulty: "beginner", type: "mcq", points: 2,
    question: "What is the area of a circle with radius 5? (Use π ≈ 3.14159)",
    options: ["15.71", "31.42", "78.54", "25"],
    correct: 2,
    solution: { answer: "78.54", explanation: "Area = πr² = 3.14159 × 5² = 3.14159 × 25 ≈ 78.54. Remember: Area = πr² (r squared), Circumference = 2πr. A common mistake is confusing radius with diameter (diameter = 2r).", concepts: ["circle", "area", "π"] },
    tags: ["math", "geometry"],
  },

  // ─── MATHEMATICS INTERMEDIATE ─────────────────────────────────────────────
  {
    id: "math-i-01", subject: "Mathematics", difficulty: "intermediate", type: "mcq", points: 3,
    question: "What does a derivative measure in calculus?",
    options: [
      "The area under a curve",
      "The instantaneous rate of change of a function",
      "The maximum value of a function",
      "The sum of a series",
    ],
    correct: 1,
    solution: { answer: "The instantaneous rate of change of a function", explanation: "The derivative f'(x) measures how fast f(x) is changing at point x. Geometrically, it's the slope of the tangent line. In ML, derivatives are used in gradient descent to find the direction to update weights to minimise loss.", concepts: ["calculus", "derivatives", "rate of change"] },
    tags: ["math", "calculus"],
  },
  {
    id: "math-i-02", subject: "Mathematics", difficulty: "intermediate", type: "short_answer", points: 5,
    question: "Explain what a matrix is and describe one operation you can perform with matrices. Why are matrices important in data science and machine learning?",
    hint: "Think about how data is stored in rows and columns, and what operations transform data.",
    solution: {
      answer: "A matrix is a rectangular array of numbers arranged in rows and columns. Matrix multiplication is a key operation that combines two matrices. In ML, data is stored as matrices (samples × features), neural network weights are matrices, and forward passes are matrix multiplications.",
      explanation: "An m×n matrix has m rows and n columns. Key operations: addition (element-wise), multiplication (dot product), transpose (flip rows/cols), inverse. In deep learning, every layer applies a matrix multiplication: output = input_matrix × weight_matrix + bias. NumPy and PyTorch are built around matrix operations.",
      concepts: ["matrices", "linear algebra", "matrix multiplication", "machine learning"],
    },
    tags: ["math", "linear algebra", "ml"],
  },
];

export function getQuestionsBySubjectAndDifficulty(subject: string, difficulty: Difficulty): BankQuestion[] {
  return questionBank.filter((q) => q.subject === subject && q.difficulty === difficulty);
}

export function getRandomQuestions(subject: string, difficulty: Difficulty, count: number): BankQuestion[] {
  const pool = getQuestionsBySubjectAndDifficulty(subject, difficulty);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getQuestionsById(ids: string[]): BankQuestion[] {
  return ids.map((id) => questionBank.find((q) => q.id === id)!).filter(Boolean);
}
