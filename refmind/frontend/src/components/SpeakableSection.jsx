import HighlightedText from './HighlightedText'
import VoiceReaderButton from './VoiceReaderButton'
import { useSpeech } from '../context/SpeechContext'

export default function SpeakableSection({
  sectionId,
  icon,
  title,
  speakText,
  children,
  className = 'bg-pitch-800 border border-pitch-600',
  delay = 0,
}) {
  const { isActive, highlightRange } = useSpeech()
  const active = isActive(sectionId)

  return (
    <section
      className={`animate-fade-up rounded-xl p-6 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-labelledby={`${sectionId}-heading`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden="true">
            {icon}
          </span>
          <h3
            id={`${sectionId}-heading`}
            className="font-semibold text-lg text-accent-gold"
          >
            {title}
          </h3>
        </div>
        <VoiceReaderButton sectionId={sectionId} speakText={speakText} />
      </div>
      <div className="text-gray-300 leading-relaxed">
        {typeof children === 'string' ? (
          <HighlightedText text={children} highlightRange={highlightRange} isActive={active} />
        ) : (
          children
        )}
      </div>
    </section>
  )
}
