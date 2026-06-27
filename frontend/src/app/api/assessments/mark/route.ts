import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface MarkRequest {
  question: string;
  answer: string;
  type: "short_answer" | "code";
  maxPoints: number;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const { question, answer, type, maxPoints }: MarkRequest = await req.json();

  const prompt =
    type === "code"
      ? `You are marking a coding assessment for a student on the DAQS Learn platform.

**Question:** ${question}

**Student's Code:**
\`\`\`
${answer}
\`\`\`

**Maximum points:** ${maxPoints}

Evaluate the code. Award partial credit where deserved. Consider:
- Does it solve the problem correctly?
- Does it handle the test cases?
- Is the logic sound even if syntax has minor issues?
- Code quality and approach

Respond in exactly this JSON format:
{
  "score": <number 0 to ${maxPoints}>,
  "feedback": "<2-3 sentences: what was done well, what was wrong if anything, the ideal approach>"
}`
      : `You are marking a short answer question for a student on the DAQS Learn platform.

**Question:** ${question}

**Student's Answer:** ${answer}

**Maximum points:** ${maxPoints}

Evaluate the answer fairly. Award partial credit where the student shows understanding even if incomplete.

Respond in exactly this JSON format:
{
  "score": <number 0 to ${maxPoints}>,
  "feedback": "<2-3 sentences: acknowledge what was correct, point out gaps, give a brief ideal answer>"
}`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (response.content[0] as { text: string }).text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const result = JSON.parse(jsonMatch[0]);
    return Response.json({
      score: Math.min(Math.max(Number(result.score) || 0, 0), maxPoints),
      feedback: result.feedback ?? "No feedback available.",
    });
  } catch {
    return Response.json(
      { score: 0, feedback: "Could not evaluate this answer. Please review manually." },
      { status: 200 }
    );
  }
}
