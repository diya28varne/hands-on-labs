import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const SpeechContext = createContext(null)

export function SpeechProvider({ children }) {
  const [activeId, setActiveId] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | playing | paused | error
  const [error, setError] = useState(null)
  const [highlightRange, setHighlightRange] = useState({ start: 0, end: 0 })
  const utteranceRef = useRef(null)
  const charIndexRef = useRef(0)
  const textRef = useRef('')

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis?.getVoices()
    loadVoices()
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    charIndexRef.current = 0
    setActiveId(null)
    setStatus('idle')
    setHighlightRange({ start: 0, end: 0 })
    setError(null)
  }, [])

  const speak = useCallback(
    (sectionId, text) => {
      if (!window.speechSynthesis) {
        setError('Speech not supported in this browser.')
        setStatus('error')
        return
      }
      if (!text?.trim()) {
        setError('Nothing to read aloud.')
        setStatus('error')
        return
      }

      stop()
      setActiveId(sectionId)
      setStatus('loading')
      setError(null)
      textRef.current = text

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1
      const voices = window.speechSynthesis.getVoices()
      const preferred =
        voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) ||
        voices.find((v) => v.lang.startsWith('en-GB')) ||
        voices.find((v) => v.lang.startsWith('en'))
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setStatus('playing')
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          charIndexRef.current = event.charIndex
          const end = event.charIndex + (event.charLength || 1)
          setHighlightRange({ start: event.charIndex, end })
        }
      }
      utterance.onend = () => {
        setStatus('idle')
        setActiveId(null)
        setHighlightRange({ start: 0, end: 0 })
        utteranceRef.current = null
      }
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          setError('Unable to play narration.')
          setStatus('error')
        }
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [stop],
  )

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setStatus('paused')
    }
  }, [])

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setStatus('playing')
    }
  }, [])

  const value = useMemo(
    () => ({
      activeId,
      status,
      error,
      highlightRange,
      textRef,
      speak,
      pause,
      resume,
      stop,
      isActive: (id) => activeId === id,
    }),
    [activeId, status, error, highlightRange, speak, pause, resume, stop],
  )

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
}

export function useSpeech() {
  const ctx = useContext(SpeechContext)
  if (!ctx) throw new Error('useSpeech must be used within SpeechProvider')
  return ctx
}
