function MeterBar({ label, hint, value, valueLabel, barClass, textClass }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-400" title={hint}>
          {label}
        </span>
        <span className={`font-bold ${textClass}`}>{valueLabel}</span>
      </div>
      <div
        className="h-3 rounded-full bg-pitch-700 overflow-hidden"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${valueLabel}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barClass}`}
          style={{ width: `${value}%`, opacity: 0.85 }}
        />
      </div>
    </div>
  )
}

export default function EmotionRuleMeter({ emotionRule }) {
  if (!emotionRule) return null

  const { emotion_label, rule_label, emotion_pct, rule_pct } = emotionRule

  return (
    <section
      className="animate-fade-up bg-pitch-800 border-2 border-pitch-600 rounded-xl p-6"
      aria-labelledby="emotion-rule-heading"
    >
      <p
        id="emotion-rule-heading"
        className="text-center text-gray-400 text-sm uppercase tracking-widest mb-4"
      >
        Emotion vs rule
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="text-center p-4 rounded-lg bg-accent-red/10 border border-accent-red/30">
          <p className="text-xs text-gray-500 mb-1">Emotional reaction</p>
          <p className="text-accent-red font-bold text-lg">{emotion_label}</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-accent-green/10 border border-accent-green/30">
          <p className="text-xs text-gray-500 mb-1">Rule-based reading</p>
          <p className="text-accent-green font-bold text-lg">{rule_label}</p>
        </div>
      </div>
      <div className="space-y-4">
        <MeterBar
          label="Fan yes vote"
          hint="Percentage of fans who voted yes (foul / penalty / offside)"
          value={emotion_pct}
          valueLabel={`${emotion_pct}%`}
          barClass="bg-accent-red"
          textClass="text-accent-red"
        />
        <MeterBar
          label="AI rule confidence"
          hint="How confident the AI is in the rule-based verdict"
          value={rule_pct}
          valueLabel={`${rule_pct}%`}
          barClass="bg-accent-green"
          textClass="text-accent-green"
        />
      </div>
      <p className="text-xs text-gray-500 mt-4 italic text-center">
        Red = crowd yes vote. Green = AI confidence in the rule-based call. The gap is why RefMind
        exists.
      </p>
    </section>
  )
}
