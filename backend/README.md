# AlignIQ Backend — Setup & Run Guide

A Flask-based AI career analysis API powering the AlignIQ platform.

## Prerequisites

- Python 3.8+
- `pip` (Python package manager)
- `git`

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AlignIQ/backend
```

### 2. Create & Activate Virtual Environment

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
```

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
FLASK_ENV=development
```

**Optional:** If deploying to Render.com:

```env
RENDER_EXTERNAL_URL=https://your-deployed-domain
```

### 5. Run the Development Server

```bash
python app.py
```

The server will start on `http://localhost:5000`.

---

## API Endpoints

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| `GET`  | `/`                    | Root info & available endpoints |
| `GET`  | `/api/health`          | Service health check            |
| `POST` | `/api/analyze`         | Full universal career analysis  |
| `GET`  | `/api/market-trends`   | Market overview data            |
| `GET`  | `/api/skill-resources` | Learning resources for skills   |

### Example Requests

**Health Check:**

```bash
curl http://localhost:5000/api/health
```

**Response:**

```json
{
  "status": "ok",
  "version": "2.0",
  "timestamp": "2026-03-21T12:34:56.789012"
}
```

---

## Project Structure

```
backend/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables (create this)
├── render.yaml              # Render deployment config
├── data/
│   └── career_dataset.csv   # Career data for analysis
├── model/
│   ├── __init__.py
│   └── train_model.py       # ML model training
└── modules/
    ├── __init__.py
    ├── ai_engine.py         # LLM integration (Groq)
    ├── cri_calculator.py    # Career Readiness Index
    ├── market_engine.py     # Job market data
    ├── profile_processor.py # Profile parsing
    └── resource_map.py      # Learning resource mapping
```

---

## Production Deployment

### Using Gunicorn (WSGI Server)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

- `-w 4`: 4 worker processes
- `-b 0.0.0.0:8000`: Bind to all interfaces on port 8000

### Using Render.com

1. Push code to GitHub
2. Connect repo to [Render.com](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
5. Set environment variables in Render dashboard (e.g., `GROQ_API_KEY`)

---

## Troubleshooting

| Issue                                          | Solution                                                     |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `ModuleNotFoundError: No module named 'flask'` | Run `pip install -r requirements.txt` inside active venv     |
| Port 5000 already in use                       | Change `PORT=5001` in `.env` or kill the process             |
| `.env` file not found                          | Create `.env` in the `backend/` directory (not project root) |
| API endpoints return 500 errors                | Check backend logs for missing dependencies or data files    |

---

## Development Tips

- **Reload on changes**: Flask auto-reloads when `FLASK_ENV=development`
- **Debug mode**: Add `FLASK_DEBUG=1` to `.env`
- **Logging**: Check terminal output for request logs and errors
- **Test locally**: Use `curl`, Postman, or the frontend to test endpoints

---

## Next Steps

1. Ensure all dependencies install without errors
2. Run `python app.py` and verify `/api/health` returns `{"status": "ok"}`
3. Connect the frontend to `http://localhost:5000`
4. Deploy to Render or your preferred hosting platform

---

**Need help?** Check the main [README.md](../README.md) or contact the development team.
