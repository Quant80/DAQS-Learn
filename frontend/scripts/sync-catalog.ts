/**
 * Pushes the static course/assessment catalog (frontend/src/data/courses.ts,
 * frontend/src/data/assessmentTemplates.ts) into the backend's lightweight
 * Course/AssessmentTemplate reference tables, so Enrollment/AssessmentAttempt
 * rows have something real to FK against.
 *
 * Run manually after editing the catalog:
 *   DAQS_ADMIN_TOKEN=<admin JWT> npm run sync-catalog
 * or pass --api-base to target a non-default backend.
 */
import { courses, getTotalLessons } from "../src/data/courses";
import { assessmentTemplates } from "../src/data/assessmentTemplates";

const apiBaseArg = process.argv.find((a) => a.startsWith("--api-base="));
const API_BASE = apiBaseArg
  ? apiBaseArg.split("=")[1]
  : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const token = process.env.DAQS_ADMIN_TOKEN;
if (!token) {
  console.error("Set DAQS_ADMIN_TOKEN to an admin JWT before running this script.");
  process.exit(1);
}

async function main() {
  const body = {
    courses: courses.map((c) => ({
      id: c.id,
      title: c.title,
      track: c.track,
      difficulty: c.difficulty,
      estimated_hours: c.estimatedHours,
      total_lessons: getTotalLessons(c),
    })),
    assessment_templates: assessmentTemplates.map((t) => ({
      id: t.id,
      title: t.title,
      subject: t.subject,
      difficulty: t.difficulty,
      question_count: t.questionCount,
      time_limit_minutes: t.timeLimit,
    })),
  };

  const res = await fetch(`${API_BASE}/admin/catalog/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error(`Sync failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }

  console.log(await res.json());
}

main();
