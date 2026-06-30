import { useState } from 'react'
import HighlightedText from './HighlightedText'
import VoiceReaderButton from './VoiceReaderButton'
import { useSpeech } from '../context/SpeechContext'

const TABS = [
  { id: 'fan', icon: '⚽', label: 'Fan view' },
  { id: 'ref', icon: '🧑‍⚖️', label: 'Referee view' },
  { id: 'camera', icon: '📺', label: 'Broadcast view' },
  { id: 'rule', icon: '📜', label: 'Rule book view' },
]

export default function PerspectiveSwitch({ result, speakTexts = {} }) {
  const [active, setActive] = useState('fan')
  const { isActive, highlightRange } = useSpeech()

  const views = {
    fan: {
      title: 'What fans react to',
      body: result.description,
      bullets: result.why_fans_disagree_bullets || [
        `${result.fan_yes_pct}% voted yes — gut reaction drives the argument`,
        'Slow-motion replays shape emotional outrage',
        'Team loyalty colours every judgment',
      ],
    },
    ref: {
      title: 'Referee perspective',
      body: result.referee_perspective,
      bullets: result.referee_context
        ? [
            `Position: ${result.referee_context.referee_position}`,
            `Angle: ${result.referee_context.view_angle}`,
            `Decision window: ${result.referee_context.decision_time_seconds}s`,
            `Pressure: ${result.referee_context.pressure}`,
          ]
        : [],
    },
    camera: {
      title: 'What TV showed — and hid',
      body: result.camera_analysis,
      bullets: result.camera_missed_bullets || [],
    },
    rule: {
      title: 'Rule explanation',
      body: result.rule_explanation,
      bullets: [
        result.rule_citation,
        ...(result.rules_used || []).slice(0, 2),
      ].filter(Boolean),
    },
  }

  const view = views[active]
  const voiceMap = {
    fan: { id: 'perspective-fan', text: speakTexts.fan },
    ref: { id: 'referee-perspective', text: speakTexts.referee },
    camera: { id: 'perspective-camera', text: speakTexts.camera },
    rule: { id: 'rule-explanation', text: speakTexts.rule },
  }
  const voice = voiceMap[active]
  const narrating = voice?.id ? isActive(voice.id) : false

  return (
    <div className="animate-fade-up bg-pitch-800 border border-pitch-600 rounded-xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-pitch-600" role="tablist" aria-label="Perspective views">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 min-w-[100px] px-3 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-gold/50 ${
              active === tab.id
                ? 'bg-accent-gold/15 text-accent-gold border-b-2 border-accent-gold'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6" role="tabpanel">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-white">{view.title}</h3>
          {voice?.text && (
            <VoiceReaderButton sectionId={voice.id} speakText={voice.text} />
          )}
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          <HighlightedText text={view.body} highlightRange={highlightRange} isActive={narrating} />
        </p>
        {view.bullets.length > 0 && (
          <ul className="space-y-2">
            {view.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-400">
                <span className="text-accent-gold shrink-0">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
