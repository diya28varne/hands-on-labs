export default function RuleCitation({ citation, sources, explanation, delay = 200 }) {
  return (
    <div
      className="animate-fade-up bg-pitch-800 border border-pitch-600 rounded-xl p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">📜</span>
        <h3 className="font-semibold text-lg text-accent-gold">The rule applied</h3>
      </div>
      <p className="text-gray-300 leading-relaxed mb-4">{explanation}</p>
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-pitch-600">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Source</span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/40 text-accent-gold text-sm font-medium">
          {citation}
        </span>
        {sources?.map((s) => (
          <span
            key={s}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs text-gray-500 bg-pitch-900"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
