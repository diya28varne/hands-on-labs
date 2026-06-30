const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  getIncidents: () => request('/incidents'),
  getIncident: (id) => request(`/incidents/${id}`),
  submitVote: (id, userVote) =>
    request(`/incidents/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ user_vote: userVote }),
    }),
  analyze: (id, userVote) =>
    request(`/incidents/${id}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ user_vote: userVote }),
    }),
  mindChange: (id, body) =>
    request(`/incidents/${id}/mind-change`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  askRef: (incidentId, question, analysisContext) =>
    request('/ask-ref', {
      method: 'POST',
      body: JSON.stringify({
        incident_id: incidentId,
        question,
        analysis_context: analysisContext,
      }),
    }),
  health: () => request('/health'),
}
