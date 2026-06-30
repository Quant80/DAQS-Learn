import { NextRequest } from "next/server";
import { complete, hasProviderKey, DEFAULT_MODEL_ID } from "@/lib/aiProvider";
import type { AIProvider } from "@/lib/aiProvider";

interface MarkRequest {
  question: string;
  answer: string;
  type: "short_answer" | "code";
  maxPoints: number;
  provider?: AIProvider;
  modelId?: string;
}

export async function POST(req: NextRequest) {
  const { question, answer, type, maxPoints, provider = "claude", modelId = DEFAULT_MODEL_ID }: MarkRequest = await req.json();

  if (!hasProviderKey(provider)) {
    // Fall back to Claude if the selected provider key isn't set
    if (!hasProviderKey("claude")) {
      return Response.json(
        { score: 0, feedback: "No AI provider configured. Please contact the administrator." },
        { status: 200 }
      );
    }
  }

  const activeProvider = hasProviderKey(provider) ? provider : "claude";
  const activeModel = activeProvider === provider ? modelId : DEFAULT_MODEL_ID;

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
    const text = await complete(activeProvider, activeModel, prompt, 512);
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
