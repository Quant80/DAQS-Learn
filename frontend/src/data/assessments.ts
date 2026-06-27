export type QuestionType = "mcq" | "short_answer" | "code";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type AssessmentType = "quiz" | "assignment" | "code_challenge";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  options?: string[];
  correct?: number;
  starter_code?: string;
  hint?: string;
}

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  description: string;
  difficulty: Difficulty;
  type: AssessmentType;
  time_limit?: number;
  questions: Question[];
  tags: string[];
}

export const assessments: Assessment[] = [
  {
    id: "python-basics-quiz",
    title: "Python Fundamentals",
    subject: "Programming",
    description: "Test your knowledge of Python basics — variables, data types, loops, and functions.",
    difficulty: "beginner",
    type: "quiz",
    time_limit: 15,
    tags: ["Python", "Beginner", "Syntax"],
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the output of `print(type([1, 2, 3]))`?",
        points: 2,
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'dict'>"],
        correct: 1,
      },
      {
        id: "q2",
        type: "mcq",
        question: "Which keyword is used to define a function in Python?",
        points: 2,
        options: ["function", "func", "def", "lambda"],
        correct: 2,
      },
      {
        id: "q3",
        type: "mcq",
        question: "What does `range(3)` produce?",
        points: 2,
        options: ["[1, 2, 3]", "[0, 1, 2, 3]", "[0, 1, 2]", "[1, 2]"],
        correct: 2,
      },
      {
        id: "q4",
        type: "mcq",
        question: "Which of the following is a valid Python dictionary?",
        points: 2,
        options: [
          '{"name": "Alice", "age": 25}',
          '["name": "Alice", "age": 25]',
          '("name": "Alice")',
          '{"Alice", 25}',
        ],
        correct: 0,
      },
      {
        id: "q5",
        type: "mcq",
        question: "What is the result of `10 % 3` in Python?",
        points: 2,
        options: ["3", "1", "0.33", "3.33"],
        correct: 1,
      },
    ],
  },
  {
    id: "data-science-concepts",
    title: "Data Science Concepts",
    subject: "Data Science",
    description: "Short answer questions on core data science concepts, statistics, and ML fundamentals.",
    difficulty: "intermediate",
    type: "assignment",
    time_limit: 20,
    tags: ["Data Science", "ML", "Statistics"],
    questions: [
      {
        id: "q1",
        type: "short_answer",
        question: "Explain the difference between supervised and unsupervised learning. Give one example of each.",
        points: 5,
        hint: "Think about whether the training data has labels or not.",
      },
      {
        id: "q2",
        type: "short_answer",
        question: "What is overfitting in machine learning and how can you prevent it?",
        points: 5,
        hint: "Consider what happens when a model learns the training data too well.",
      },
      {
        id: "q3",
        type: "short_answer",
        question: "What is the difference between mean, median, and mode? When would you use the median instead of the mean?",
        points: 5,
        hint: "Think about how outliers affect each measure.",
      },
    ],
  },
  {
    id: "python-code-challenge",
    title: "Python Code Challenge",
    subject: "Programming",
    description: "Write Python functions to solve real problems. Your code will be evaluated by our AI.",
    difficulty: "intermediate",
    type: "code_challenge",
    time_limit: 30,
    tags: ["Python", "Algorithms", "Functions"],
    questions: [
      {
        id: "q1",
        type: "code",
        question: "Write a Python function called `find_duplicates(lst)` that takes a list and returns a new list containing only the elements that appear more than once. The result should not contain duplicates.",
        points: 10,
        starter_code: `def find_duplicates(lst):
    # Your code here
    pass

# Test cases
print(find_duplicates([1, 2, 3, 2, 4, 3]))  # Expected: [2, 3]
print(find_duplicates([1, 2, 3]))            # Expected: []
print(find_duplicates([5, 5, 5, 1]))         # Expected: [5]`,
        hint: "Consider using a dictionary or Counter to track element frequency.",
      },
      {
        id: "q2",
        type: "code",
        question: "Write a Python function called `celsius_to_fahrenheit(temps)` that takes a list of temperatures in Celsius and returns a list of temperatures converted to Fahrenheit. Formula: F = (C × 9/5) + 32",
        points: 10,
        starter_code: `def celsius_to_fahrenheit(temps):
    # Your code here (try using a list comprehension!)
    pass

# Test cases
print(celsius_to_fahrenheit([0, 100]))        # Expected: [32.0, 212.0]
print(celsius_to_fahrenheit([37, 20, -40]))   # Expected: [98.6, 68.0, -40.0]`,
        hint: "This is a great use case for a list comprehension.",
      },
    ],
  },
  {
    id: "web-fundamentals",
    title: "Web Development Basics",
    subject: "Web Development",
    description: "MCQ assessment covering HTML, CSS, and JavaScript fundamentals.",
    difficulty: "beginner",
    type: "quiz",
    time_limit: 15,
    tags: ["HTML", "CSS", "JavaScript", "Web"],
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "Which HTML tag is used to link an external CSS file?",
        points: 2,
        options: ["<style>", "<css>", "<link>", "<script>"],
        correct: 2,
      },
      {
        id: "q2",
        type: "mcq",
        question: "What does CSS stand for?",
        points: 2,
        options: [
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Computer Style Sheets",
          "Colorful Style Sheets",
        ],
        correct: 1,
      },
      {
        id: "q3",
        type: "mcq",
        question: "Which JavaScript method adds an element to the end of an array?",
        points: 2,
        options: ["array.add()", "array.push()", "array.append()", "array.insert()"],
        correct: 1,
      },
      {
        id: "q4",
        type: "mcq",
        question: "What is the correct way to declare a variable in modern JavaScript?",
        points: 2,
        options: ["var x = 5", "const x = 5", "int x = 5", "variable x = 5"],
        correct: 1,
      },
      {
        id: "q5",
        type: "mcq",
        question: "Which CSS property changes the text colour?",
        points: 2,
        options: ["text-color", "font-color", "color", "foreground"],
        correct: 2,
      },
    ],
  },
];

export function getAssessment(id: string): Assessment | undefined {
  return assessments.find((a) => a.id === id);
}

export const difficultyColor: Record<Difficulty, string> = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

export const typeIcon: Record<AssessmentType, string> = {
  quiz: "📋",
  assignment: "📝",
  code_challenge: "💻",
};
