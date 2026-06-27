import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const { studentName, subjectStats, tutorTopics, totalAssessments, averageScore, streak, totalTutorMessages, achievements } = await req.json();

  const subjectSummary = Object.entries(subjectStats as Record<string, { scores: number[]; attempts: number }>)
    .map(([subject, stats]) => {
      const avg = stats.scores.length
        ? Math.round(stats.scores.reduce((a: number, b: number) => a + b, 0) / stats.scores.length)
        : 0;
      const trend = stats.scores.length > 1
        ? stats.scores[stats.scores.length - 1] > stats.scores[0] ? "improving" : "declining"
        : "baseline";
      return `${subject}: avg ${avg}% over ${stats.attempts} attempt(s), trend: ${trend}`;
    }).join("\n");

  const tutorSummary = Object.entries(tutorTopics as Record<string, { count: number }>)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([subject, { count }]) => `${subject} (${count} questions)`)
    .join(", ");

  const prompt = `You are a learning analytics AI for DAQS Learn, an educational platform for South African students.

Analyse this student's learning profile and generate a personalised report:

**Student:** ${studentName}
**Total Assessments Completed:** ${totalAssessments}
**Average Score:** ${averageScore}%
**Learning Streak:** ${streak} day(s)
**Total AI Tutor Messages:** ${totalTutorMessages}
**Achievements Earned:** ${achievements}

**Subject Performance:**
${subjectSummary || "No assessments completed yet"}

**Most Asked Topics in AI Tutor:**
${tutorSummary || "No tutor sessions yet"}

Generate a JSON response with this exact structure:
{
  "summary": "<2-3 sentence personalised overview of the student's learning journey>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "weaknesses": ["<area needing work 1>", "<area needing work 2>", "<area needing work 3>"],
  "recommendations": [
    { "title": "<short action title>", "detail": "<specific actionable advice>", "priority": "high|medium|low" },
    { "title": "<short action title>", "detail": "<specific actionable advice>", "priority": "high|medium|low" },
    { "title": "<short action title>", "detail": "<specific actionable advice>", "priority": "high|medium|low" },
    { "title": "<short action title>", "detail": "<specific actionable advice>", "priority": "high|medium|low" }
  ],
  "nextSteps": "<1 sentence motivational message and the single most important next action>",
  "predictedTrajectory": "improving|stable|needs_attention"
}

Be specific, personalised, encouraging, and actionable. Reference actual subjects and scores where possible.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (response.content[0] as { text: string }).text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response");
    return Response.json(JSON.parse(jsonMatch[0]));
  } catch {
    return Response.json({
      summary: "Your learning journey is just getting started. Complete more assessments to unlock detailed insights.",
      strengths: ["Proactive learner", "Using AI Tutor effectively", "Engaged with the platform"],
      weaknesses: ["More data needed", "Complete more assessments", "Try different subjects"],
      recommendations: [
        { title: "Take an assessment", detail: "Complete at least one assessment in each subject to establish your baseline.", priority: "high" },
        { title: "Set a daily goal", detail: "Commit to 30 minutes of learning per day to build a consistent habit.", priority: "high" },
        { title: "Use the AI Tutor", detail: "Ask your AI Tutor to explain topics you find challenging.", priority: "medium" },
        { title: "Review wrong answers", detail: "After each assessment, review incorrect answers using the AI Tutor.", priority: "medium" },
      ],
      nextSteps: "Start with the Python Fundamentals assessment to establish your baseline.",
      predictedTrajectory: "improving",
    });
  }
}
