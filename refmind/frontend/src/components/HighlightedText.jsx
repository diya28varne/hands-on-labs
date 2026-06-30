export default function HighlightedText({ text, highlightRange, isActive }) {
  if (!text) return null
  if (!isActive || !highlightRange?.end) {
    return <span>{text}</span>
  }

  const { start, end } = highlightRange
  const before = text.slice(0, start)
  const current = text.slice(start, end)
  const after = text.slice(end)

  return (
    <span>
      {before}
      <mark className="bg-accent-gold/40 text-white rounded px-0.5">{current}</mark>
      {after}
    </span>
  )
}
