// api.js — OpenAI API communication layer
// All API calls go through a Cloudflare Worker proxy to hide the API key.
// Direct OpenAI calls are used ONLY if no proxy URL is configured.

import { buildSystemPrompt } from "./utils/buildPrompt.js";
import { parseAIResponse } from "./utils/parseResult.js";

// --- Configuration ---
const OPENAI_MODEL = "gpt-4o";
const FALLBACK_MODEL = "gpt-4o-mini";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

const API_PROXY_URL = import.meta.env.VITE_API_PROXY_URL || null;
const OPENAI_DIRECT_KEY = import.meta.env.VITE_OPENAI_API_KEY || null;

function getApiConfig() {
  if (API_PROXY_URL) {
    return {
      url: `${API_PROXY_URL.replace(/\/$/, "")}/v1/chat/completions`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_DIRECT_KEY || "proxy-key"}`,
      },
      proxy: true,
      model: OPENAI_MODEL,
    };
  }
  if (!OPENAI_DIRECT_KEY) {
    throw new Error(
      "No API configuration found. Set VITE_API_PROXY_URL (Cloudflare Worker) or VITE_OPENAI_API_KEY (direct) in your .env file."
    );
  }
  return {
    url: `https://api.openai.com/v1/chat/completions`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_DIRECT_KEY}`,
    },
    proxy: false,
    model: OPENAI_MODEL,
  };
}

function buildMessages(systemPrompt, userContent, imageBase64 = null) {
  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];
  if (imageBase64) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userContent },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: "high" },
        },
      ],
    });
  } else {
    messages.push({ role: "user", content: userContent });
  }
  return messages;
}

async function callOpenAI(messages, model = OPENAI_MODEL, extraConfig = {}) {
  const { url, headers } = getApiConfig();
  const body = {
    model,
    messages,
    temperature: 0.3,
    top_p: 0.95,
    max_tokens: 4096,
    response_format: { type: "json_object" },
    ...extraConfig,
  };
  let lastError = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} — ${errorText}`);
      }
      const json = await response.json();
      if (json.error) {
        throw new Error(`API error: ${json.error.message || JSON.stringify(json.error)}`);
      }
      const choice = json.choices?.[0];
      if (!choice) throw new Error("No choices in API response");
      if (choice.finish_reason === "content_filter") throw new Error("Content filter blocked the response");
      let text = choice.message?.content;
      if (!text) throw new Error("Empty response from API");
      return text;
    } catch (err) {
      lastError = err;
      console.warn(`API attempt ${attempt + 1} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(`API failed after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`);
}

export async function analyzePhoto(photo, matchedWard) {
  if (!photo || !photo.base64) {
    return { success: false, error: "No photo data provided", data: null };
  }
  const systemPrompt = buildSystemPrompt(matchedWard);
  const annotations = [];
  if (photo.why) annotations.push(`Why taken: ${photo.why}`);
  if (photo.assessment) annotations.push(`User assessment: ${photo.assessment}`);
  if (photo.tags && photo.tags.length > 0) annotations.push(`Tags: ${photo.tags.join(", ")}`);
  const userContent =
    `Analyze this photo for urban climate risk signals in Bengaluru.\n` +
    `Return ONLY valid JSON matching this schema:\n` +
    `{\n` +
    `  "flood_signals": ["string — list of observed flood risk indicators"],\n` +
    `  "heat_signals": ["string — list of observed UHI indicators"],\n` +
    `  "water_signals": ["string — list of observed water stress indicators"],\n` +
    `  "key_observation": "one sentence summary",\n` +
    `  "confidence": "Low|Medium|High"\n` +
    `}\n` +
    (annotations.length > 0 ? `\nUser annotations:\n${annotations.join("\n")}\n\n` : "");
  try {
    const rawResponse = await callOpenAI(
      buildMessages(systemPrompt, userContent, photo.base64),
      OPENAI_MODEL,
      { temperature: 0.2 }
    );
    return parseAIResponse(rawResponse, "photo");
  } catch (err) {
    return { success: false, error: err.message, data: null };
  }
}

export async function runSynthesis(
  matchedWard,
  photoAnalyses,
  testimonies,
  propertyType,
  userIntent,
  notes
) {
  const systemPrompt = buildSystemPrompt(matchedWard);
  const photoEvidence = photoAnalyses
    .filter((a) => a.success)
    .map((a, i) => ({
      photo_index: i + 1,
      flood_signals: a.data.flood_signals,
      heat_signals: a.data.heat_signals,
      water_signals: a.data.water_signals,
      key_observation: a.data.key_observation,
      confidence: a.data.confidence,
    }));
  const testimonyEvidence = testimonies
    .filter((t) => t.said && t.said.trim().length > 0)
    .map((t) => ({
      who: t.who || "Anonymous",
      statement: t.said,
      concern_level: t.concern,
      credibility_score: t.credibility,
    }));
  const userContent =
    `Synthesize a complete climate risk assessment for the following property.\n\n` +
    `PROPERTY CONTEXT:\n` +
    `- Property type: ${propertyType || "Not specified"}\n` +
    `- User intent: ${userIntent || "Not specified"}\n` +
    `- User notes: ${notes || "None"}\n` +
    `- Ward: ${matchedWard ? matchedWard.label : "Unknown/unmatched"}\n` +
    `- Zone: ${matchedWard ? matchedWard.zone : "N/A"}\n` +
    (matchedWard?.isInterpolated ? `⚠️ INTERPOLATED DATA — ward was not directly in database; proxied from nearest zone\n` : "") +
    `\n` +
    `PHOTO EVIDENCE (${photoEvidence.length} photos analyzed):\n` +
    `${photoEvidence.map((p) =>
      `Photo ${p.photo_index}: [Flood: ${p.flood_signals.length} signals, Heat: ${p.heat_signals.length} signals, Water: ${p.water_signals.length} signals, confidence: ${p.confidence}]`
    ).join("\n")}\n` +
    `${photoEvidence.length > 0 ? "\nDetailed photo signals:\n" + photoEvidence.map((p) =>
      `Photo ${p.photo_index} — Flood: ${p.flood_signals.join("; ") || "none"} | Heat: ${p.heat_signals.join("; ") || "none"} | Water: ${p.water_signals.join("; ") || "none"}`
    ).join("\n") : ""}\n` +
    `\nLOCAL TESTIMONY (${testimonyEvidence.length} entries):\n` +
    `${testimonyEvidence.map((t) =>
      `"${t.statement}" — ${t.who} (concern: ${t.concern_level}, credibility: ${t.credibility_score}/5)`
    ).join("\n")}\n` +
    (testimonyEvidence.length === 0 ? "(No testimonies provided)\n" : "") +
    `\nWARD BASELINE SUMMARY:\n` +
    (matchedWard
      ? `- Flood baseline: ${matchedWard.flood} (${matchedWard.flood_events_10yr || 0} events in 10yr)\n` +
        `- UHI baseline: ${matchedWard.uhi} (delta: ${matchedWard.uhi_delta || "N/A"})\n` +
        `- Water baseline: ${matchedWard.water} (table: ${matchedWard.water_table_depth_m || "N/A"}m, BWSSB: ${matchedWard.bwssb_sewer_coverage_pct || "N/A"}%)\n` +
        `- NDVI: ${matchedWard.ndvi || "N/A"}, Impervious: ${matchedWard.impervious_pct || "N/A"}%\n` +
        `- Lakes: ${matchedWard.lake_count || 0}, pop density: ${matchedWard.pop_density?.toLocaleString() || "N/A"}/sqkm`
      : "No ward data available — use Bengaluru city-wide baselines.") +
    `\n\nYour task: Produce a single, authoritative risk assessment that synthesizes ALL evidence (photographic, testimonial, ward baseline, and city context). Be specific, cite data points, and flag any data gaps or contradictions.\n`;
  try {
    const rawResponse = await callOpenAI(
      buildMessages(systemPrompt, userContent),
      OPENAI_MODEL,
      { temperature: 0.2 }
    );
    return parseAIResponse(rawResponse, "synthesis");
  } catch (err) {
    return { success: false, error: err.message, data: null };
  }
}

export async function checkApiHealth() {
  try {
    const config = getApiConfig();
    const modelName = config.model;
    const response = await fetch(
      config.url.replace("/chat/completions", `/models/${modelName}`),
      { method: "GET", headers: config.headers }
    );
    if (response.ok) return { ok: true, details: `OpenAI API reachable (${modelName})` };
    const text = await response.text();
    if (response.status === 404) return { ok: true, details: `Auth OK (model ${modelName} not found but key is valid)` };
    return { ok: false, error: `${response.status}: ${text}` };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}