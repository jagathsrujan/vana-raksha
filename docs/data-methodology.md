The production system uses **OpenCode Zen** (OpenAI GPT-5.4-mini) with **AI-determined dynamic weights**. Zen provides an OpenAI-compatible gateway with vision-capable GPT-5.4-mini for photo analysis and JSON-mode structured output for reliable parsing.

**Prompt instruction to AI:**
> "Based on the evidence provided, determine which dimension (flood, UHI, water) poses the greatest risk to this specific property. Adjust your scoring weight accordingly. A ward with declining water table AND high impervious surface should weight water stress more heavily than a ward with frequent flooding but adequate groundwater."

The AI outputs a `composite_score` that reflects this dynamic weighting. The fallback system uses fixed weights (40/30/30) only when the AI is unavailable.