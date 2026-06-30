export default function ProgressBar({ incidentIndex = 0, totalIncidents = 1 }) {
  if (totalIncidents <= 0) return null

  return (
    <div
      className="flex items-center gap-1 mb-8"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalIncidents}
      aria-valuenow={incidentIndex + 1}
      aria-label={`Incident ${incidentIndex + 1} of ${totalIncidents}`}
    >
      {Array.from({ length: totalIncidents }, (_, i) => {
        const reached = i <= incidentIndex
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1 w-full rounded-full transition-all duration-500 ${
                reached ? 'bg-accent-gold' : 'bg-pitch-700'
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-wider hidden sm:block ${
                reached ? 'text-accent-gold' : 'text-gray-500'
              }`}
            >
              {i + 1}
            </span>
          </div>
        )
      })}
    </div>
  )
}
