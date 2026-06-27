import type { Difficulty } from "./questionBank";

export interface AssessmentTemplate {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: Difficulty;
  questionCount: number;
  timeLimit: number; // minutes
  tags: string[];
  icon: string;
  // Smart recommendation tree
  onPass: string[];    // template IDs to recommend when score >= 80
  onPartial: string[]; // template IDs to recommend when score 50–79
  onFail: string[];    // template IDs to recommend when score < 50
}

export const assessmentTemplates: AssessmentTemplate[] = [
  // ─── PYTHON ──────────────────────────────────────────────────────────────
  {
    id: "python-beginner",
    title: "Python Starter",
    description: "Core Python syntax, variables, loops, and basic functions. Perfect if you are new to programming.",
    subject: "Python",
    difficulty: "beginner",
    questionCount: 8,
    timeLimit: 15,
    tags: ["python", "basics", "beginner"],
    icon: "🐍",
    onPass: ["python-intermediate"],
    onPartial: ["python-beginner"],
    onFail: ["python-beginner"],
  },
  {
    id: "python-intermediate",
    title: "Python Practitioner",
    description: "List comprehensions, decorators, error handling, and OOP fundamentals.",
    subject: "Python",
    difficulty: "intermediate",
    questionCount: 8,
    timeLimit: 20,
    tags: ["python", "intermediate", "oop"],
    icon: "🐍",
    onPass: ["python-advanced", "algorithms-intermediate"],
    onPartial: ["python-intermediate", "python-beginner"],
    onFail: ["python-beginner"],
  },
  {
    id: "python-advanced",
    title: "Python Expert",
    description: "Generators, metaclasses, async programming, memory management, and design patterns.",
    subject: "Python",
    difficulty: "advanced",
    questionCount: 8,
    timeLimit: 30,
    tags: ["python", "advanced", "generators", "async"],
    icon: "🐍",
    onPass: ["algorithms-advanced", "data-science-advanced"],
    onPartial: ["python-advanced", "python-intermediate"],
    onFail: ["python-intermediate"],
  },

  // ─── WEB DEVELOPMENT ─────────────────────────────────────────────────────
  {
    id: "webdev-beginner",
    title: "Web Dev Basics",
    description: "HTML structure, CSS styling, and foundational JavaScript. Build your first web concepts.",
    subject: "Web Development",
    difficulty: "beginner",
    questionCount: 8,
    timeLimit: 15,
    tags: ["html", "css", "javascript", "beginner"],
    icon: "🌐",
    onPass: ["webdev-intermediate"],
    onPartial: ["webdev-beginner"],
    onFail: ["webdev-beginner"],
  },
  {
    id: "webdev-intermediate",
    title: "Web Dev Intermediate",
    description: "DOM manipulation, async JavaScript, fetch API, CSS layouts, and React fundamentals.",
    subject: "Web Development",
    difficulty: "intermediate",
    questionCount: 8,
    timeLimit: 20,
    tags: ["javascript", "dom", "react", "async"],
    icon: "🌐",
    onPass: ["webdev-advanced"],
    onPartial: ["webdev-intermediate", "webdev-beginner"],
    onFail: ["webdev-beginner"],
  },
  {
    id: "webdev-advanced",
    title: "Full Stack Challenge",
    description: "Advanced React patterns, API design, authentication, performance optimisation, and system design.",
    subject: "Web Development",
    difficulty: "advanced",
    questionCount: 8,
    timeLimit: 30,
    tags: ["react", "api", "performance", "system design"],
    icon: "🌐",
    onPass: ["algorithms-advanced"],
    onPartial: ["webdev-advanced", "webdev-intermediate"],
    onFail: ["webdev-intermediate"],
  },

  // ─── DATA SCIENCE ─────────────────────────────────────────────────────────
  {
    id: "data-science-beginner",
    title: "Data Science 101",
    description: "NumPy, Pandas basics, descriptive statistics, and intro to machine learning concepts.",
    subject: "Data Science",
    difficulty: "beginner",
    questionCount: 8,
    timeLimit: 15,
    tags: ["pandas", "numpy", "statistics", "ml basics"],
    icon: "📊",
    onPass: ["data-science-intermediate"],
    onPartial: ["data-science-beginner"],
    onFail: ["data-science-beginner"],
  },
  {
    id: "data-science-intermediate",
    title: "Data Science Deep Dive",
    description: "GroupBy, data cleaning, model evaluation, supervised vs unsupervised learning.",
    subject: "Data Science",
    difficulty: "intermediate",
    questionCount: 8,
    timeLimit: 20,
    tags: ["pandas", "ml", "evaluation", "cleaning"],
    icon: "📊",
    onPass: ["data-science-advanced", "sql-intermediate"],
    onPartial: ["data-science-intermediate", "data-science-beginner"],
    onFail: ["data-science-beginner"],
  },
  {
    id: "data-science-advanced",
    title: "ML & Data Science Pro",
    description: "Cross-validation, bias-variance tradeoff, feature engineering, neural networks, and model deployment.",
    subject: "Data Science",
    difficulty: "advanced",
    questionCount: 8,
    timeLimit: 30,
    tags: ["ml", "deep learning", "feature engineering", "advanced"],
    icon: "📊",
    onPass: ["algorithms-advanced"],
    onPartial: ["data-science-advanced", "data-science-intermediate"],
    onFail: ["data-science-intermediate"],
  },

  // ─── ALGORITHMS ──────────────────────────────────────────────────────────
  {
    id: "algorithms-intermediate",
    title: "Algorithm Design",
    description: "Sorting algorithms, binary search, time complexity, and classic problem-solving patterns.",
    subject: "Algorithms",
    difficulty: "intermediate",
    questionCount: 8,
    timeLimit: 25,
    tags: ["sorting", "search", "complexity", "algorithms"],
    icon: "⚡",
    onPass: ["algorithms-advanced"],
    onPartial: ["algorithms-intermediate", "python-intermediate"],
    onFail: ["python-intermediate"],
  },
  {
    id: "algorithms-advanced",
    title: "Algorithm Mastery",
    description: "Dynamic programming, graph algorithms, advanced data structures, and competitive coding.",
    subject: "Algorithms",
    difficulty: "advanced",
    questionCount: 8,
    timeLimit: 40,
    tags: ["dynamic programming", "graphs", "advanced", "competitive"],
    icon: "⚡",
    onPass: ["algorithms-advanced"],
    onPartial: ["algorithms-advanced", "algorithms-intermediate"],
    onFail: ["algorithms-intermediate"],
  },

  // ─── SQL ─────────────────────────────────────────────────────────────────
  {
    id: "sql-beginner",
    title: "SQL Fundamentals",
    description: "SELECT queries, WHERE clauses, ORDER BY, aggregate functions, and basic JOINs.",
    subject: "SQL",
    difficulty: "beginner",
    questionCount: 8,
    timeLimit: 15,
    tags: ["sql", "select", "joins", "beginner"],
    icon: "🗄️",
    onPass: ["sql-intermediate"],
    onPartial: ["sql-beginner"],
    onFail: ["sql-beginner"],
  },
  {
    id: "sql-intermediate",
    title: "SQL Queries",
    description: "Complex JOINs, subqueries, window functions, GROUP BY with HAVING, and query optimisation.",
    subject: "SQL",
    difficulty: "intermediate",
    questionCount: 8,
    timeLimit: 25,
    tags: ["sql", "window functions", "subqueries", "intermediate"],
    icon: "🗄️",
    onPass: ["data-science-intermediate"],
    onPartial: ["sql-intermediate", "sql-beginner"],
    onFail: ["sql-beginner"],
  },

  // ─── MATHEMATICS ─────────────────────────────────────────────────────────
  {
    id: "math-beginner",
    title: "Maths Foundations",
    description: "Algebra, probability, geometry, and number theory — essential maths for programming and data science.",
    subject: "Mathematics",
    difficulty: "beginner",
    questionCount: 8,
    timeLimit: 15,
    tags: ["algebra", "probability", "geometry", "maths"],
    icon: "🧮",
    onPass: ["math-intermediate"],
    onPartial: ["math-beginner"],
    onFail: ["math-beginner"],
  },
  {
    id: "math-intermediate",
    title: "Maths for Data Science",
    description: "Calculus, linear algebra, statistics, and the mathematical foundations of machine learning.",
    subject: "Mathematics",
    difficulty: "intermediate",
    questionCount: 8,
    timeLimit: 20,
    tags: ["calculus", "linear algebra", "statistics", "ml maths"],
    icon: "🧮",
    onPass: ["data-science-intermediate", "algorithms-intermediate"],
    onPartial: ["math-intermediate", "math-beginner"],
    onFail: ["math-beginner"],
  },
];

export function getTemplate(id: string): AssessmentTemplate | undefined {
  return assessmentTemplates.find((t) => t.id === id);
}

export function getRecommendations(
  templateId: string,
  score: number,
  subjectWeaknesses: string[] = []
): AssessmentTemplate[] {
  const template = getTemplate(templateId);
  if (!template) return [];

  let recommendedIds: string[] =
    score >= 80 ? template.onPass :
    score >= 50 ? template.onPartial :
    template.onFail;

  // Deduplicate and exclude the current assessment if passed
  if (score >= 80) {
    recommendedIds = recommendedIds.filter((id) => id !== templateId);
  }

  // Add weakness-based recommendations
  if (subjectWeaknesses.length && score >= 50) {
    const weaknessRecs = assessmentTemplates.filter(
      (t) =>
        subjectWeaknesses.some((w) => t.subject.toLowerCase().includes(w.toLowerCase())) &&
        t.difficulty === "beginner" &&
        !recommendedIds.includes(t.id)
    );
    weaknessRecs.slice(0, 2).forEach((t) => recommendedIds.push(t.id));
  }

  return [...new Set(recommendedIds)]
    .map((id) => getTemplate(id)!)
    .filter(Boolean)
    .slice(0, 4);
}

export const difficultyColors = {
  beginner: { bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400" },
  intermediate: { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400" },
  advanced: { bg: "bg-red-500/10", border: "border-red-500/25", text: "text-red-400" },
};
