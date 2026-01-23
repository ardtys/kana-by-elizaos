import { useState } from 'react'

const TestComponent = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="bento-card p-6">
      <h2 className="text-2xl font-bold text-warm-gold mb-4">
        React Test Component Working!
      </h2>
      <p className="text-foreground mb-4">
        If you see this, React is hydrating correctly.
      </p>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-warm-gold text-void-black rounded-lg font-mono hover:bg-cyan-glow transition-colors"
      >
        Click me! Count: {count}
      </button>
    </div>
  )
}

export default TestComponent
