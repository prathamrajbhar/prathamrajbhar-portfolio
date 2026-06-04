import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { resolveAIConfigFromDatabase, getAIProviderLabel } from "@/lib/ai-config";

const requestSchema = z.object({
  module: z.string().min(1),
  field: z.string().min(1),
  prompt: z.string().min(1),
  context: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { module, field, prompt, context } = parsed.data;

    const config = await resolveAIConfigFromDatabase();

    if (!config.model) {
      return NextResponse.json(
        { success: false, error: "AI Model is not configured" },
        { status: 500 }
      );
    }

    if (config.provider === "openrouter" && (!config.apiKey || config.apiKey.length < 10)) {
      return NextResponse.json(
        { success: false, error: "AI API Key is missing or invalid. Add a real OpenRouter key to your .env file (AI_API_KEY=sk-or-v1-...)" },
        { status: 500 }
      );
    }

    const contextStr = context
      ? `Current form context:\n${Object.entries(context)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => `- ${k}: ${String(v).slice(0, 200)}`)
          .join("\n")}`
      : "";

    const userPrompt =
      `Module: ${module}\n` +
      `Field: ${field}\n` +
      `${contextStr}\n\n` +
      `User request: ${prompt}\n\n` +
      `Generate 3 excellent suggestions for the "${field}" field.`;

    const res = await fetch(config.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.provider === "openrouter"
          ? {
              Authorization: `Bearer ${config.apiKey}`,
              "HTTP-Referer": "https://localhost:3000",
            }
          : {}),
        "X-Title": "Portfolio CMS",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content:
              "You are a professional portfolio content assistant. " +
              "Your job is to suggest high-quality, concise content for a specific form field. " +
              "Rules:\n" +
              "- Suggest exactly 3 options as a JSON array.\n" +
              "- Each suggestion should be professional, well-written, and directly relevant.\n" +
              "- Do NOT invent personal facts, names, or credentials.\n" +
              "- Keep suggestions concise but impactful.\n" +
              "- For creative/text fields, use engaging and professional tone.\n" +
              "- For technical fields, be precise and specific.\n" +
              "- Return ONLY valid JSON in this exact format: {\"suggestions\": [\"option1\", \"option2\", \"option3\"]}",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`${getAIProviderLabel(config.provider)} error:`, res.status, err);
      return NextResponse.json(
        { success: false, error: `${getAIProviderLabel(config.provider)} error: ${res.status}` },
        { status: 500 }
      );
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error(`${getAIProviderLabel(config.provider)} non-JSON response:`, res.status, text.slice(0, 500));
      return NextResponse.json(
        { success: false, error: `${getAIProviderLabel(config.provider)} returned an invalid non-JSON response (e.g. HTML/Text).` },
        { status: 500 }
      );
    }

    let data;
    try {
      data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
    } catch (parseErr) {
      console.error("Failed to parse JSON response from AI provider:", parseErr);
      return NextResponse.json(
        { success: false, error: "Failed to parse JSON response from AI provider" },
        { status: 500 }
      );
    }

    const raw = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON from potential markdown code block
    const match = raw.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : raw;

    let parsedResult: { suggestions?: string[] };
    try {
      parsedResult = JSON.parse(jsonStr) as { suggestions?: string[] };
    } catch {
      // Fallback: split by newlines if JSON parse fails
      const lines = raw
        .split("\n")
        .map((l) => l.replace(/^[-*\d.]+\s*/, "").trim())
        .filter((l) => l.length > 0);
      parsedResult = { suggestions: lines.slice(0, 3) };
    }

    const suggestions = parsedResult.suggestions ?? [];
    if (suggestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "No suggestions generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("AI Suggest API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
