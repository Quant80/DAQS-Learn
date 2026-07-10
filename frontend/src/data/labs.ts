export type LabLanguage = "python" | "javascript" | "sql" | "bash";

export interface LabExercise {
  id: string;
  title: string;
  description: string;
  language: LabLanguage;
  starterCode: string;
  solutionCode: string;
  expectedOutput?: string;
  hints: string[];
}

export interface LabTrack {
  id: string;
  label: string;
  icon: string;
  color: string;
  exercises: LabExercise[];
}

export const labTracks: LabTrack[] = [
  {
    id: "python",
    label: "Python",
    icon: "/Python-Logo.png",
    color: "sky",
    exercises: [
      {
        id: "py-01",
        title: "Hello, DAQS!",
        description: "Print a greeting message and explore Python's basic print function with f-strings.",
        language: "python",
        hints: ["Use f-strings: f\"Hello, {name}!\"", "Variables are declared without types in Python"],
        starterCode: `# Lab 1: Hello, DAQS!
# Modify the name variable and print a personalised greeting

name = "Learner"

# TODO: print "Hello, Learner! Welcome to DAQS Learn."
print()
`,
        solutionCode: `name = "Learner"
print(f"Hello, {name}! Welcome to DAQS Learn.")
`,
        expectedOutput: "Hello, Learner! Welcome to DAQS Learn.",
      },
      {
        id: "py-02",
        title: "FizzBuzz",
        description: "Classic FizzBuzz — print numbers 1–30. For multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', both print 'FizzBuzz'.",
        language: "python",
        hints: ["Use % (modulo) to check divisibility", "Check the combined condition (15) first"],
        starterCode: `# Lab 2: FizzBuzz
# Print numbers 1 to 30
# Multiples of 3 → "Fizz"
# Multiples of 5 → "Buzz"
# Multiples of both → "FizzBuzz"

for i in range(1, 31):
    # TODO: add your conditions here
    print(i)
`,
        solutionCode: `for i in range(1, 31):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
`,
      },
      {
        id: "py-03",
        title: "List Comprehensions",
        description: "Use list comprehensions to filter and transform data — one of Python's most powerful features.",
        language: "python",
        hints: ["Syntax: [expression for item in iterable if condition]", "You can nest comprehensions"],
        starterCode: `# Lab 3: List Comprehensions
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# TODO 1: Create a list of squares of even numbers
squares_of_evens = []

# TODO 2: Create a list of words longer than 4 chars, uppercased
words = ["python", "lab", "data", "science", "ai", "learn"]
long_words = []

print("Squares of evens:", squares_of_evens)
print("Long words:", long_words)
`,
        solutionCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares_of_evens = [x**2 for x in numbers if x % 2 == 0]

words = ["python", "lab", "data", "science", "ai", "learn"]
long_words = [w.upper() for w in words if len(w) > 4]

print("Squares of evens:", squares_of_evens)
print("Long words:", long_words)
`,
      },
      {
        id: "py-04",
        title: "Fibonacci Generator",
        description: "Write a generator function that yields Fibonacci numbers, demonstrating Python's lazy evaluation.",
        language: "python",
        hints: ["Use the 'yield' keyword instead of 'return'", "Generators are memory-efficient — they produce values one at a time"],
        starterCode: `# Lab 4: Fibonacci Generator
def fibonacci(n):
    """Yield the first n Fibonacci numbers."""
    # TODO: implement using yield
    pass

# Print the first 10 Fibonacci numbers
for num in fibonacci(10):
    print(num, end=" ")
print()
`,
        solutionCode: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num, end=" ")
print()
`,
        expectedOutput: "0 1 1 2 3 5 8 13 21 34",
      },
    ],
  },

  {
    id: "data-science",
    label: "Data Science",
    icon: "📊",
    color: "violet",
    exercises: [
      {
        id: "ds-01",
        title: "NumPy Array Operations",
        description: "Create and manipulate NumPy arrays — the foundation of all data science in Python.",
        language: "python",
        hints: ["np.array() creates an array", "Arrays support element-wise operations by default"],
        starterCode: `# Lab 1: NumPy Basics
import numpy as np

# TODO 1: Create a 1D array of numbers 1–10
arr = np.array([])

# TODO 2: Compute the mean, std, min, max
print("Mean:", )
print("Std:", )
print("Min:", )
print("Max:", )

# TODO 3: Create a 3x3 identity matrix
identity =

print("\\nIdentity matrix:\\n", identity)
`,
        solutionCode: `import numpy as np

arr = np.arange(1, 11)

print("Mean:", arr.mean())
print("Std:", arr.std())
print("Min:", arr.min())
print("Max:", arr.max())

identity = np.eye(3)
print("\\nIdentity matrix:\\n", identity)
`,
      },
      {
        id: "ds-02",
        title: "Descriptive Statistics",
        description: "Calculate key statistics from a dataset and identify outliers using the IQR method.",
        language: "python",
        hints: ["np.percentile(data, 25) gives Q1", "IQR = Q3 - Q1; outliers are below Q1-1.5*IQR or above Q3+1.5*IQR"],
        starterCode: `# Lab 2: Descriptive Statistics
import numpy as np

data = [14, 18, 11, 13, 6, 8, 2, 1, 4, 99, 12, 15, 13, 16, 18, 19, 3, 15, 17, 13]
data = np.array(data)

# TODO: Calculate Q1, Q3, IQR
Q1 =
Q3 =
IQR =

# TODO: Find outliers
lower_bound =
upper_bound =
outliers = data[]

print(f"Q1: {Q1}, Q3: {Q3}, IQR: {IQR}")
print(f"Bounds: [{lower_bound:.1f}, {upper_bound:.1f}]")
print(f"Outliers: {outliers}")
`,
        solutionCode: `import numpy as np

data = np.array([14, 18, 11, 13, 6, 8, 2, 1, 4, 99, 12, 15, 13, 16, 18, 19, 3, 15, 17, 13])

Q1 = np.percentile(data, 25)
Q3 = np.percentile(data, 75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
outliers = data[(data < lower_bound) | (data > upper_bound)]

print(f"Q1: {Q1}, Q3: {Q3}, IQR: {IQR}")
print(f"Bounds: [{lower_bound:.1f}, {upper_bound:.1f}]")
print(f"Outliers: {outliers}")
`,
      },
      {
        id: "ds-03",
        title: "Data Cleaning",
        description: "Clean a messy dataset: handle missing values, remove duplicates, fix data types.",
        language: "python",
        hints: ["Use a dict of lists to simulate a DataFrame without pandas", "Filter with list comprehensions"],
        starterCode: `# Lab 3: Data Cleaning (without pandas — pure Python)
# Simulate a messy dataset
records = [
    {"name": "Alice",   "age": "29",  "score": "88.5"},
    {"name": "Bob",     "age": None,  "score": "72.0"},
    {"name": "Charlie", "age": "35",  "score": None},
    {"name": "Alice",   "age": "29",  "score": "88.5"},  # duplicate
    {"name": "Diana",   "age": "abc", "score": "91.0"},  # bad age
    {"name": "Eve",     "age": "27",  "score": "85.5"},
]

# TODO 1: Remove duplicates
# TODO 2: Drop rows with None values
# TODO 3: Convert age to int (drop rows where conversion fails)
# TODO 4: Convert score to float

cleaned = []
# ... your code here ...

print(f"Original: {len(records)} rows")
print(f"Cleaned:  {len(cleaned)} rows")
for r in cleaned:
    print(r)
`,
        solutionCode: `records = [
    {"name": "Alice",   "age": "29",  "score": "88.5"},
    {"name": "Bob",     "age": None,  "score": "72.0"},
    {"name": "Charlie", "age": "35",  "score": None},
    {"name": "Alice",   "age": "29",  "score": "88.5"},
    {"name": "Diana",   "age": "abc", "score": "91.0"},
    {"name": "Eve",     "age": "27",  "score": "85.5"},
]

seen = set()
cleaned = []
for r in records:
    if None in r.values():
        continue
    key = (r["name"], r["age"])
    if key in seen:
        continue
    seen.add(key)
    try:
        age = int(r["age"])
        score = float(r["score"])
        cleaned.append({"name": r["name"], "age": age, "score": score})
    except ValueError:
        continue

print(f"Original: {len(records)} rows")
print(f"Cleaned:  {len(cleaned)} rows")
for r in cleaned:
    print(r)
`,
      },
    ],
  },

  {
    id: "machine-learning",
    label: "Machine Learning",
    icon: "🤖",
    color: "amber",
    exercises: [
      {
        id: "ml-01",
        title: "Linear Regression from Scratch",
        description: "Implement gradient descent to fit a linear regression model — no libraries.",
        language: "python",
        hints: ["Loss = mean((y_pred - y_true)²)", "Gradient w.r.t. w: mean(2*(y_pred-y)*x)", "Update: w = w - lr * gradient"],
        starterCode: `# Lab 1: Linear Regression from Scratch
import numpy as np

# Generate synthetic data: y = 2x + 1 + noise
np.random.seed(42)
X = np.linspace(0, 10, 100)
y = 2 * X + 1 + np.random.randn(100) * 1.5

# Initialise parameters
w, b = 0.0, 0.0
lr = 0.001
epochs = 1000

for epoch in range(epochs):
    y_pred = w * X + b

    # TODO: compute gradients dw and db
    dw =
    db =

    # TODO: update parameters
    w -=
    b -=

    if epoch % 200 == 0:
        loss = np.mean((y_pred - y) ** 2)
        print(f"Epoch {epoch:4d} | Loss: {loss:.4f} | w={w:.3f} b={b:.3f}")

print(f"\\nFinal: w={w:.3f} (true=2.0), b={b:.3f} (true=1.0)")
`,
        solutionCode: `import numpy as np

np.random.seed(42)
X = np.linspace(0, 10, 100)
y = 2 * X + 1 + np.random.randn(100) * 1.5

w, b = 0.0, 0.0
lr = 0.001
epochs = 1000

for epoch in range(epochs):
    y_pred = w * X + b
    dw = np.mean(2 * (y_pred - y) * X)
    db = np.mean(2 * (y_pred - y))
    w -= lr * dw
    b -= lr * db

    if epoch % 200 == 0:
        loss = np.mean((y_pred - y) ** 2)
        print(f"Epoch {epoch:4d} | Loss: {loss:.4f} | w={w:.3f} b={b:.3f}")

print(f"\\nFinal: w={w:.3f} (true=2.0), b={b:.3f} (true=1.0)")
`,
      },
      {
        id: "ml-02",
        title: "K-Nearest Neighbours",
        description: "Implement KNN classification from scratch using Euclidean distance.",
        language: "python",
        hints: ["Distance = sqrt(sum((x1-x2)²))", "Find the K closest training points", "Return the most common class among neighbours"],
        starterCode: `# Lab 2: K-Nearest Neighbours from Scratch
import numpy as np
from collections import Counter

def euclidean_distance(a, b):
    # TODO: compute Euclidean distance between vectors a and b
    pass

def knn_predict(X_train, y_train, x_test, k=3):
    # TODO: compute distances to all training points
    # TODO: get k nearest labels
    # TODO: return most common label
    pass

# Simple 2D dataset (not linearly separable)
X_train = np.array([[1,2],[2,3],[3,1],[6,5],[7,7],[8,6]])
y_train = np.array([0, 0, 0, 1, 1, 1])

test_points = np.array([[2,2], [7,6], [4,4]])
for pt in test_points:
    pred = knn_predict(X_train, y_train, pt, k=3)
    print(f"Point {pt} → Class {pred}")
`,
        solutionCode: `import numpy as np
from collections import Counter

def euclidean_distance(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def knn_predict(X_train, y_train, x_test, k=3):
    distances = [euclidean_distance(x_test, x) for x in X_train]
    k_indices = np.argsort(distances)[:k]
    k_labels = [y_train[i] for i in k_indices]
    return Counter(k_labels).most_common(1)[0][0]

X_train = np.array([[1,2],[2,3],[3,1],[6,5],[7,7],[8,6]])
y_train = np.array([0, 0, 0, 1, 1, 1])

test_points = np.array([[2,2], [7,6], [4,4]])
for pt in test_points:
    pred = knn_predict(X_train, y_train, pt, k=3)
    print(f"Point {pt} → Class {pred}")
`,
      },
    ],
  },

  {
    id: "mathematics",
    label: "Mathematics",
    icon: "🔢",
    color: "indigo",
    exercises: [
      {
        id: "math-01",
        title: "Matrix Operations",
        description: "Implement matrix multiplication, transpose, and determinant from scratch.",
        language: "python",
        hints: ["Matrix multiply: C[i][j] = sum(A[i][k] * B[k][j])", "Transpose: swap rows and columns"],
        starterCode: `# Lab 1: Matrix Operations from Scratch
def mat_multiply(A, B):
    """Multiply two matrices A (m×n) and B (n×p) → C (m×p)."""
    m, n = len(A), len(A[0])
    p = len(B[0])
    # TODO: implement
    C = [[0]*p for _ in range(m)]
    return C

def transpose(A):
    """Return the transpose of matrix A."""
    # TODO: implement
    pass

A = [[1, 2], [3, 4], [5, 6]]   # 3×2
B = [[7, 8, 9], [10, 11, 12]]  # 2×3

C = mat_multiply(A, B)
print("A × B =")
for row in C:
    print(row)

At = transpose(A)
print("\\nTranspose of A =")
for row in At:
    print(row)
`,
        solutionCode: `def mat_multiply(A, B):
    m, n = len(A), len(A[0])
    p = len(B[0])
    C = [[sum(A[i][k] * B[k][j] for k in range(n)) for j in range(p)] for i in range(m)]
    return C

def transpose(A):
    return [[A[i][j] for i in range(len(A))] for j in range(len(A[0]))]

A = [[1, 2], [3, 4], [5, 6]]
B = [[7, 8, 9], [10, 11, 12]]

C = mat_multiply(A, B)
print("A × B =")
for row in C: print(row)

At = transpose(A)
print("\\nTranspose of A =")
for row in At: print(row)
`,
      },
      {
        id: "math-02",
        title: "Numerical Gradient",
        description: "Approximate the gradient of a function numerically — the foundation of backpropagation.",
        language: "python",
        hints: ["f'(x) ≈ (f(x+h) - f(x-h)) / (2h) — central difference", "Use a small h like 1e-5"],
        starterCode: `# Lab 2: Numerical Gradient
import numpy as np

def numerical_gradient(f, x, h=1e-5):
    """Compute gradient of f at point x using central difference."""
    grad = np.zeros_like(x, dtype=float)
    for i in range(len(x)):
        # TODO: compute partial derivative w.r.t. x[i]
        grad[i] = 0
    return grad

# Test function: f(x,y) = x² + 3xy + y²
# Analytical gradient: [2x+3y, 3x+2y]
def f(x):
    return x[0]**2 + 3*x[0]*x[1] + x[1]**2

point = np.array([1.0, 2.0])
numerical = numerical_gradient(f, point)
analytical = np.array([2*point[0] + 3*point[1], 3*point[0] + 2*point[1]])

print(f"Numerical gradient:  {numerical}")
print(f"Analytical gradient: {analytical}")
print(f"Max error: {np.max(np.abs(numerical - analytical)):.2e}")
`,
        solutionCode: `import numpy as np

def numerical_gradient(f, x, h=1e-5):
    grad = np.zeros_like(x, dtype=float)
    for i in range(len(x)):
        x_plus = x.copy(); x_plus[i] += h
        x_minus = x.copy(); x_minus[i] -= h
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * h)
    return grad

def f(x):
    return x[0]**2 + 3*x[0]*x[1] + x[1]**2

point = np.array([1.0, 2.0])
numerical = numerical_gradient(f, point)
analytical = np.array([2*point[0] + 3*point[1], 3*point[0] + 2*point[1]])

print(f"Numerical gradient:  {numerical}")
print(f"Analytical gradient: {analytical}")
print(f"Max error: {np.max(np.abs(numerical - analytical)):.2e}")
`,
      },
    ],
  },

  {
    id: "sql",
    label: "SQL",
    icon: "🗄️",
    color: "emerald",
    exercises: [
      {
        id: "sql-01",
        title: "GROUP BY & Aggregates",
        description: "Query a sales dataset using GROUP BY, COUNT, SUM, AVG and HAVING.",
        language: "python",
        hints: ["Use sqlite3 — it's built into Python", "HAVING filters after aggregation (WHERE filters before)"],
        starterCode: `# Lab 1: SQL with SQLite (built-in — no install needed)
import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.executescript("""
CREATE TABLE sales (
    id INTEGER PRIMARY KEY,
    region TEXT,
    product TEXT,
    amount REAL,
    month INTEGER
);
INSERT INTO sales VALUES
(1,'North','Widget',150.0,1),(2,'South','Widget',200.0,1),
(3,'North','Gadget',300.0,1),(4,'North','Widget',175.0,2),
(5,'South','Gadget',250.0,2),(6,'East','Widget',120.0,1),
(7,'East','Gadget',400.0,2),(8,'South','Widget',180.0,2),
(9,'North','Gadget',320.0,3),(10,'East','Widget',140.0,3);
""")

# TODO 1: Total sales per region, ordered by total descending
print("=== Sales by Region ===")
cur.execute("""
    -- your query here
""")
for row in cur.fetchall():
    print(row)

# TODO 2: Regions with average sale > 200
print("\\n=== High-value regions (avg > 200) ===")
cur.execute("""
    -- your query here
""")
for row in cur.fetchall():
    print(row)

conn.close()
`,
        solutionCode: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.executescript("""
CREATE TABLE sales (
    id INTEGER PRIMARY KEY,
    region TEXT, product TEXT, amount REAL, month INTEGER
);
INSERT INTO sales VALUES
(1,'North','Widget',150.0,1),(2,'South','Widget',200.0,1),
(3,'North','Gadget',300.0,1),(4,'North','Widget',175.0,2),
(5,'South','Gadget',250.0,2),(6,'East','Widget',120.0,1),
(7,'East','Gadget',400.0,2),(8,'South','Widget',180.0,2),
(9,'North','Gadget',320.0,3),(10,'East','Widget',140.0,3);
""")

print("=== Sales by Region ===")
cur.execute("""
    SELECT region, COUNT(*) as txns, ROUND(SUM(amount),2) as total
    FROM sales GROUP BY region ORDER BY total DESC
""")
for row in cur.fetchall(): print(row)

print("\\n=== High-value regions (avg > 200) ===")
cur.execute("""
    SELECT region, ROUND(AVG(amount),2) as avg_sale
    FROM sales GROUP BY region HAVING avg_sale > 200
""")
for row in cur.fetchall(): print(row)

conn.close()
`,
      },
    ],
  },
];

export function getLabTrack(id: string) {
  return labTracks.find((t) => t.id === id);
}

export const colorMap: Record<string, { pill: string; border: string; text: string; bg: string }> = {
  sky:     { pill: "bg-sky-500/15 text-sky-400",    border: "border-sky-500/30",    text: "text-sky-400",    bg: "bg-sky-500/10" },
  violet:  { pill: "bg-violet-500/15 text-violet-400", border: "border-violet-500/30", text: "text-violet-400", bg: "bg-violet-500/10" },
  amber:   { pill: "bg-amber-500/15 text-amber-400",  border: "border-amber-500/30",  text: "text-amber-400",  bg: "bg-amber-500/10" },
  indigo:  { pill: "bg-indigo-500/15 text-indigo-400", border: "border-indigo-500/30", text: "text-indigo-400", bg: "bg-indigo-500/10" },
  emerald: { pill: "bg-emerald-500/15 text-emerald-400", border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/10" },
};
