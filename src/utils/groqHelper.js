// Groq API helper for all LegalAxis features
export async function callGroqAPI(prompt, options = {}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not found in environment variables');
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: options.model || "llama-3.1-8b-instant",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024,
      ...(options.jsonMode ? { response_format: { type: "json_object" } } : {})
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
