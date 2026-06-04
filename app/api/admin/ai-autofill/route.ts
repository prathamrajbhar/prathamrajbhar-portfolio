/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {
  schemas,
  buildSystemPrompt,
  type SupportedModule,
} from "@/lib/ai-autofill";
import { requireAdmin } from "@/lib/auth";
import { resolveAIConfigFromDatabase, getAIProviderLabel } from "@/lib/ai-config";

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
    await requireAdmin();

    const body = await req.json();
    const { messages, module } = body;

    const config = await resolveAIConfigFromDatabase();

    if (!config.model) {
      return NextResponse.json({ error: "AI Model is not configured" }, { status: 500 });
    }

    if (config.provider === "openrouter" && (!config.apiKey || config.apiKey.length < 10)) {
      return NextResponse.json(
        { error: "AI API Key is missing or invalid." },
        { status: 500 }
      );
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

    const isOllama = config.provider === "ollama";
    const requestBody: Record<string, unknown> = {
      model: config.model,
      messages: [
        {
          role: "system",
          content: isOllama
            ? `${buildSystemPrompt(module as SupportedModule)}\n\nReturn only valid JSON for the fill form data. Do not use tool calls, markdown, or explanatory text.`
            : buildSystemPrompt(module as SupportedModule),
        },
        ...chatMessages,
      ],
      temperature: 0.3,
    };

    if (!isOllama) {
      requestBody.tools = [
        {
          type: "function",
          function: {
            name: "fill_form",
            description: `Extracted structured data for the ${module} module. Always call this tool after understanding the user's input.`,
            parameters: zodToJsonSchema(moduleSchema),
          },
        },
      ];
      requestBody.tool_choice = { type: "function", function: { name: "fill_form" } };
    }

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
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`${getAIProviderLabel(config.provider)} error:`, res.status, err);
      return NextResponse.json({
        role: "assistant",
        parts: [{ type: "text", text: `I couldn’t extract form data right now (${getAIProviderLabel(config.provider)} responded with ${res.status}). Please try again.` }],
      });
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error(`${getAIProviderLabel(config.provider)} non-JSON response:`, res.status, text.slice(0, 500));
      return NextResponse.json({
        role: "assistant",
        parts: [{ type: "text", text: `I couldn’t extract form data right now (${getAIProviderLabel(config.provider)} returned an invalid non-JSON response). Please try again.` }],
      });
    }

    let data;
    try {
      data = (await res.json()) as {
        choices?: {
          message?: {
            content?: string;
            tool_calls?: {
              function?: { name?: string; arguments?: string };
            }[];
          };
        }[];
      };
    } catch (parseErr) {
      console.error("Failed to parse JSON response from AI provider:", parseErr);
      return NextResponse.json({
        role: "assistant",
        parts: [{ type: "text", text: "I couldn’t parse the JSON response from the AI provider. Please try again." }],
      });
    }

    const message = data.choices?.[0]?.message;
    const toolCall = message?.tool_calls?.[0];

    const parseJson = (value?: string) => {
      if (!value) return null;
      const match = value.match(/\{[\s\S]*\}/);
      const jsonStr = match ? match[0] : value;
      try {
        return JSON.parse(jsonStr) as Record<string, unknown>;
      } catch {
        return null;
      }
    };

    let args: any;
    if (toolCall?.function?.name === "fill_form") {
      try {
        args = JSON.parse(toolCall.function.arguments || "{}");
      } catch {
        args = null;
      }
    } else {
      args = parseJson(message?.content);
    }

    if (!args) {
      const text = (message?.content || "I couldn’t extract structured data from that message.").trim();
      return NextResponse.json({
        role: "assistant",
        parts: [{ type: "text", text }],
      });
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
