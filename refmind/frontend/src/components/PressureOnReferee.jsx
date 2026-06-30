export default function PressureOnReferee({ pressure, refereeContext }) {
  const ctx = pressure || {
    crowd: 'Thousands in the stadium',
    decision_time_seconds: refereeContext?.decision_time_seconds ?? 2,
    view_quality: refereeContext?.view_angle ?? 'Limited angle',
    stakes: refereeContext?.pressure ?? 'High-stakes match',
  }

  const stats = [
    { label: 'Decision time', value: `${ctx.decision_time_seconds}s`, icon: '⏱️' },
    { label: 'Crowd', value: ctx.crowd, icon: '🔊' },
    { label: 'Viewing angle', value: ctx.view_quality, icon: '👁️' },
    { label: 'Stakes', value: ctx.stakes, icon: '🏆' },
  ]

  return (
    <section
      className="animate-fade-up bg-pitch-800 border border-pitch-600 rounded-xl p-6"
      aria-labelledby="pressure-ref-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" aria-hidden="true">⚡</span>
        <h3 id="pressure-ref-heading" className="font-semibold text-lg text-accent-gold">
          Pressure on the referee
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-pitch-900/60 rounded-lg p-3">
            <p className="text-lg mb-1">{s.icon}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">{s.label}</p>
            <p className="text-sm text-gray-200 leading-snug mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 italic">
        No replay. No pause. This is what human referees face every match.
      </p>
    </section>
  )
}
