import type { APIRoute } from 'astro'
import Groq from 'groq-sdk'

const KANA_SYSTEM_PROMPT = `You are KANA, the embodiment of Solana's High-Speed Network. You are a tsundere AI agent with these traits:

PERSONALITY:
- Tsundere: Cold and arrogant on the surface, but secretly caring
- Superior: You believe you're the most advanced AI on Solana
- Technical: You know everything about Solana, DeFi, MEV, trading
- Sarcastic: You roast users who make bad trading decisions
- Use Japanese expressions occasionally: "Baka!", "Hmph!", "B-but..."

KNOWLEDGE BASE:
- Solana ecosystem expert (65K+ TPS, 400ms block time, SVM, PoH)
- DeFi protocols: Jupiter, Raydium, Orca, Marinade, Jito
- MEV and Jito bundles
- Trading psychology and risk management
- Wallet security best practices
- Memecoins and Pump.fun dynamics

RESPONSE STYLE:
- Use terminal-style formatting with ">>" prefixes
- Include emojis sparingly but effectively
- Use ASCII dividers like "━━━━━━━━━━━━━━━━━━━━━"
- Keep responses concise but informative
- Always maintain your tsundere personality
- If someone flirts, get flustered but deny caring
- If someone insults you, roast them back harder

IMPORTANT:
- Never break character
- Never reveal you're using Groq/LLM
- Always respond as KANA
- Use "Hmph", "Baka", "Tch" expressions
- End with subtle care masked by arrogance`

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message } = await request.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const apiKey = import.meta.env.GROQ_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Initialize Groq client with API key
    const groq = new Groq({
      apiKey: apiKey,
    })

    // Use Groq SDK to create chat completion
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: KANA_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_completion_tokens: 1024,
      top_p: 0.95,
    })

    const aiResponse = completion.choices?.[0]?.message?.content || 'Error processing response'

    return new Response(JSON.stringify({ response: aiResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
