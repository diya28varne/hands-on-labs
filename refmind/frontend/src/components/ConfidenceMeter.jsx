const VERDICT_META = {
  Correct: { emoji: '🟢', color: 'text-accent-green', bar: 'bg-accent-green' },
  'Defensible but debatable': { emoji: '🟡', color: 'text-accent-gold', bar: 'bg-accent-gold' },
  'Likely wrong': { emoji: '🔴', color: 'text-accent-red', bar: 'bg-accent-red' },
}

export default function ConfidenceMeter({ verdict, confidencePct, confidenceLabel }) {
  const meta = VERDICT_META[verdict] || VERDICT_META['Defensible but debatable']
  const pct = confidencePct ?? 63

  return (
    <div className="mt-4 pt-4 border-t border-pitch-600/50">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-400">AI confidence in this verdict</span>
        <span className={`font-bold ${meta.color}`}>{pct}%</span>
      </div>
      <div className="relative h-2 rounded-full bg-pitch-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${meta.bar}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white shadow-lg transition-all duration-1000"
          style={{ left: `calc(${pct}% - 1px)` }}
          title={`${pct}%`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
        <span>0%</span>
        <span className="text-gray-500 capitalize">{confidenceLabel} certainty</span>
        <span>100%</span>
      </div>
      <p className="text-xs text-gray-500 mt-2 italic">
        Lower confidence = honest uncertainty. RefMind never pretends to be 100% sure on borderline calls.
      </p>
    </div>
  )
}

export { VERDICT_META }
