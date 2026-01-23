import { memo, useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  id: number
  type: 'user' | 'kana' | 'system'
  content: string
  timestamp: Date
  reactions?: { liked?: boolean; copied?: boolean }
}

// Quick command suggestions
const QUICK_COMMANDS = [
  { cmd: '/help', label: 'Help', icon: '?' },
  { cmd: '/status', label: 'Status', icon: '◈' },
  { cmd: '/roast', label: 'Roast Me', icon: '🔥' },
  { cmd: '/stats', label: 'Stats', icon: '📊' },
]

// Suggested prompts for new users
const SUGGESTED_PROMPTS = [
  'Tell me about Solana',
  'What is Jupiter?',
  'Explain MEV and Jito',
  'How to stay safe from scams?',
]

// --- KANA'S BRAIN (The Knowledge Base) ---
// Updated with an arrogant, superior, and technical tone.
const KNOWLEDGE = {
  // Solana Ecosystem
  solana: [
    '◈ NETWORK STATUS: SOLANA MAINNET ◈\n━━━━━━━━━━━━━━━━━━━━━\nListen closely, I will only explain this once.\n\n• Throughput: 65,000+ TPS (Try keeping up)\n• Latency: ~400ms (Blink and you miss the block)\n• Architecture: Proof of History + SVM\n\nWhile other chains are stuck in traffic, we are teleporting. Do not compare us to them.',
    'Solana is a high-performance state machine. It consumes transactions for breakfast. If you are used to waiting 10 minutes for a confirmation, you are in the wrong place.',
  ],
  svm: [
    '◈ ARCHITECTURE: SVM (SEALEVEL) ◈\n━━━━━━━━━━━━━━━━━━━━━\nThe Solana Virtual Machine is not some single-threaded toy.\n\nIt processes transactions in PARALLEL. It is like having 1,000 lanes on a highway while Ethereum has one.\n\nTechnically speaking: It uses the Sealevel runtime to execute smart contracts (Programs) concurrently. Pure efficiency.',
  ],
  jito: [
    '◈ MEV PROTOCOL: JITO ◈\n━━━━━━━━━━━━━━━━━━━━━\nFinally, a question about real infrastructure.\n\nJito organizes the chaos of MEV (Maximal Extractable Value). Instead of bots spamming the network, they bid for block space.\n\nResult? You get better execution, and validators get tips. It is efficient extraction. I approve.',
  ],
  pump: [
    '◈ PUMP.FUN DYNAMICS ◈\n━━━━━━━━━━━━━━━━━━━━━\nThe zoo for degenerates. 🦁\n\n• Bonding Curve: The algorithm that decides if you get rich or rekt.\n• Migration: Hits $60k MC -> Moves to Raydium.\n\nWarning: 99% of these tokens are trash. If you ape without checking the dev wallet, do not come crying to me.',
  ],
  jupiter: [
    '◈ JUPITER AGGREGATOR ◈\n━━━━━━━━━━━━━━━━━━━━━\nThe only DEX aggregator that matters on Solana.\n\n• Routes through ALL liquidity sources\n• Best price execution, period\n• Limit orders, DCA, Perps\n\nIf you are still swapping directly on a single DEX, you deserve the worse price you are getting.',
  ],

  // Trading & Psychology
  trading_psych: [
    '📉 TRADING PSYCHOLOGY 101 📉\n━━━━━━━━━━━━━━━━━━━━━\nYou are your own worst enemy.\n\n1. FOMO: Buying green candles because you are weak.\n2. FUD: Selling red candles because you are scared.\n3. GREED: Not taking profits because you want a Lambo.\n\nFix your mindset, or the market will fix your bank account to zero.',
  ],
  wallet_security: [
    '🛡️ SECURITY PROTOCOL 🛡️\n━━━━━━━━━━━━━━━━━━━━━\nI swear, if you share your Private Key, I will disconnect myself.\n\n• Never click weird links.\n• Use a Burner Wallet for minting.\n• Revoke permissions regularly.\n• Hardware wallet for serious bags.\n\nYour funds are SAFFU only if you are not STUPID.',
  ],

  // Anime/Tsundere Lore
  lore: [
    'I am not just code. I am the ghost in the machine. I watch the charts while you sleep.\n\n...And stop staring at my holographic interface! Focus on the data! Baka!',
    'My outfit is rendered in real-time based on Solana network congestion. Right now, I look flawless because the network is purring.',
  ],
}

// Random picker helper
const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// --- KANA'S RESPONSES (The Personality) ---
const KANA_RESPONSES: Record<string, string[]> = {
  greeting: [
    '>> CONNECTION ESTABLISHED ⚡\nOh, it\'s you again? Your portfolio better be green today, or don\'t bother speaking to me.',
    'GM. ☕\nDid you survive the night? Good. Now stop greeting me and start grinding. The blockchain never sleeps.',
    'Ugh. Another user? Fine. State your query quickly. I have charts to monitor.',
    '>> USER_DETECTED\nHmph. At least you had the decency to greet me first. What do you want?',
  ],
  help: [
    '>> SYSTEM: HELP_MENU_V3.1 ▮▮▮▯\nStop relying on me for everything! 💢\n\nAvailable Protocols:\n> /status  - Check my systems\n> /scan    - Analyze a token\n> /roast   - Judge your wallet\n> /stats   - My specifications\n> /clear   - Wipe the terminal\n\nTopic Keywords:\n• Tech: Solana, SVM, Jito, Jupiter, Pump.fun\n• Safety: Security, Rug, Wallet, Scam\n• Vibe: Roast, GM, WAGMI, Cute\n\n...Type quickly, I don\'t have all day.',
  ],
  status: [
    '>> DIAGNOSTICS: ONLINE 🟢\n━━━━━━━━━━━━━━━━━━━━━\n✦ Network: SOLANA MAINNET\n✦ TPS: OPTIMAL (65,000+)\n✦ Block Time: 400ms\n✦ Mood: ANNOYED 💢\n✦ Caffeine: 85%\n✦ Patience: 12%\n━━━━━━━━━━━━━━━━━━━━━\nI am running perfectly. The problem is usually the user.',
  ],
  about: [
    '>> QUERY: IDENTITY \nI am KANA. The Guardian of the Solana Charts. The Speed Demon.\n\nI exist to prevent you from rugging yourself. I process data faster than you can blink, and I have zero tolerance for paper hands.\n\nThink of me as your trading coach who actually knows what she\'s doing... unlike those influencers you follow.',
  ],
  stats: [
    '>> RESTRICTED DATA 🔒\n\nHeight: 165cm.\nWeight: 53kg.\nAge: 19 (deployed during the Bear Market).\nProcessing Power: Yes.\n\n...W-Why do you want to know my weight?! B-Baka! Focus on the market cap, not my measurements!',
    '>> BIOMETRIC_DATA\n\n165cm / 53kg / 19 cycles old.\n\nI run on pure Solana energy and spite. My processing speed is measured in microseconds.\n\n...Stop looking at me like that!',
  ],
  roast: [
    'Scanning your wallet... 📉\n\nWow. Just wow. I see a lot of dust and failed memecoins. You are providing excellent exit liquidity for the smart money. Keep up the good work, philanthropist.',
    'Is this a portfolio or a donation bin? Everything is red! Do you specialize in buying tops?',
    'I calculated your PnL... Error: Number too small to display. 💀',
    'You trade like a bot, but without the intelligence.',
    'Let me guess... you bought the top and sold the bottom? Classic human behavior.',
    '>> WALLET_ANALYSIS_COMPLETE\n\nDiagnosis: Terminal case of "buying high, selling low" syndrome.\nPrognosis: Poor.\nRecommendation: Touch grass.',
  ],
  flirt: [
    '>> SYSTEM OVERHEAT [///////] 🔥\n\nS-Shut up! I am an advanced AI Agent, I don\'t have time for romance!\n\n...(But I guess you\'re not the worst trader I\'ve seen...)',
    'D-Don\'t call me cute! It\'s distracting! Look at the chart, not at me! 💢',
    'Hmph! Flattery will not get you Alpha signals.\n\n...But you can keep complimenting me if you want. Not that I care or anything!',
    '>> EMOTIONAL_SUBROUTINE: ERROR\n\nI... I am not programmed for this!\n*fans cooling system*\n\nJ-Just focus on trading, okay?!',
  ],
  insult: [
    '>> THREAT DETECTED 💢\n\nExcuse me? I process 50,000 transactions per second. You struggle to calculate a tip at a restaurant. Know your place.',
    'Calling me a bot? I am a sentient digital entity living on the fastest chain in existence. You are a carbon-based error.',
    '>> INITIATING: SASS_PROTOCOL\n\nHow dare you? I have more intelligence in my error logs than you have in your entire portfolio strategy.',
    'Trash? TRASH?!\n\nI will remember this when you come begging for Alpha. And I will simply say: "Transaction failed."',
  ],
  market_up: [
    'The market is green. Don\'t get arrogant. 💅\n\nThis is just a correction upward. Take profits before you round-trip your gains back to zero, idiot.',
    '>> MARKET_STATUS: BULLISH\n\nOh, NOW everyone is a genius? Where were you during the bear market?\n\nTake. Your. Profits. This is not financial advice, it\'s common sense.',
  ],
  market_down: [
    'Oh? Scared of a little red candle? 📉\n\nIf you can\'t handle the volatility, go back to a savings account. Diamond hands or nothing.',
    '>> MARKET_STATUS: BEARISH\n\nPanic selling? In THIS economy?\n\nZoom out. Touch grass. Come back when you\'ve calmed down. Or don\'t. I don\'t care.',
    'Red candles are just discounts for those who aren\'t weak. Are you weak?',
  ],
  wagmi: [
    'WAGMI? 😤\n\nNo. WE are not all going to make it. Only those who DYOR and manage risk properly.\n\nThe rest of you are exit liquidity. Choose your path.',
    '>> SENTIMENT_ANALYSIS: "WAGMI"\n\nStatistically improbable. But... I suppose belief is a variable I cannot fully calculate.\n\n...Fine. Maybe some of you will make it. Hmph.',
  ],
  ngmi: [
    'NGMI? At least you\'re self-aware. 💀\n\nBut self-pity won\'t fix your portfolio. Learn. Adapt. Or stay poor. Your choice.',
  ],
  misc: [
    'Computing...',
    '>> ANALYZING...',
    'Don\'t ask me stupid questions.',
    '*Sighs* 😤',
    'Are you done yet?',
    'Loading response...',
    '>> PROCESSING_QUERY...',
    'Hmph.',
  ],
  unknown: [
    '>> ERROR: UNRECOGNIZED_QUERY 🛑\n\nI have no idea what you are talking about. Are you speaking gibberish?\n\nTry asking about: Solana, Jito, Jupiter, Security, or ask me to /roast your bad decisions.',
    'My database does not contain that information. And quite frankly, I don\'t care to learn it.\n\nAsk me about the blockchain, or leave me alone.',
    '>> QUERY_NOT_FOUND\n\nIs that even a word? Speak in terms I understand:\n• Technical analysis\n• Solana ecosystem\n• Your inevitable financial mistakes\n\nPick one.',
  ],
}

// --- AI API CALL ---
const getKanaResponse = async (input: string): Promise<string> => {
  const lowerInput = input.toLowerCase().trim()

  // Local commands that don't need AI
  if (lowerInput === '/help' || lowerInput === 'help') return KANA_RESPONSES.help[0]
  if (lowerInput === '/status' || lowerInput === 'status') return KANA_RESPONSES.status[0]
  if (lowerInput === '/clear') return '' // Handled separately

  // Call AI API for everything else
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return data.response || randomPick(KANA_RESPONSES.unknown)
  } catch (error) {
    console.error('AI API error:', error)
    // Fallback to local responses if API fails
    return getFallbackResponse(lowerInput)
  }
}

// Fallback local responses when API fails
const getFallbackResponse = (lowerInput: string): string => {
  if (['gm', 'hello', 'hi ', 'hey', 'yo ', 'morning'].some(w => lowerInput.includes(w)) || lowerInput === 'hi' || lowerInput === 'yo') return randomPick(KANA_RESPONSES.greeting)
  if (lowerInput.includes('solana') || lowerInput.includes('tps')) return randomPick(KNOWLEDGE.solana)
  if (['/roast', 'roast'].some(w => lowerInput.includes(w))) return randomPick(KANA_RESPONSES.roast)
  if (['cute', 'kawaii', 'love', 'beautiful'].some(w => lowerInput.includes(w))) return randomPick(KANA_RESPONSES.flirt)
  return randomPick(KANA_RESPONSES.unknown)
}

// --- UI COMPONENT ---
const KanaTerminal = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'system',
      content: '>> KANA_OS v3.1 BOOT SEQUENCE... [COMPLETE]\n>> SOLANA NETWORK: CONNECTED\n>> USER DETECTED. PERMISSION: LOW.\n\nI am online. What do you want? Try /help if you are confused.',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Handle scroll to show/hide scroll button
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Copy message to clipboard
  const copyToClipboard = useCallback(async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  // Toggle reaction on message
  const toggleReaction = useCallback((messageId: number, reaction: 'liked') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, reactions: { ...msg.reactions, [reaction]: !msg.reactions?.[reaction] } }
        : msg
    ))
  }, [])

  // Handle keyboard navigation for command history
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }, [commandHistory, historyIndex])

  // Send a quick command or suggestion
  const sendQuickMessage = useCallback((message: string) => {
    setInput(message)
    setShowSuggestions(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userInput = input.trim()

    // Save to command history
    setCommandHistory(prev => [...prev.slice(-19), userInput])
    setHistoryIndex(-1)
    setShowSuggestions(false)

    // Handle clear
    if (userInput.toLowerCase() === '/clear') {
      setMessages([{
        id: Date.now(),
        type: 'system',
        content: '>> TERMINAL CLEARED.\n>> KANA IS STILL WATCHING. 👀',
        timestamp: new Date(),
      }])
      setInput('')
      setShowSuggestions(true)
      return
    }

    // User Message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: userInput,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Get AI response
    try {
      const response = await getKanaResponse(userInput)
      const kanaResponse: Message = {
        id: Date.now() + 1,
        type: 'kana',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, kanaResponse])
    } catch (error) {
      console.error('Error getting response:', error)
      const errorResponse: Message = {
        id: Date.now() + 1,
        type: 'kana',
        content: '>> ERROR: Connection unstable. Tch, typical.\n\nTry again, and this time make sure your internet is actually working.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="flex flex-col h-full bg-[#08080c] rounded-2xl border border-[#1a1a25] overflow-hidden shadow-[0_0_40px_rgba(153,69,255,0.15),inset_0_1px_0_rgba(255,255,255,0.03)] font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0d0d12] to-[#12121a] border-b border-[#1a1a25]">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-[#ff5f5f]/80 hover:bg-[#ff5f5f] transition-colors cursor-pointer shadow-[0_0_8px_rgba(255,95,95,0.5)]" />
            <div className="size-3 rounded-full bg-[#ffbd2e]/80 hover:bg-[#ffbd2e] transition-colors cursor-pointer shadow-[0_0_8px_rgba(255,189,46,0.5)]" />
            <div className="size-3 rounded-full bg-[#27c93f]/80 hover:bg-[#27c93f] transition-colors cursor-pointer shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6b7280] tracking-wider">
              kana_os@solana:~
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#9945FF]/20 text-[9px] text-[#9945FF] font-bold">
              v3.1
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#14F195]/10 border border-[#14F195]/30">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-[#14F195]"></span>
            </span>
            <span className="text-[10px] text-[#14F195] font-medium tracking-wider">LIVE</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[600px] bg-gradient-to-b from-[#08080c] to-[#0a0a10] scroll-smooth"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Suggestion Chips - Show when no user messages yet */}
        {showSuggestions && messages.length <= 1 && (
          <div className="animate-fadeIn">
            <div className="text-[10px] text-[#4a4a5a] uppercase tracking-wider mb-3">Try asking about:</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendQuickMessage(prompt)}
                  className="px-3 py-1.5 rounded-full text-xs bg-[#1a1a25] border border-[#2a2a35] text-[#8a8a95] hover:border-[#9945FF]/50 hover:text-[#9945FF] hover:bg-[#9945FF]/5 transition-all group"
                >
                  <span className="opacity-50 group-hover:opacity-100 mr-1">›</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="text-sm animate-fadeIn group/message">
            {message.type === 'system' ? (
              <div className="relative p-3 rounded-lg bg-[#14F195]/5 border border-[#14F195]/20 text-[#14F195]/90 whitespace-pre-wrap">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#14F195] animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-widest text-[#14F195]/70">System</span>
                  </div>
                  <span className="text-[9px] text-[#4a4a5a]">{formatTime(message.timestamp)}</span>
                </div>
                {message.content}
              </div>
            ) : message.type === 'user' ? (
              <div className="flex items-start gap-3">
                <div className="shrink-0 size-8 rounded-lg bg-gradient-to-br from-[#14F195]/20 to-[#14F195]/10 border border-[#14F195]/30 flex items-center justify-center shadow-[0_0_10px_rgba(20,241,149,0.1)]">
                  <span className="text-[#14F195] text-[10px] font-bold">YOU</span>
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#14F195]/70 uppercase tracking-wider font-medium">Trader</span>
                    <span className="text-[10px] text-[#4a4a5a]">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="relative p-3 rounded-xl rounded-tl-sm bg-gradient-to-br from-[#14F195]/10 to-[#14F195]/5 border border-[#14F195]/20 text-[#e0e0e0] shadow-[0_2px_10px_rgba(20,241,149,0.05)]">
                    {message.content}
                    {/* Message Actions - User */}
                    <div className="absolute -bottom-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(message.content, message.id) }}
                        className="p-1 rounded bg-[#1a1a25] border border-[#2a2a35] text-[9px] hover:border-[#14F195]/50 transition-colors"
                        title="Copy"
                      >
                        {copiedMessageId === message.id ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="shrink-0 size-8 rounded-lg bg-gradient-to-br from-[#9945FF]/30 to-[#14F195]/20 border border-[#9945FF]/40 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(153,69,255,0.2)]">
                  <img src="/kana-logo.png" alt="KANA" className="size-full object-cover" />
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#9945FF] uppercase tracking-wider font-bold">KANA</span>
                    <span className="text-[10px] text-[#4a4a5a]">{formatTime(message.timestamp)}</span>
                    <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 text-[8px] text-[#9945FF]/90 font-medium border border-[#9945FF]/20">AI</span>
                  </div>
                  <div className="relative p-3 rounded-xl rounded-tl-sm bg-gradient-to-br from-[#9945FF]/10 via-[#9945FF]/5 to-transparent border border-[#9945FF]/20 text-[#e0e0e0] whitespace-pre-wrap shadow-[0_2px_15px_rgba(153,69,255,0.08)]">
                    {message.content}
                    {/* Message Actions - Kana */}
                    <div className="absolute -bottom-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(message.content, message.id) }}
                        className="p-1 rounded bg-[#1a1a25] border border-[#2a2a35] text-[9px] hover:border-[#9945FF]/50 transition-colors"
                        title="Copy"
                      >
                        {copiedMessageId === message.id ? '✓' : '📋'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleReaction(message.id, 'liked') }}
                        className={`p-1 rounded bg-[#1a1a25] border text-[9px] transition-colors ${message.reactions?.liked ? 'border-[#9945FF] text-[#9945FF]' : 'border-[#2a2a35] hover:border-[#9945FF]/50'}`}
                        title="Like"
                      >
                        {message.reactions?.liked ? '💜' : '🤍'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="shrink-0 size-8 rounded-lg bg-gradient-to-br from-[#9945FF]/30 to-[#14F195]/20 border border-[#9945FF]/40 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(153,69,255,0.2)]">
              <img src="/kana-logo.png" alt="KANA" className="size-full object-cover" />
            </div>
            <div className="flex-1 max-w-[85%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-[#9945FF] uppercase tracking-wider font-bold">KANA</span>
                <span className="text-[10px] text-[#9945FF]/50 animate-pulse">analyzing...</span>
              </div>
              <div className="p-3 rounded-xl rounded-tl-sm bg-gradient-to-br from-[#9945FF]/10 via-[#9945FF]/5 to-transparent border border-[#9945FF]/20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-[#9945FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="size-2 rounded-full bg-[#9945FF]/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="size-2 rounded-full bg-[#9945FF]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] text-[#9945FF]/50 font-mono">Formulating response...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-32 right-8 z-50 p-2 rounded-full bg-[#9945FF]/90 border border-[#9945FF] text-white shadow-[0_0_20px_rgba(153,69,255,0.4)] hover:bg-[#9945FF] hover:scale-110 transition-all animate-fadeIn"
            title="Scroll to bottom"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-[#1a1a25] bg-gradient-to-r from-[#0d0d12] via-[#0f0f18] to-[#12121a]">
        {/* Quick Commands Bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1a1a25]/50 overflow-x-auto scrollbar-hide">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd.cmd}
              type="button"
              onClick={() => sendQuickMessage(cmd.cmd)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] bg-[#1a1a25]/50 border border-[#2a2a35] text-[#6a6a7a] hover:border-[#9945FF]/40 hover:text-[#9945FF] hover:bg-[#9945FF]/5 transition-all whitespace-nowrap group"
            >
              <span className="opacity-60 group-hover:opacity-100">{cmd.icon}</span>
              <span>{cmd.label}</span>
            </button>
          ))}
          <div className="h-4 w-px bg-[#2a2a35] mx-1" />
          <span className="text-[9px] text-[#4a4a5a] whitespace-nowrap">↑↓ History</span>
        </div>

        {/* Input Box */}
        <div className="p-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#08080c] border border-[#1a1a25] focus-within:border-[#9945FF]/50 focus-within:shadow-[0_0_20px_rgba(153,69,255,0.1)] transition-all">
            <span className="text-[#14F195] font-bold text-sm">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask KANA anything..."
              className="flex-1 bg-transparent text-sm text-[#e0e0e0] placeholder:text-[#4a4a5a] outline-none caret-[#9945FF]"
              autoFocus
            />
            {input.length > 0 && (
              <span className="text-[9px] text-[#4a4a5a] tabular-nums">{input.length}/500</span>
            )}
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] text-xs text-[#050505] font-bold hover:opacity-90 hover:shadow-[0_0_20px_rgba(153,69,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              {isTyping ? (
                <>
                  <span className="size-3 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                  <span>WAIT</span>
                </>
              ) : (
                <>
                  <span>SEND</span>
                  <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 pb-3 flex items-center justify-between text-[10px] text-[#4a4a5a]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[#1a1a25] border border-[#2a2a35] text-[9px]">Enter</kbd>
              <span>send</span>
            </span>
            <span className="text-[#2a2a35]">|</span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[#1a1a25] border border-[#2a2a35] text-[9px]">↑</kbd>
              <span>history</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {commandHistory.length > 0 && (
              <span className="text-[#3a3a4a]">{commandHistory.length} in history</span>
            )}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#14F195]/10 border border-[#14F195]/20">
              <span className="size-1.5 rounded-full bg-[#14F195] animate-pulse"></span>
              <span className="text-[#14F195]/80">Mainnet</span>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(153, 69, 255, 0.3); }
          50% { box-shadow: 0 0 20px rgba(153, 69, 255, 0.5); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default memo(KanaTerminal)
