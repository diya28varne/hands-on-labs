import { useState } from 'react'

function ComingSoonModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-pitch-900/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="future-scope-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-accent-gold/30 bg-pitch-800 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] uppercase tracking-widest text-accent-gold font-semibold mb-2">
          Future scope
        </p>
        <h3 id="future-scope-modal-title" className="font-display text-xl font-bold text-white mb-3">
          Live match analysis is on the way
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          RefMind will soon let you upload or pick a clip from an ongoing match and get the same
          rule-based, transparent referee breakdown — in seconds, not after the final whistle.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-accent-gold text-pitch-900 font-semibold hover:bg-yellow-400 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default function FutureScope() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section
        className="mt-8 animate-fade-up rounded-xl border border-dashed border-pitch-600 bg-pitch-800/40 overflow-hidden"
        aria-labelledby="future-scope-heading"
      >
        <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0" aria-hidden="true">
              🚀
            </span>
            <h3 id="future-scope-heading" className="text-sm font-semibold text-white">
              Future scope
            </h3>
          </div>
          <span className="shrink-0 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-accent-gold/40 bg-accent-gold/10 text-accent-gold font-semibold">
            Beta
          </span>
        </div>

        <div className="mx-5 mb-4 rounded-lg border border-accent-gold/25 bg-accent-gold/5 px-4 py-3">
          <p className="text-sm font-semibold text-white mb-1">
            Coming soon: Live match analysis
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Upload or select a current match incident to get instant referee explanations.
          </p>
        </div>

        <div className="mx-5 mb-5 rounded-lg border border-pitch-600 bg-pitch-900/50 px-4 py-4">
          <p className="text-[10px] uppercase tracking-widest text-accent-gold/80 font-semibold mb-2">
            Today&apos;s controversial incident
          </p>
          <p className="text-sm text-gray-300 leading-relaxed mb-1">
            Analyze live controversial moments from ongoing matches.
          </p>
          <p className="text-xs text-gray-500 italic mb-4">
            No live feed connected — demo uses archived World Cup &amp; Euro incidents above.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full py-2.5 rounded-lg border border-pitch-600 text-sm text-gray-300 hover:border-accent-gold/50 hover:text-accent-gold transition-colors"
          >
            Preview live analysis →
          </button>
        </div>
      </section>

      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}
    </>
  )
}
