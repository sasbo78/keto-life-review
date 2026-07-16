const PROVIDER = process.env.AI_PROVIDER || 'openai'
const OPENAI_KEY = process.env.OPENAI_API_KEY
const COMETAPI_KEY = process.env.COMETAPI_KEY

/* ─── OpenAI ─── */
async function callOpenAI(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

/* ─── CometAPI (Claude Sonnet 5) ─── */
async function callCometAPI(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.cometapi.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': COMETAPI_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`CometAPI error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

/* ─── Unified caller ─── */
export async function callAI({ system, user, maxTokens = 4000 }: { system: string; user: string; maxTokens?: number }): Promise<string> {
  if (PROVIDER === 'cometapi') {
    if (!COMETAPI_KEY) throw new Error('COMETAPI_KEY not set')
    return callCometAPI(system, user, maxTokens)
  }
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set')
  return callOpenAI(system, user, maxTokens)
}
