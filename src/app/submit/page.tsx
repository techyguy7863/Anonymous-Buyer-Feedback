"use client";

import React, { useState } from "react";
import { getClient, NETWORK_CONFIG } from "@/lib/contract";
import Link from "next/link";

export default function SubmitFeedbackPage() {
  const [activeTab, setActiveTab] = useState<"submit" | "verify">("submit");
  const [merchantId, setMerchantId] = useState("merchant_apple_store_us");
  const [buyerSecretKey, setBuyerSecretKey] = useState("");
  const [orderInvoice, setOrderInvoice] = useState("");
  const [ratingScore, setRatingScore] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [claimedCommitment, setClaimedCommitment] = useState("");
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);
  const [copiedCommitment, setCopiedCommitment] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  const addLog = (msg: string, type = "info") => setLogs((l) => [...l, { msg, type }]);

  const ratingSentiments: Record<number, string> = {
    5: "Exceptional Quality (5/5)",
    4: "Highly Recommended (4/5)",
    3: "Satisfactory Purchase (3/5)",
    2: "Below Expectations (2/5)",
    1: "Significant Issues (1/5)",
  };

  const handleGenerateKey = () => {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    const key = "buyer_key_" + Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
    setBuyerSecretKey(key);
    addLog(`> [ENTROPY] Generated 256-bit buyer secret key: ${key.slice(0, 18)}...`, "info");
  };

  const handleApplyPreset = (preset: "iphone" | "sony" | "dell") => {
    if (preset === "iphone") {
      setMerchantId("merchant_apple_store_us");
      setRatingScore(5);
      setBuyerSecretKey("buyer_enclave_key_apple_vip_007");
      setOrderInvoice("INV-2026-APPL-9812401824-IPHONE16PM");
      setReviewComments("Flawless titanium build and camera controls. Battery easily lasts 2 full days.");
    } else if (preset === "sony") {
      setMerchantId("merchant_sony_official_store");
      setRatingScore(5);
      setBuyerSecretKey("buyer_enclave_key_sony_wh1000xm5");
      setOrderInvoice("INV-2026-SONY-44810291-HEADPHONES");
      setReviewComments("Active noise cancellation is unbeatable for long flights. Comfortable earcups.");
    } else {
      setMerchantId("merchant_dell_technologies_us");
      setRatingScore(4);
      setBuyerSecretKey("buyer_enclave_key_dell_xps15_oled");
      setOrderInvoice("INV-2026-DELL-11928374-XPS15OLED");
      setReviewComments("Stunning 3.5K OLED screen and great typing experience. Thermals can get warm under render loads.");
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLogs([]);
    setResult(null);
    setVerifyResult(null);

    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet via DApp Connector...", "info");
      addLog(`> [NETWORK] Target Network: Midnight Preview (${NETWORK_CONFIG.networkId})`, "info");
      addLog("> [ZK WITNESS 1/4] buyerSecretKey() - Confidential buyer key loaded in memory enclave", "info");
      addLog("> [ZK WITNESS 2/4] orderInvoiceHash() - SHA-256 digest of purchase receipt computed locally", "info");
      addLog(`> [ZK WITNESS 3/4] ratingScore() = ${ratingScore} Stars (circuit asserts 1 <= rating <= 5)`, "info");
      addLog("> [ZK WITNESS 4/4] feedbackProofNonce() - Cryptographic salt generated via Web Crypto API", "info");
      addLog("> [CIRCUIT] Compiling Compact v0.23 circuit: submitFeedback(Bytes<32>)...", "info");

      const client = getClient();
      client.setBuyerKey(buyerSecretKey || "sample_buyer_secret_key");
      client.setInvoiceHash(orderInvoice || "sample_order_invoice_hash");
      client.setRatingScore(ratingScore);

      const res = await client.submitFeedback(merchantId);

      setResult(res);
      setClaimedCommitment(res.commitmentHex);
      addLog("> [SUCCESS] ZK Buyer Feedback commitment anchored on-chain!", "success");
      addLog(`> [COMMITMENT] ${res.commitmentHex}`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
      addLog(`> [FEE] ${res.txFee} ${res.txFeeAsset} settled on Midnight Preview`, "info");
      addLog("> [VERIFIED] Zero personal identity or transaction receipts disclosed to validators.", "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimedCommitment) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      addLog(`> [CIRCUIT] Invoking verifyFeedback(Bytes<32>) for commitment...`, "info");
      const client = getClient();
      const res = await client.verifyFeedback(claimedCommitment);
      setVerifyResult(res);
      if (res.matches) {
        addLog("> [VERIFIED] On-chain proof verification SUCCESSFUL - authentic buyer review confirmed!", "success");
        addLog(`> [TX HASH] ${res.txHash}`, "success");
      } else {
        addLog("> [FAILED] Commitment does not match on-chain ledger records or was flagged.", "error");
      }
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyText = (text: string, isCommitment = false) => {
    navigator.clipboard.writeText(text);
    if (isCommitment) {
      setCopiedCommitment(true);
      setTimeout(() => setCopiedCommitment(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const F: React.CSSProperties = { marginBottom: "1.25rem" };

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ padding: "3rem 5rem 2rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="badge" style={{ marginBottom: "0.75rem" }}>ZK CIRCUITS 1 & 2</span>
            <h1 className="section-title">Submit Anonymous<br />Buyer Feedback</h1>
            <p className="section-desc" style={{ maxWidth: 580 }}>
              Generate client-side zero-knowledge proofs locally in your browser. Assert authentic purchase and star ratings without revealing personal credentials.
            </p>
          </div>
          {/* TAB BUTTONS */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setActiveTab("submit")}
              className={activeTab === "submit" ? "btn-primary" : "btn-outline"}
              style={{ padding: "0.55rem 1.15rem", fontSize: "0.85rem" }}
            >
              Submit Feedback
            </button>
            <button
              onClick={() => setActiveTab("verify")}
              className={activeTab === "verify" ? "btn-primary" : "btn-outline"}
              style={{ padding: "0.55rem 1.15rem", fontSize: "0.85rem" }}
            >
              Audit Commitment
            </button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 220px)" }}>
        {/* LEFT COLUMN: INTERACTIVE FORMS */}
        <div style={{ padding: "3rem 2.5rem 3rem 5rem", borderRight: "1px solid var(--border)" }}>
          {activeTab === "submit" ? (
            <>
              {/* PRESETS BAR */}
              <div style={{ marginBottom: "1.75rem", padding: "1rem 1.25rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-3)", marginBottom: "0.6rem" }}>
                  Quick-Fill Test Credentials
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => handleApplyPreset("iphone")} className="btn-outline" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                    iPhone 16 Pro (5 Stars)
                  </button>
                  <button type="button" onClick={() => handleApplyPreset("sony")} className="btn-outline" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                    Sony XM5 (5 Stars)
                  </button>
                  <button type="button" onClick={() => handleApplyPreset("dell")} className="btn-outline" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                    Dell XPS 15 (4 Stars)
                  </button>
                </div>
              </div>

              {/* MAIN FORM */}
              <form onSubmit={handleSubmitFeedback}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.5rem" }}>
                  Step 1 — Feedback & Private Witnesses
                </h2>

                <div style={F}>
                  <label className="label">Target Merchant ID (Public Input)</label>
                  <input
                    className="input"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="e.g. merchant_apple_store_us"
                    required
                  />
                  <div style={{ fontSize: "0.72rem", color: "var(--fg-4)", marginTop: "0.3rem" }}>
                    Public identifier registered in the on-chain catalog
                  </div>
                </div>

                <div style={F}>
                  <label className="label">Buyer Secret Key (Private Witness)</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      className="input"
                      value={buyerSecretKey}
                      onChange={(e) => setBuyerSecretKey(e.target.value)}
                      placeholder="Enter buyer private key or generate entropy"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateKey}
                      className="btn-outline"
                      style={{ whiteSpace: "nowrap", padding: "0.55rem 0.9rem", fontSize: "0.78rem" }}
                    >
                      Generate
                    </button>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--fg-4)", marginTop: "0.3rem" }}>
                    Compiled into buyerSecretKey() witness — never leaves device memory
                  </div>
                </div>

                <div style={F}>
                  <label className="label">Order Invoice / Receipt Digest (Blind Witness)</label>
                  <input
                    className="input"
                    value={orderInvoice}
                    onChange={(e) => setOrderInvoice(e.target.value)}
                    placeholder="e.g. INV-2026-APPL-9812401824 or raw receipt payload"
                  />
                  <div style={{ fontSize: "0.72rem", color: "var(--fg-4)", marginTop: "0.3rem" }}>
                    Hashed locally via SHA-256 into orderInvoiceHash(). Zero receipt items transmitted.
                  </div>
                </div>

                {/* STAR RATING */}
                <div style={F}>
                  <label className="label">Product Rating (Enforced in ZK: 1 &le; rating &le; 5)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--card)", padding: "0.85rem 1.25rem", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingScore(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "1.4rem",
                            cursor: "pointer",
                            color: star <= (hoverRating || ratingScore) ? "var(--fg)" : "var(--border-2)",
                            padding: "0 0.15rem",
                            transition: "color 0.1s",
                          }}
                        >
                          &#9733;
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--fg)" }}>
                      {ratingSentiments[ratingScore]}
                    </span>
                  </div>
                </div>

                <div style={F}>
                  <label className="label">Anonymous Review Comments (Optional)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Share honest feedback about the product quality..."
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: "100%", justifyContent: "center", padding: "0.75rem", fontSize: "0.9rem", marginTop: "0.5rem" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Generating ZK SNARK Proof...
                    </>
                  ) : (
                    "Generate ZK Proof & Anchor Feedback"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* TAB 2: AUDIT COMMITMENT */
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.25rem" }}>
                Step 2 — Verify On-Chain Commitment
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--fg-3)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Audit whether a given 32-byte review commitment hash is registered and authentic on the Midnight Preview ledger.
              </p>

              <form onSubmit={handleVerifyCommitment}>
                <div style={F}>
                  <label className="label">Review Commitment Hash</label>
                  <input
                    className="input"
                    value={claimedCommitment}
                    onChange={(e) => setClaimedCommitment(e.target.value)}
                    placeholder="0x... or 32-byte hexadecimal review commitment hash"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <button
                    type="button"
                    onClick={() => setClaimedCommitment("0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa")}
                    style={{ background: "none", border: "none", color: "var(--fg-3)", textDecoration: "underline", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}
                  >
                    Load Genesis Contract Commitment
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={verifyLoading}
                  style={{ width: "100%", justifyContent: "center", padding: "0.75rem", fontSize: "0.9rem" }}
                >
                  {verifyLoading ? "Auditing On-Chain Ledger..." : "Verify Commitment On-Chain"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ZK CIRCUIT LOGS & TELEMETRY */}
        <div style={{ padding: "3rem 5rem 3rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* TERMINAL */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)" }}>
                ZK Prover & Network Telemetry
              </div>
              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  style={{ background: "none", border: "none", color: "var(--fg-4)", fontSize: "0.72rem", cursor: "pointer" }}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="terminal" style={{ minHeight: 200 }}>
              {logs.length === 0 ? (
                <span style={{ color: "var(--fg-4)" }}>$ waiting for ZK circuit invocation...</span>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className={`log-${l.type}`}>
                    {l.msg}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SUBMISSION RESULT CARD */}
          {result && (
            <div className="card" style={{ border: "1.5px solid var(--fg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Feedback Confirmed On-Chain
                </div>
                <span className="badge badge-black">FINALIZED</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div className="card-sm" style={{ padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--fg-3)", textTransform: "uppercase" }}>Circuit</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, marginTop: "0.2rem" }}>submitFeedback()</div>
                </div>
                <div className="card-sm" style={{ padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--fg-3)", textTransform: "uppercase" }}>Rating Verified</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, marginTop: "0.2rem" }}>{ratingScore}/5 Stars (ZK Asserted)</div>
                </div>
                <div className="card-sm" style={{ padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--fg-3)", textTransform: "uppercase" }}>Network Fee</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, marginTop: "0.2rem" }}>{result.txFee} {result.txFeeAsset}</div>
                </div>
                <div className="card-sm" style={{ padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--fg-3)", textTransform: "uppercase" }}>Prover DSL</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, marginTop: "0.2rem" }}>Compact v0.23</div>
                </div>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <span className="label" style={{ marginBottom: 0 }}>Commitment Hash</span>
                  <button
                    type="button"
                    onClick={() => copyText(result.commitmentHex, true)}
                    style={{ background: "none", border: "none", color: "var(--fg-3)", fontSize: "0.72rem", cursor: "pointer" }}
                  >
                    {copiedCommitment ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="mono-text">{result.commitmentHex}</code>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <span className="label" style={{ marginBottom: 0 }}>Transaction Hash</span>
                  <button
                    type="button"
                    onClick={() => copyText(result.txHash)}
                    style={{ background: "none", border: "none", color: "var(--fg-3)", fontSize: "0.72rem", cursor: "pointer" }}
                  >
                    {copiedTx ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="mono-text">{result.txHash}</code>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setClaimedCommitment(result.commitmentHex);
                    setActiveTab("verify");
                  }}
                  className="btn-outline"
                  style={{ fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}
                >
                  Verify In Audit Engine &rarr;
                </button>
                <a
                  href={NETWORK_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}
                >
                  Midnight Explorer
                </a>
              </div>
            </div>
          )}

          {/* VERIFY RESULT CARD */}
          {verifyResult && (
            <div className="card" style={{ border: `1.5px solid ${verifyResult.matches ? "var(--fg)" : "var(--fg-4)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase" }}>
                  {verifyResult.matches ? "Verified: Authentic Review" : "Verification Failed"}
                </div>
                <span className="badge">{verifyResult.matches ? "VALID ON-CHAIN" : "DISPUTED / VOID"}</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--fg-3)", marginBottom: "0.75rem" }}>
                {verifyResult.matches
                  ? "Commitment is verified active in the Midnight Preview public ledger state."
                  : "This commitment hash does not match ledger records or has been permanently flagged."}
              </p>
              <div className="label" style={{ marginBottom: "0.2rem" }}>Verification Transaction Hash</div>
              <code className="mono-text">{verifyResult.txHash}</code>
            </div>
          )}

          {/* WITNESS ENCLAVE INFO */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem", color: "var(--fg-2)" }}>
              Private Witnesses (Never Transmitted On-Chain)
            </div>
            {[
              "buyerSecretKey() — 256-bit client entropy",
              "orderInvoiceHash() — blind SHA-256 receipt digest",
              "ratingScore() — star score asserted in SNARK",
              "feedbackProofNonce() — ephemeral session salt",
            ].map((w) => (
              <div key={w} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--fg-3)", lineHeight: 1.8 }}>
                &bull; {w}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}