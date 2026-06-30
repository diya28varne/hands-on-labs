# RefMind

> *"You saw what the referee saw. Now understand why you disagreed."*

**Don't just watch the match. Understand the moment.**

RefMind is an AI experience for the IBM SkillsBuild AI Builders Challenge. Users vote on controversial referee decisions *before* seeing the answer — then get fan splits, IFAB-grounded rule explanations, camera blind-spot analysis, and an honest verdict.

## Stack

| Layer | Tool |
|-------|------|
| Frontend | React + Tailwind + Vite |
| Backend | FastAPI |
| LLM | IBM Granite (via watsonx.ai) |
| RAG | LangChain + Chroma |
| PDF ingestion | Docling |

## Quick start

### 1. Backend

```bash
cd refmind/backend
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
copy .env.example .env

# Start API (demo mode works without API keys)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd refmind/frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### 3. Connect Watsonx Granite (Hour 3)

1. Open [watsonx.ai](https://dataplatform.cloud.ibm.com/) and create a **project**.
2. Copy your **Project ID** from the project settings.
3. Create an **API key**: IBM Cloud → Manage → Access (IAM) → API keys → Create.
4. Edit `backend/.env`:

```env
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
DEMO_MODE=false
```

5. Test the connection:

```bash
cd refmind/backend
python -m app.scripts.test_granite
```

6. Restart the API server, then check:

```bash
curl http://127.0.0.1:8000/health/granite
```

When live, `/health` returns `"granite_live": true` and analysis responses include `"demo_mode": false`.

## Ingest IFAB rule PDFs (Docling)

Official PDF already downloaded to `backend/data/rules/ifab-laws-2024-25.pdf`.

**Re-download** (if needed):

```bash
cd refmind/backend
python -m app.ingest.download_rules
```

**Ingest** (stop the API server first — Chroma file lock):

```bash
cd refmind/backend
python -m app.ingest.ingest_rules
```

Expected output: ~60 chunks tagged by topic (handball, offside, penalty foul, VAR).

Docling uses `do_ocr=False` because IFAB PDFs have embedded text; OCR on the full double-page edition causes memory errors on laptops.

## Core loop

```
User votes YES/NO
      ↓
Fan % reveal
      ↓
Rule explanation (RAG on IFAB)
      ↓
What the referee saw
      ↓
What the camera hid
      ↓
Honest verdict: Correct / Defensible but debatable / Likely wrong
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | API status + Granite mode |
| GET | `/incidents` | List incidents (no spoilers) |
| GET | `/incidents/{id}` | Single incident for voting |
| POST | `/incidents/{id}/vote` | Fan % after user vote |
| POST | `/incidents/{id}/analyze` | Full AI analysis |

## Team ownership

| Person | Owns |
|--------|------|
| AI & Backend | Docling ingestion, LangChain RAG, Granite prompts |
| Data | `app/data/incidents.json` — add real incidents + fan % |
| Frontend | React voting + reveal screens |
| Demo & Pitch | 90-second judge script (see below) |

## 90-second demo script

1. *"Everyone remember this handball in the World Cup?"* — show Argentina 2022 incident.
2. *"You have 5 seconds — was it a handball? Vote now."*
3. *"62% of fans said yes. You agreed with most people."*
4. *"Here's what the referee actually saw — and why the rule says something different."*
5. *"Here's what the broadcast camera physically couldn't show."*
6. *"Our verdict: Defensible but genuinely debatable. Here's why two professional referees would disagree."*

## MVP checklist

- [x] 5 controversial incidents in JSON
- [x] User voting screen
- [x] Fan percentage reveal
- [x] RAG on IFAB rules (seed + Docling PDF path)
- [x] Referee perspective + camera blind-spot analysis
- [x] Honest verdict with confidence level
- [x] Demo mode (no API key required)

## Project structure

```
refmind/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI routes
│   │   ├── config.py
│   │   ├── data/
│   │   │   ├── incidents.json   # 5 demo incidents
│   │   │   └── seed_rules.py    # IFAB rule snippets
│   │   ├── ingest/
│   │   │   └── ingest_rules.py  # Docling PDF → Chroma
│   │   └── services/
│   │       ├── analyzer.py      # Granite reasoning
│   │       ├── incidents.py
│   │       └── rag.py           # LangChain + Chroma
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── VotingScreen.jsx
            └── RevealScreen.jsx
```
