/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {
  schemas,
  buildSystemPrompt,
  type SupportedModule,
} from "@/lib/ai-autofill";

function zodToJsonSchema(schema: any): any {
  const def = schema?._def;
  if (!def) return { type: "object", properties: {} };

  switch (def.typeName) {
    case "ZodObject": {
      const properties: any = {};
      const required: string[] = [];
      for (const [key, val] of Object.entries(def.shape() as any)) {
        properties[key] = zodToJsonSchema(val);
        if (!(val as any).isOptional?.()) required.push(key);
      }
      return { type: "object", properties, required };
    }
    case "ZodString": return { type: "string" };
    case "ZodNumber": return { type: "number" };
    case "ZodBoolean": return { type: "boolean" };
    case "ZodArray": {
      return { type: "array", items: zodToJsonSchema(def.type) };
    }
    case "ZodEnum": {
      return { type: "string", enum: def.values };
    }
    case "ZodOptional": {
      return zodToJsonSchema(def.innerType);
    }
    case "ZodNullable": {
      return zodToJsonSchema(def.innerType);
    }
    default:
      return { type: "string" };
  }
}

/**
 * AI Autofill API Route
 * Uses native fetch to OpenRouter chat/completions with function calling.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, module } = body;

    const apiKey = process.env.AI_API_KEY?.trim();
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json(
        { error: "AI API Key is missing or invalid." },
        { status: 500 }
      );
    }

    if (!process.env.AI_MODEL) {
      return NextResponse.json({ error: "AI Model is not configured" }, { status: 500 });
    }

    const moduleSchema = schemas[module as SupportedModule];
    if (!moduleSchema) {
      return NextResponse.json({ error: "Invalid module specified." }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages must be an array." }, { status: 400 });
    }

    const chatMessages = messages.map((m: any) => {
      let content = m.content;
      if (m.parts) {
        content = m.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("\n");
      }
      return { role: m.role, content };
    });

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://localhost:3000",
        "X-Title": "Portfolio CMS",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(module as SupportedModule) },
          ...chatMessages,
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "fill_form",
              description: `Extracted structured data for the ${module} module. Always call this tool after understanding the user's input.`,
              parameters: zodToJsonSchema(moduleSchema),
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "fill_form" } },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenRouter error:", res.status, err);
      return NextResponse.json(
        { error: `OpenRouter error: ${res.status}` },
        { status: 500 }
      );
    }

    const data = (await res.json()) as {
      choices?: {
        message?: {
          tool_calls?: {
            function?: { name?: string; arguments?: string };
          }[];
        };
      }[];
    };

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function?.name !== "fill_form") {
      return NextResponse.json(
        { error: "No form data extracted." },
        { status: 500 }
      );
    }

    let args: any;
    try {
      args = JSON.parse(toolCall.function.arguments || "{}");
    } catch {
      return NextResponse.json(
        { error: "Invalid tool call arguments." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      role: "assistant",
      parts: [
        {
          type: "tool-invocation",
          toolInvocation: {
            toolName: "fill_form",
            state: "result",
            result: { data: args },
          },
        },
      ],
    });
  } catch (error: any) {
    console.error("AI Autofill API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during AI processing." },
      { status: 500 },
    );
  }
}
