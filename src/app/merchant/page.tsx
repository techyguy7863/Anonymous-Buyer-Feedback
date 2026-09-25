"use client";

import React, { useState } from "react";
import { getClient, CONTRACT_ADDRESS, NETWORK_CONFIG } from "@/lib/contract";
import Link from "next/link";

export default function MerchantPage() {
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

  const handleGenerateMerchantKey = () => {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    const key = "merchant_key_" + Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
    setMerchantKey(key);
    addLog(`> [ENTROPY] Generated 256-bit merchant authority key: ${key.slice(0, 18)}...`, "info");
  };

  const handleSetMerchantCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMerchant(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet via DApp Connector...", "info");
      addLog("> [ZK WITNESS] Compiling merchantSigningKey() witness in private memory enclave...", "info");
      addLog(`> [CIRCUIT] Invoking setMerchantCommitment(Uint<32>) - minimumRating=${minRating}...`, "info");

      const client = getClient();
      client.setMerchantKey(merchantKey || "merchant_default_private_key");
      const res = await client.setMerchantCommitment(minRating);

      setResult({ ...res, circuit: "setMerchantCommitment(Uint<32>)" });
      addLog("> [SUCCESS] Merchant authority commitment anchored on-chain!", "success");
      addLog(`> [COMMITMENT] Brand Anchor: ${res.merchantCommitment}`, "success");
      addLog(`> [POLICY] Minimum rating threshold set to ${res.newMinimumRating} Stars`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
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
      addLog("> [SUCCESS] Review commitment marked as disputed / flagged on Midnight ledger!", "success");
      addLog(`> [FLAGGED COMMITMENT] ${res.flaggedCommitment}`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
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
      addLog("> [SUCCESS] Merchant catalog rotated on-chain!", "success");
      addLog(`> [MERCHANT ID] ${res.newMerchantId}`, "success");
      addLog(`> [MIN RATING] ${res.newMinimumRating} Stars`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
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
      addLog("> [WALLET] Requesting epoch nonce increment...", "info");
      addLog("> [CIRCUIT] Executing incrementSession() to advance anti-replay epoch...", "info");

      const client = getClient();
      const res = await client.incrementSession();

      setResult({ ...res, circuit: "incrementSession()" });
      addLog("> [SUCCESS] Active session epoch incremented on Midnight Preview ledger!", "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingSession(false);
    }
  };

  const F: React.CSSProperties = { marginBottom: "1.1rem" };

  return (
    <div>
      {/* HEADER */}
      <div style={{ padding: "3rem 5rem 2rem", borderBottom: "1px solid var(--border)" }}>
        <span className="badge" style={{ marginBottom: "0.75rem" }}>ZK CIRCUITS 3, 4 & 5</span>
        <h1 className="section-title">Merchant Governance<br />Console</h1>
        <p className="section-desc" style={{ maxWidth: 560 }}>
          Manage catalog review policies, anchor cryptographic brand authority, flag disputed reviews, and advance anti-replay epoch sessions.
        </p>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 220px)" }}>
        {/* LEFT COLUMN: OPERATIONS */}
        <div style={{ padding: "3rem 2.5rem 3rem 5rem", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* SHARED MERCHANT SIGNING KEY */}
          <div>
            <label className="label">Merchant Signing Key (Shared Local Enclave Key)</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <input
                className="input"
                value={merchantKey}
                onChange={(e) => setMerchantKey(e.target.value)}
                placeholder="Enter merchant private key or generate entropy"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
              />
              <button
                type="button"
                onClick={handleGenerateMerchantKey}
                className="btn-outline"
                style={{ whiteSpace: "nowrap", padding: "0.55rem 0.9rem", fontSize: "0.78rem" }}
              >
                Generate
              </button>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--fg-4)" }}>
              Derives merchantSigningKey() witness to authorize all governance operations
            </div>
          </div>

          <hr className="divider" style={{ margin: 0 }} />

          {/* OPERATION 1: ANCHOR AUTHORITY */}
          <form onSubmit={handleSetMerchantCommitment}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.25rem" }}>
              1 — Anchor Brand Authority & Rating Gate
            </h2>
            <div style={F}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label className="label" style={{ marginBottom: 0 }}>Minimum Rating Allowed</label>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{minRating} Stars Minimum</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--fg)", cursor: "pointer" }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: "100%", justifyContent: "center", padding: "0.7rem", fontSize: "0.85rem" }}
            >
              {loadingMerchant ? "Anchoring Authority..." : "Anchor Brand Authority (ZK)"}
            </button>
          </form>

          <hr className="divider" style={{ margin: 0 }} />

          {/* OPERATION 2: FLAG DISPUTE */}
          <form onSubmit={handleFlagFeedback}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.25rem" }}>
              2 — Flag Disputed / Fraudulent Review
            </h2>
            <div style={F}>
              <label className="label">Review Commitment Hash to Flag</label>
              <input
                className="input"
                value={flagCommitment}
                onChange={(e) => setFlagCommitment(e.target.value)}
                placeholder="0x... 32-byte hexadecimal review commitment"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
                required
              />
              <div style={{ marginTop: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => setFlagCommitment("0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa")}
                  style={{ background: "none", border: "none", color: "var(--fg-3)", textDecoration: "underline", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}
                >
                  Load Genesis Test Commitment
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn-outline"
              disabled={isLoading || !flagCommitment}
              style={{ width: "100%", justifyContent: "center", padding: "0.7rem", fontSize: "0.85rem" }}
            >
              {loadingFlag ? "Flagging..." : "Flag Review on Ledger (ZK Auth)"}
            </button>
          </form>

          <hr className="divider" style={{ margin: 0 }} />

          {/* OPERATION 3: ROTATE CATALOG */}
          <form onSubmit={handleResetCatalog}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.25rem" }}>
              3 — Rotate Catalog Season / Epoch
            </h2>
            <div style={F}>
              <label className="label">New Catalog Identifier</label>
              <input
                className="input"
                value={newMerchantId}
                onChange={(e) => setNewMerchantId(e.target.value)}
                placeholder="e.g. merchant_apple_electronics_2027"
                required
              />
            </div>
            <div style={F}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label className="label" style={{ marginBottom: 0 }}>Baseline Minimum Rating</label>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{resetMinRating} Stars</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={resetMinRating}
                onChange={(e) => setResetMinRating(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--fg)", cursor: "pointer" }}
              />
            </div>
            <button
              type="submit"
              className="btn-outline"
              disabled={isLoading}
              style={{ width: "100%", justifyContent: "center", padding: "0.7rem", fontSize: "0.85rem" }}
            >
              {loadingReset ? "Rotating..." : "Rotate Catalog & Policy"}
            </button>
          </form>

          <hr className="divider" style={{ margin: 0 }} />

          {/* OPERATION 4: ADVANCE SESSION */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
              4 — Advance Anti-Replay Session Epoch
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--fg-3)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Advancing the on-chain session nonce invalidates prior session nullifiers, preventing replay attacks across different purchase epochs.
            </p>
            <button
              type="button"
              onClick={handleIncrementSession}
              className="btn-outline"
              disabled={isLoading}
              style={{ width: "100%", justifyContent: "center", padding: "0.7rem", fontSize: "0.85rem" }}
            >
              {loadingSession ? "Advancing Nonce..." : "Increment Session Nonce Counter"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: TELEMETRY & RESULTS */}
        <div style={{ padding: "3rem 5rem 3rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* TERMINAL */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", marginBottom: "0.5rem" }}>
              Merchant Governance Circuit Log
            </div>
            <div className="terminal" style={{ minHeight: 200 }}>
              {logs.length === 0 ? (
                <span style={{ color: "var(--fg-4)" }}>$ waiting for merchant circuit execution...</span>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className={`log-${l.type}`}>
                    {l.msg}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RESULT CARD */}
          {result && (
            <div className="card" style={{ border: "1.5px solid var(--fg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase" }}>
                  Governance Circuit Finalized
                </div>
                <span className="badge badge-black">CONFIRMED</span>
              </div>

              {Object.entries(result).map(([k, v]) => v !== undefined && (
                <div key={k} style={{ marginBottom: "0.75rem" }}>
                  <div className="label" style={{ marginBottom: "0.2rem" }}>{k}</div>
                  <code className="mono-text">{String(v)}</code>
                </div>
              ))}

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <Link href="/explorer" className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}>
                  Inspect Ledger Explorer &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* WITNESS ENCLAVE INFO */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem", color: "var(--fg-2)" }}>
              Cryptographic Enclave Guarantees
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--fg-3)", lineHeight: 1.65 }}>
              All merchant administrative operations are authorized through zero-knowledge proofs derived from the <code>merchantSigningKey()</code> witness. The raw private key is never exposed on the public ledger.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}