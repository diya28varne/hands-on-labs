export default function VotingScreen({ incident, onVote, loading }) {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <p className="text-accent-gold text-sm font-medium uppercase tracking-widest mb-2">
          {incident.match} · {incident.minute}'
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">
          {incident.title}
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed">{incident.description}</p>
        {incident.video_hint && (
          <p className="text-gray-500 text-sm mt-3 italic">{incident.video_hint}</p>
        )}
      </div>

      <div className="bg-pitch-800 border border-pitch-600 rounded-2xl p-8 text-center vote-pulse">
        <p className="text-xl font-semibold mb-2">{incident.question}</p>
        <p className="text-accent-gold text-sm mb-8">{incident.user_vote_prompt}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onVote(true)}
            disabled={loading}
            className="flex-1 max-w-[180px] py-4 px-6 rounded-xl bg-accent-green/20 border-2 border-accent-green text-accent-green font-bold text-lg hover:bg-accent-green hover:text-pitch-900 transition-all disabled:opacity-50"
          >
            YES
          </button>
          <button
            onClick={() => onVote(false)}
            disabled={loading}
            className="flex-1 max-w-[180px] py-4 px-6 rounded-xl bg-accent-red/20 border-2 border-accent-red text-accent-red font-bold text-lg hover:bg-accent-red hover:text-white transition-all disabled:opacity-50"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  )
}
