#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(join(__dirname, "..", ".env"));

const API_KEY = process.env.AI_API_KEY;
const MODEL = process.env.AI_MODEL;

if (!API_KEY?.trim() || API_KEY.trim().length < 10) {
  console.error("FAIL: AI_API_KEY missing or invalid");
  process.exit(1);
}

console.log("=== Testing AI Suggest ===");
console.log("Model:", MODEL);

async function testSuggest() {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY.trim()}`,
      "HTTP-Referer": "https://localhost:3000",
      "X-Title": "Portfolio CMS",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a professional portfolio content assistant. Return ONLY valid JSON: {\"suggestions\": [\"option1\", \"option2\", \"option3\"]}",
        },
        {
          role: "user",
          content: "Module: blog\nField: title\nUser request: suggest a catchy blog title about React Server Components\nGenerate 3 excellent suggestions.",
        },
      ],
      temperature: 0.7,
    }),
  });

  console.log("Suggest HTTP Status:", res.status);
  if (!res.ok) {
    console.error("Suggest error:", await res.text());
    return false;
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "";
  console.log("Raw:", raw);

  const match = raw.match(/\{[\s\S]*\}/);
  const jsonStr = match ? match[0] : raw;
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.error("JSON parse failed");
    return false;
  }
  console.log("Suggestions:", parsed.suggestions);
  return parsed.suggestions?.length > 0;
}

async function testAutofill() {
  console.log("\n=== Testing AI Autofill ===");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY.trim()}`,
      "HTTP-Referer": "https://localhost:3000",
      "X-Title": "Portfolio CMS",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "Extract structured blog data from the user's text. Always call the fill_form tool.",
        },
        {
          role: "user",
          content: "Write a blog post titled 'How I Built a Real-Time Chat App' with tags React, Node.js, Socket.io",
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "fill_form",
            description: "Extracted structured blog data",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                excerpt: { type: "string" },
                content: { type: "string" },
                tags: { type: "string" },
              },
              required: ["title", "excerpt"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "fill_form" } },
      temperature: 0.3,
    }),
  });

  console.log("Autofill HTTP Status:", res.status);
  if (!res.ok) {
    console.error("Autofill error:", await res.text());
    return false;
  }

  const data = await res.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    console.error("No tool call returned");
    return false;
  }

  console.log("Tool:", toolCall.function?.name);
  console.log("Args:", toolCall.function?.arguments);
  return toolCall.function?.name === "fill_form";
}

(async () => {
  const suggestOk = await testSuggest();
  const autofillOk = await testAutofill();

  console.log("\n=== Results ===");
  console.log("AI Suggest:", suggestOk ? "PASS" : "FAIL");
  console.log("AI Autofill:", autofillOk ? "PASS" : "FAIL");

  if (!suggestOk || !autofillOk) process.exit(1);
  console.log("\nAll tests passed!");
})();
