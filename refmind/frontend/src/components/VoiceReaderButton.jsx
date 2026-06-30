import { useSpeech } from '../context/SpeechContext'

function IconSpeaker() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5L6 9H3v6h3l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function VoiceReaderButton({ sectionId, speakText, label = 'Listen to explanation' }) {
  const { activeId, status, error, speak, pause, resume, stop, isActive } = useSpeech()
  const mine = isActive(sectionId)
  const busy = status === 'loading' && mine

  const handlePlay = () => {
    if (mine && status === 'playing') {
      pause()
      return
    }
    if (mine && status === 'paused') {
      resume()
      return
    }
    speak(sectionId, speakText)
  }

  const handleStop = (e) => {
    e.stopPropagation()
    stop()
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handlePlay}
        disabled={busy}
        title={label}
        aria-label={label}
        className={`p-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 ${
          mine
            ? 'border-accent-gold bg-accent-gold/20 text-accent-gold'
            : 'border-pitch-600 text-gray-400 hover:text-accent-gold hover:border-accent-gold/50'
        }`}
      >
        {busy ? (
          <span className="block w-[18px] h-[18px] border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
        ) : (
          <IconSpeaker />
        )}
      </button>
      {mine && (status === 'playing' || status === 'paused') && (
        <button
          type="button"
          onClick={handleStop}
          title="Stop narration"
          aria-label="Stop narration"
          className="px-2 py-1 text-xs rounded-md border border-pitch-600 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
        >
          Stop
        </button>
      )}
      {mine && status === 'playing' && (
        <span className="text-[10px] text-accent-gold uppercase tracking-wider hidden sm:inline">
          Playing
        </span>
      )}
      {mine && status === 'paused' && (
        <span className="text-[10px] text-gray-400 uppercase tracking-wider hidden sm:inline">
          Paused
        </span>
      )}
      {error && mine && (
        <span className="text-[10px] text-accent-red" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
