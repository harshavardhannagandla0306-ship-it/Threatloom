"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [email, setEmail] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.status === "healthy" ? "Online" : "Offline");
      })
      .catch(() => {
        setBackendStatus("Offline");
      });
  }, []);

  const analyzeEmail = async () => {
    if (!email.trim()) {
      setAnalysis("Please paste an email first.");
      return;
    }
  
    setAnalysis("Analyzing email...");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();

setHeaders(data.headers || {});

setAnalysis(
  `Analysis complete. Threat Score: ${data.threat_score}`
);
    } catch (error) {
      setAnalysis("Backend connection failed.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">🛡️ MailTrace AI</h1>
            <p className="text-sm text-slate-400">
              Email Threat Detection & Forensics Intelligence
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="text-sm">
              Backend: {backendStatus}
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Email Security Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            Analyze suspicious emails and investigate potential threats.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h3 className="mb-2 text-xl font-semibold">
              📧 Analyze Email
            </h3>

            <p className="mb-4 text-sm text-slate-400">
              Paste the email content or headers below.
            </p>

            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-64 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              placeholder="Paste email headers or email content here..."
            />

            <button
              onClick={analyzeEmail}
              className="mt-4 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              🔍 Analyze Email
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">
              ⚠️ Threat Score
            </h3>

            <div className="mt-8 text-center">
              <div className="text-6xl font-bold text-green-400">
                --
              </div>

              <p className="mt-3 text-slate-400">
                {analysis || "Waiting for analysis"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <SecurityCard
            title="SPF"
            icon="🔐"
            status="Not analyzed"
          />

          <SecurityCard
            title="DKIM"
            icon="🔑"
            status="Not analyzed"
          />

          <SecurityCard
            title="DMARC"
            icon="🛡️"
            status="Not analyzed"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Extracted email headers */}
<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
  <h3 className="text-xl font-semibold">
    📋 Email Headers
  </h3>

  {Object.keys(headers).length === 0 ? (
    <p className="mt-4 text-sm text-slate-400">
      No headers extracted yet. Analyze an email to see them here.
    </p>
  ) : (
    <div className="mt-4 space-y-3">
      {Object.entries(headers).map(([name, value]) => (
        <div
          key={name}
          className="rounded-lg border border-slate-800 bg-slate-950 p-3"
        >
          <p className="text-xs uppercase text-slate-500">
            {name}
          </p>

          <p className="mt-1 break-all text-sm text-slate-200">
            {value}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
          <InfoCard
            title="🌐 IP & Geolocation"
            description="Origin IP, approximate location, ISP and network information will appear here after analysis."
          />

          <InfoCard
            title="🔎 Forensic Intelligence"
            description="SMTP relay path, sender infrastructure, domain information and investigation results will appear here."
          />
        </div>
      </section>
    </main>
  );
}

function SecurityCard({
  title,
  icon,
  status,
}: {
  title: string;
  icon: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {icon} {title}
        </h3>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
          Pending
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {status}
      </p>
    </div>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}