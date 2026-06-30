export default function RefereePerspectiveCard({ context, narrative, delay = 400 }) {
  if (!context) return null

  return (
    <div
      className="animate-fade-up bg-pitch-800 border border-pitch-600 rounded-xl p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">👁️</span>
        <h3 className="font-semibold text-lg text-accent-gold">Referee perspective</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="Position" value={context.referee_position} />
        <Stat label="Angle" value={context.view_angle} />
        <Stat label="Decision time" value={`${context.decision_time_seconds}s`} />
        <Stat label="Pressure" value={context.pressure} />
      </div>
      {narrative && (
        <p className="text-gray-300 text-sm leading-relaxed border-t border-pitch-600 pt-4">
          {narrative}
        </p>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-pitch-900/60 rounded-lg p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-200 leading-snug">{value}</p>
    </div>
  )
}
