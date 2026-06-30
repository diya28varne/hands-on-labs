const TRUST_KEY = 'refmind_trust'

export function loadTrustSession() {
  try {
    return JSON.parse(
      localStorage.getItem(TRUST_KEY) || '{"ratings":[],"startAvg":null}',
    )
  } catch {
    return { ratings: [], startAvg: null }
  }
}

export function saveTrustRating(incidentId, stars) {
  const session = loadTrustSession()
  const ratings = session.ratings.filter((r) => r.incidentId !== incidentId)
  ratings.push({ incidentId, stars, at: Date.now() })
  const next = { ...session, ratings }
  if (session.startAvg === null && ratings.length === 1) {
    next.startAvg = stars
  }
  localStorage.setItem(TRUST_KEY, JSON.stringify(next))
  return computeTrustStats(next)
}

export function computeTrustStats(session = loadTrustSession()) {
  const { ratings, startAvg } = session
  if (!ratings.length) return { currentAvg: 0, delta: 0, count: 0 }
  const currentAvg =
    Math.round((ratings.reduce((s, r) => s + r.stars, 0) / ratings.length) * 10) / 10
  const baseline = startAvg ?? ratings[0].stars
  const delta = Math.round(((currentAvg - baseline) / baseline) * 100)
  return { currentAvg, delta, count: ratings.length, baseline }
}
