import { useState } from 'react'
import { api } from '../api/client'

const SESSION_KEY = 'refmind_mind_changes'

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || '{"total":0,"changed":0}')
  } catch {
    return { total: 0, changed: 0 }
  }
}

function saveSession(stats) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(stats))
}

export default function ChangeDecisionPrompt({ incidentId, originalVote, onMindChange }) {
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleAnswer = async (changedMind) => {
    if (answered || loading) return
    setLoading(true)
    try {
      const data = await api.mindChange(incidentId, {
        original_vote: originalVote,
        changed_mind: changedMind,
        new_vote: changedMind ? !originalVote : originalVote,
      })
      const session = loadSession()
      const next = {
        total: session.total + 1,
        changed: session.changed + (changedMind ? 1 : 0),
      }
      saveSession(next)
      setResponse(data)
      setAnswered(true)
      onMindChange?.(changedMind, data)
    } catch {
      setResponse({
        changed_mind: changedMind,
        mind_change_pct: 51,
        message: changedMind
          ? 'You changed your mind — RefMind changed your understanding, not just your answer.'
          : 'You held your call — but many fans shift once they see the full context.',
      })
      setAnswered(true)
      onMindChange?.(changedMind, { mind_change_pct: 51 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-up bg-gradient-to-br from-pitch-800 to-pitch-900 border-2 border-accent-gold rounded-xl p-6">
      <p className="text-accent-gold text-sm uppercase tracking-widest mb-2 text-center">
        The moment of truth
      </p>
      <h3 className="text-xl font-bold text-white text-center mb-2">
        Now that you&apos;ve seen the referee&apos;s perspective…
      </h3>
      <p className="text-gray-300 text-center mb-6">Would you change your decision?</p>

      {!answered ? (
        <div className="flex gap-3 max-w-sm mx-auto">
          <button
            onClick={() => handleAnswer(true)}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-accent-gold text-pitch-900 font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            Yes
          </button>
          <button
            onClick={() => handleAnswer(false)}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border-2 border-pitch-600 text-gray-300 font-bold hover:bg-pitch-700 transition-colors disabled:opacity-50"
          >
            No
          </button>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <p className="text-3xl font-bold text-accent-gold">
            {response?.mind_change_pct ?? 51}%
          </p>
          <p className="text-white font-medium">
            of users changed their decision after understanding the context.
          </p>
          <p className="text-sm text-gray-400">
            {response?.changed_mind
              ? 'You\'re part of that shift — the camera lied, and now you know it.'
              : 'You kept your call. Even with context, honest disagreement remains.'}
          </p>
        </div>
      )}
    </div>
  )
}
