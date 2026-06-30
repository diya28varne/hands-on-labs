export default function DebateMode({ splitVerdict }) {
  if (!splitVerdict?.ref_a || !splitVerdict?.ref_b) return null

  const forArg = splitVerdict.ref_a
  const againstArg = splitVerdict.ref_b

  return (
    <section className="space-y-4 animate-fade-up" aria-labelledby="debate-mode-heading">
      <p
        id="debate-mode-heading"
        className="text-center text-gray-400 text-sm uppercase tracking-widest"
      >
        Debate mode — both sides honestly argued
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-pitch-800 border-l-4 border-accent-red rounded-xl p-5">
          <p className="text-accent-red text-xs font-bold uppercase tracking-wider mb-2">
            Argument for the call
          </p>
          <p className="text-white font-bold mb-2">{forArg.call}</p>
          <p className="text-gray-400 text-sm leading-relaxed">{forArg.reasoning}</p>
        </div>
        <div className="bg-pitch-800 border-l-4 border-accent-green rounded-xl p-5">
          <p className="text-accent-green text-xs font-bold uppercase tracking-wider mb-2">
            Argument against the call
          </p>
          <p className="text-white font-bold mb-2">{againstArg.call}</p>
          <p className="text-gray-400 text-sm leading-relaxed">{againstArg.reasoning}</p>
        </div>
      </div>
    </section>
  )
}
