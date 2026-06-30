import HighlightedText from './HighlightedText'
import VoiceReaderButton from './VoiceReaderButton'
import { useSpeech } from '../context/SpeechContext'

export default function WhyFansDisagree({ bullets, narrative, speakText, delay = 800 }) {
  const items = bullets?.length ? bullets : narrative ? [narrative] : []
  const { isActive, highlightRange } = useSpeech()
  const active = isActive('why-fans-disagree')
  const fullText = speakText || items.join('. ')

  if (!items.length) return null

  return (
    <section
      className="animate-fade-up bg-pitch-800 border border-pitch-600 rounded-xl p-6"
      style={{ animationDelay: `${delay}ms` }}
      aria-labelledby="why-fans-disagree-heading"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">💬</span>
          <h3 id="why-fans-disagree-heading" className="font-semibold text-lg text-accent-gold">
            Why fans disagree
          </h3>
        </div>
        <VoiceReaderButton sectionId="why-fans-disagree" speakText={fullText} />
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
            <span className="text-gray-500 shrink-0 mt-0.5">•</span>
            <span>
              {active && i === 0 ? (
                <HighlightedText text={item} highlightRange={highlightRange} isActive={active} />
              ) : (
                item
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
