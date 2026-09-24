"use client";
import React, { useState } from "react";
import { getClient, CONTRACT_ADDRESS, NETWORK_CONFIG } from "../../lib/contract";
import Link from "next/link";

export default function MerchantPage() {
  const [activeModule, setActiveModule] = useState<"authority" | "flag" | "catalog" | "session">("authority");

  const [merchantKey, setMerchantKey] = useState("");
  const [minRating, setMinRating] = useState(1);
  const [loadingMerchant, setLoadingMerchant] = useState(false);

  const [flagCommitment, setFlagCommitment] = useState("");
  const [loadingFlag, setLoadingFlag] = useState(false);

  const [newMerchantId, setNewMerchantId] = useState("merchant_apple_electronics_2027");
  const [resetMinRating, setResetMinRating] = useState(1);
  const [loadingReset, setLoadingReset] = useState(false);

  const [loadingSession, setLoadingSession] = useState(false);

  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const addLog = (msg: string, type = "info") => setLogs((l) => [...l, { msg, type }]);
  const isLoading = loadingMerchant || loadingFlag || loadingReset || loadingSession;

  const handleSetMerchantCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMerchant(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet session via DApp Connector...", "info");
      addLog("> [ZK WITNESS] Compiling merchantSigningKey() witness in private memory enclave...", "info");
      addLog(`> [CIRCUIT] Invoking setMerchantCommitment(Uint<32>) — minimumRating=${minRating}...`, "info");

      const client = getClient();
      client.setMerchantKey(merchantKey || "merchant_default_private_key");
      const res = await client.setMerchantCommitment(minRating);

      setResult({ ...res, circuit: "setMerchantCommitment(Uint<32>)" });
      addLog(`> [SUCCESS] Merchant authority commitment anchored on-chain!`, "success");
      addLog(`> [COMMITMENT] Brand Anchor: ${res.merchantCommitment}`, "success");
      addLog(`> [POLICY] Minimum accepted review score set to ${res.newMinimumRating} Stars`, "success");
      addLog(`> [TX HASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingMerchant(false);
    }
  };

  const handleFlagFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingFlag(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Verifying merchant cryptographic credentials...", "info");
      addLog("> [ZK WITNESS] Generating merchantSigningKey() witness to authorize review dispute...", "info");
      addLog(`> [CIRCUIT] Executing flagFeedback(Bytes<32>) for commitment...`, "info");

      const client = getClient();
      client.setMerchantKey(merchantKey || "merchant_default_private_key");
      const res = await client.flagFeedback(flagCommitment);

      setResult({ ...res, circuit: "flagFeedback(Bytes<32>)" });
      addLog(`> [SUCCESS] Malicious review commitment successfully flagged on Midnight ledger!`, "success");
      addLog(`> [FLAGGED COMMITMENT] ${res.flaggedCommitment}`, "success");
      addLog(`> [TX HASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingFlag(false);
    }
  };

  const handleResetCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingReset(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Network...", "info");
      addLog(`> [CIRCUIT] Invoking resetMerchantProduct("${newMerchantId}", minRating=${resetMinRating})...`, "info");

      const client = getClient();
      const res = await client.resetMerchantProduct(newMerchantId, resetMinRating);

      setResult({ ...res, circuit: "resetMerchantProduct(Bytes<32>, Uint<32>)" });
      addLog(`> [SUCCESS] Merchant catalog rotated on-chain!`, "success");
      addLog(`> [MERCHANT ID] ${res.newMerchantId}`, "success");
      addLog(`> [MIN RATING] ${res.newMinimumRating} Stars`, "success");
      addLog(`> [TX HASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingReset(false);
    }
  };

  const handleIncrementSession = async () => {
    setLoadingSession(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Requesting epoch nonce bump...", "info");
      addLog("> [CIRCUIT] Executing incrementSession() to advance anti-replay epoch...", "info");

      const client = getClient();
      const res = await client.incrementSession();

      setResult({ ...res, circuit: "incrementSession()" });
      addLog(`> [SUCCESS] Active session epoch incremented on Midnight Preview ledger!`, "success");
      addLog(`> [TX HASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingSession(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <span className="badge badge-purple">Merchant Authority</span>
          <span className="badge badge-emerald">On-Chain Moderation</span>
          <span className="badge badge-cyan">Midnight Preview</span>
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
          Merchant Governance Center
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "660px", margin: "0.5rem auto 0" }}>
          Manage catalog review policies, anchor cryptographic brand authority, flag disputed reviews, and rotate catalog seasons via Midnight smart contract circuits.
        </p>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "inline-flex",
            background: "rgba(15, 23, 42, 0.8)",
            padding: "0.35rem",
            borderRadius: "50px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginTop: "1.75rem",
            gap: "0.35rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { id: "authority", label: "👑 Anchor Authority", color: "#10b981" },
            { id: "flag", label: "🚫 Flag Dispute", color: "#ef4444" },
            { id: "catalog", label: "🔄 Catalog Epoch", color: "#f59e0b" },
            { id: "session", label: "⏱️ Anti-Replay", color: "#06b6d4" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveModule(tab.id as any);
                setResult(null);
              }}
              style={{
                padding: "0.55rem 1.4rem",
                borderRadius: "50px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                transition: "all 0.25s ease",
                background: activeModule === tab.id ? `${tab.color}35` : "transparent",
                color: activeModule === tab.id ? "#ffffff" : "#94a3b8",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: activeModule === tab.id ? tab.color : "transparent",
                boxShadow: activeModule === tab.id ? `0 4px 15px ${tab.color}30` : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Module 1: Anchor Authority */}
      {activeModule === "authority" && (
        <div
          className="glass-card"
          style={{
            padding: "2.25rem",
            marginBottom: "2rem",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.75rem" }}>👑</span>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                Anchor Brand Authority & Set Rating Gate
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                Circuit: <code>setMerchantCommitment(Uint&lt;32&gt;)</code> — Requires <code>merchantSigningKey</code> witness
              </p>
            </div>
          </div>

          <form onSubmit={handleSetMerchantCommitment} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                Merchant Private Signing Key (Protected in Local Enclave) *
              </label>
              <input
                type="password"
                id="merchantKey"
                value={merchantKey}
                onChange={(e) => setMerchantKey(e.target.value)}
                placeholder="Enter merchant enclave signing key..."
                autoComplete="off"
              />
              <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                Derives the zero-knowledge authorization anchor without disclosing your root private key.
              </p>
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "1.25rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1" }}>
                  Minimum Allowed Review Rating Gate
                </span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-mono)" }}>
                  {"★".repeat(minRating)} ({minRating} Stars Min)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              id="setMerchantBtn"
              style={{ alignSelf: "flex-start", padding: "0.85rem 2rem" }}
            >
              {loadingMerchant ? (
                <>
                  <span className="spinner" /> Anchoring Authority...
                </>
              ) : (
                "Anchor Brand Authority (ZK)"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Module 2: Flag Dispute */}
      {activeModule === "flag" && (
        <div
          className="glass-card"
          style={{
            padding: "2.25rem",
            marginBottom: "2rem",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.75rem" }}>🚫</span>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                Flag Disputed / Fraudulent Review
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                Circuit: <code>flagFeedback(Bytes&lt;32&gt;)</code> — Requires authorized merchant ZK signature
              </p>
            </div>
          </div>

          <form onSubmit={handleFlagFeedback} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                Review Commitment Hash to Flag *
              </label>
              <input
                type="text"
                id="flagCommitment"
                value={flagCommitment}
                onChange={(e) => setFlagCommitment(e.target.value)}
                placeholder="0x... 32-byte hexadecimal review commitment to void"
                required
              />
              <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                Once flagged on-chain, this review will fail public verification checks across all dApp frontends.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setFlagCommitment("0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f87171",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Load Target Test Commitment
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !flagCommitment}
              id="flagBtn"
              style={{
                alignSelf: "flex-start",
                background: "rgba(239, 68, 68, 0.25)",
                borderColor: "rgba(239, 68, 68, 0.6)",
                color: "#fca5a5",
                padding: "0.85rem 2rem",
              }}
            >
              {loadingFlag ? (
                <>
                  <span className="spinner" /> Flagging Commitment...
                </>
              ) : (
                "Flag Review on Ledger (ZK Auth)"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Module 3: Catalog Rotation */}
      {activeModule === "catalog" && (
        <div
          className="glass-card"
          style={{
            padding: "2.25rem",
            marginBottom: "2rem",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.75rem" }}>🔄</span>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                Rotate Catalog Season / Epoch
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                Circuit: <code>resetMerchantProduct(Bytes&lt;32&gt;, Uint&lt;32&gt;)</code> — Initiates a new product season
              </p>
            </div>
          </div>

          <form onSubmit={handleResetCatalog} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                New Catalog / Merchant Identifier (String/Bytes) *
              </label>
              <input
                type="text"
                id="newMerchantId"
                value={newMerchantId}
                onChange={(e) => setNewMerchantId(e.target.value)}
                placeholder="merchant_apple_electronics_2027"
                required
              />
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "1.25rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1" }}>
                  New Baseline Rating Score
                </span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fbbf24", fontFamily: "var(--font-mono)" }}>
                  {"★".repeat(resetMinRating)} ({resetMinRating} Stars)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={resetMinRating}
                onChange={(e) => setResetMinRating(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              id="resetBtn"
              style={{
                alignSelf: "flex-start",
                background: "rgba(245, 158, 11, 0.25)",
                borderColor: "rgba(245, 158, 11, 0.6)",
                color: "#fde68a",
                padding: "0.85rem 2rem",
              }}
            >
              {loadingReset ? (
                <>
                  <span className="spinner" /> Rotating Catalog...
                </>
              ) : (
                "Rotate Catalog & Policy"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Module 4: Anti-Replay Session Bump */}
      {activeModule === "session" && (
        <div
          className="glass-card"
          style={{
            padding: "2.25rem",
            marginBottom: "2rem",
            border: "1px solid rgba(6, 182, 212, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.75rem" }}>⏱️</span>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                Increment Session Epoch Nonce
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                Circuit: <code>incrementSession()</code> — Prevent replay of feedback from prior review sessions
              </p>
            </div>
          </div>

          <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Incrementing the on-chain session nonce forces subsequent feedback submissions to bind to the newest epoch. This prevents replay attacks where a buyer attempts to submit duplicate reviews from the same purchase.
          </p>

          <button
            onClick={handleIncrementSession}
            className="btn-primary"
            disabled={isLoading}
            id="sessionBtn"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
              padding: "0.85rem 2rem",
            }}
          >
            {loadingSession ? (
              <>
                <span className="spinner" /> Advancing Nonce...
              </>
            ) : (
              "Increment Session Nonce Counter"
            )}
          </button>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div
          className="glass-card fade-in"
          style={{
            padding: "2rem",
            marginBottom: "1.75rem",
            border: "1.5px solid rgba(16, 185, 129, 0.4)",
            background: "rgba(16, 185, 129, 0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "1.5rem", color: "#10b981" }}>✓</span>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f8fafc" }}>
              Merchant Governance Circuit Finalized On-Chain
            </h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {Object.entries(result).map(
              ([k, v]) =>
                v !== undefined && (
                  <div key={k} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.82rem", color: "#64748b", minWidth: 170, textTransform: "capitalize" }}>
                      {k}:
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "#e2e8f0", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                      {String(v)}
                    </span>
                  </div>
                )
            )}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            <Link href="/explorer" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}>
              Inspect in Explorer ↗
            </Link>
            <Link href="/" className="btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Logs Terminal */}
      {logs.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Merchant Governance Logs
            </span>
            <button
              onClick={() => setLogs([])}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "0.72rem",
                cursor: "pointer",
              }}
            >
              Clear Logs
            </button>
          </div>

          <div className="log-box" style={{ maxHeight: "200px" }}>
            {logs.map((l, i) => (
              <div key={i} className={`log-${l.type}`} style={{ lineHeight: 1.6 }}>
                {l.msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
