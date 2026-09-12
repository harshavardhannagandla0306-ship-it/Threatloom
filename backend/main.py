from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="MailTrace AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmailRequest(BaseModel):
    email: str


@app.get("/")
def root():
    return {"message": "MailTrace AI backend is running!"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analyze")
def analyze_email(request: EmailRequest):
    email_text = request.email

    headers = {}

    for line in email_text.splitlines():
        if ":" in line:
            name, value = line.split(":", 1)
            name = name.strip().lower()

            if name in [
                "from",
                "to",
                "subject",
                "date",
                "return-path",
                "reply-to",
            ]:
                headers[name] = value.strip()

    return {
        "message": "Email analyzed successfully.",
        "headers": headers,
        "threat_score": 0,
        "status": "analysis_ready",
    }