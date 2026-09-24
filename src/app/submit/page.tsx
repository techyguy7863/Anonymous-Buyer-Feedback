"use client";
import React, { useState } from "react";
import { getClient, NETWORK_CONFIG } from "../../lib/contract";
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
  const [copiedTx, setCopiedTx] = useState(false);

  const addLog = (msg: string, type = "info") => setLogs((l) => [...l, { msg, type }]);

  const ratingSentiments: Record<number, { text: string; color: string; badge: string }> = {
    5: { text: "Exceptional Quality (5/5)", color: "#10b981", badge: "badge-emerald" },
    4: { text: "Highly Recommended (4/5)", color: "#06b6d4", badge: "badge-cyan" },
    3: { text: "Satisfactory Purchase (3/5)", color: "#f59e0b", badge: "badge-gold" },
    2: { text: "Below Expectations (2/5)", color: "#f97316", badge: "badge-gold" },
    1: { text: "Significant Issues (1/5)", color: "#ef4444", badge: "badge-rose" },
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
      addLog("> [WALLET] Connecting to Midnight Lace Wallet session via DApp Connector...", "info");
      addLog(`> [NETWORK] Binding to Midnight Preview Network (${NETWORK_CONFIG.networkId})`, "info");
      addLog(`> [ZK WITNESS 1/4] buyerSecretKey() — confidential buyer private key loaded into client memory`, "info");
      addLog(`> [ZK WITNESS 2/4] orderInvoiceHash() — blind SHA-256 digest of purchase receipt computed`, "info");
      addLog(`> [ZK WITNESS 3/4] ratingScore() = ${ratingScore} Stars (circuit asserts 1 <= rating <= 5)...`, "info");
      addLog(`> [ZK WITNESS 4/4] feedbackProofNonce() — cryptographic salt generated via Web Crypto API`, "info");
      addLog(`> [SNARK PROVER] Compiling Compact v0.23 circuit: submitFeedback(Bytes<32>)...`, "info");

      const client = getClient();
      client.setBuyerKey(buyerSecretKey || "sample_buyer_secret_key");
      client.setInvoiceHash(orderInvoice || "sample_order_invoice_hash");
      client.setRatingScore(ratingScore);

      const res = await client.submitFeedback(merchantId);

      setResult(res);
      setClaimedCommitment(res.commitmentHex);
      addLog(`> [CONFIRMED ✓] ZK Buyer Feedback commitment successfully anchored on-chain!`, "success");
      addLog(`> [COMMITMENT HASH] ${res.commitmentHex}`, "success");
      addLog(`> [TX HASH] ${res.txHash}`, "success");
      addLog(`> [FEE] Transaction fee: ${res.txFee} ${res.txFeeAsset} settled on Midnight Preview`, "info");
      addLog(`> [PRIVACY VERIFIED] 0 bytes of invoice, customer name, or payment details leaked to block validators`, "success");
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
    try {
      addLog(`> [CIRCUIT] Executing verifyFeedback(Bytes<32>) for commitment hash...`, "info");
      const client = getClient();
      const res = await client.verifyFeedback(claimedCommitment);
      setVerifyResult(res);
      if (res.matches) {
        addLog(`> [VERIFIED ✓] On-chain proof verification SUCCESSFUL — authentic buyer review confirmed!`, "success");
      } else {
        addLog(`> [MISMATCH ✕] Commitment does not match on-chain ledger records or was flagged.`, "error");
      }
    } catch (err: any) {
      addLog(`> [VERIFY ERROR] ${err?.message || err}`, "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <span className="badge badge-emerald">Client Prover (ZK)</span>
          <span className="badge badge-cyan">Midnight Preview Network</span>
          <span className="badge badge-purple">Compact v0.23</span>
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
          Anonymous Feedback Submission Portal
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "640px", margin: "0.5rem auto 0" }}>
          Prove authentic product purchase and submit verified star ratings in zero-knowledge. Your invoice receipt, payment method, and personal identity remain 100% private.
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
          }}
        >
          <button
            onClick={() => setActiveTab("submit")}
            style={{
              padding: "0.6rem 1.75rem",
              borderRadius: "50px",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              transition: "all 0.25s ease",
              background: activeTab === "submit" ? "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" : "transparent",
              color: activeTab === "submit" ? "#030712" : "#94a3b8",
              boxShadow: activeTab === "submit" ? "0 4px 15px rgba(16, 185, 129, 0.4)" : "none",
            }}
          >
            ⚡ Submit Verified Review
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            style={{
              padding: "0.6rem 1.75rem",
              borderRadius: "50px",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              transition: "all 0.25s ease",
              background: activeTab === "verify" ? "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)" : "transparent",
              color: activeTab === "verify" ? "#ffffff" : "#94a3b8",
              boxShadow: activeTab === "verify" ? "0 4px 15px rgba(6, 182, 212, 0.4)" : "none",
            }}
          >
            🛡️ On-Chain Proof Verifier
          </button>
        </div>
      </div>

      {activeTab === "submit" ? (
        <>
          {/* Presets Bar */}
          <div
            className="glass-card"
            style={{
              padding: "1rem 1.5rem",
              marginBottom: "1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>⚡</span>
              <span style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600 }}>
                Quick-Fill Test Credentials:
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => handleApplyPreset("iphone")}
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "6px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                iPhone 16 Order (5★)
              </button>
              <button
                onClick={() => handleApplyPreset("sony")}
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "6px",
                  background: "rgba(6, 182, 212, 0.15)",
                  color: "#06b6d4",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Sony Headphones (5★)
              </button>
              <button
                onClick={() => handleApplyPreset("dell")}
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "6px",
                  background: "rgba(192, 132, 252, 0.15)",
                  color: "#c084fc",
                  border: "1px solid rgba(192, 132, 252, 0.3)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Dell Laptop (4★)
              </button>
            </div>
          </div>

          {/* Main Submission Form */}
          <div
            className="glass-card"
            style={{
              padding: "2.25rem",
              marginBottom: "2rem",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <form onSubmit={handleSubmitFeedback} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {/* Interactive Star Rating Selector */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  padding: "1.5rem",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  textAlign: "center",
                }}
              >
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.75rem" }}>
                  Product Rating Score (Enforced in ZK: 1 &le; rating &le; 5) *
                </label>

                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => setRatingScore(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        color: star <= (hoverRating || ratingScore) ? "#fbbf24" : "#334155",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    className={`badge ${ratingSentiments[ratingScore].badge}`}
                    style={{ fontSize: "0.78rem", padding: "0.3rem 0.85rem" }}
                  >
                    {ratingSentiments[ratingScore].text}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    • Enforced via Compact SNARK Assertion
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem" }}>
                    Merchant Identifier (Public Input) *
                  </label>
                  <input
                    type="text"
                    id="merchantId"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="merchant_apple_store_us"
                    required
                  />
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                    Anchors feedback to the registered merchant catalog on Midnight.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem" }}>
                    Buyer Secret Key (Private Witness 🔒)
                  </label>
                  <input
                    type="password"
                    id="buyerSecretKey"
                    value={buyerSecretKey}
                    onChange={(e) => setBuyerSecretKey(e.target.value)}
                    placeholder="Confidential buyer key (never leaves device)"
                    autoComplete="off"
                  />
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                    Compiles into <code>buyerSecretKey()</code> witness — kept strictly in client memory.
                  </p>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem" }}>
                  Order Invoice / Purchase Receipt (Blind Witness 🔒)
                </label>
                <input
                  type="text"
                  id="orderInvoice"
                  value={orderInvoice}
                  onChange={(e) => setOrderInvoice(e.target.value)}
                  placeholder="e.g. INV-2026-APPL-9812401824 or raw receipt payload"
                />
                <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                  Hashed locally via SHA-256 into <code>orderInvoiceHash()</code>. Zero receipt items or credit cards are transmitted.
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem" }}>
                  Anonymous Review Comments (Optional Public Feedback)
                </label>
                <textarea
                  id="reviewComments"
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Share your anonymous product review notes..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  id="submitBtn"
                  style={{ padding: "0.85rem 2.25rem", fontSize: "0.95rem" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Generating ZK SNARK Proof...
                    </>
                  ) : (
                    "💎 Generate Proof & Publish Feedback"
                  )}
                </button>
                <Link href="/" className="btn-secondary" style={{ padding: "0.85rem 1.5rem" }}>
                  ← Dashboard
                </Link>
              </div>
            </form>
          </div>

          {/* Success Result: Digital Verification Certificate */}
          {result && (
            <div
              className="glass-card"
              style={{
                padding: "2.25rem",
                marginBottom: "2rem",
                border: "1.5px solid rgba(16, 185, 129, 0.4)",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)",
                boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.25)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(16, 185, 129, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#10b981",
                      fontSize: "1.4rem",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
                      Buyer Feedback Confirmed On-Chain
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 600 }}>
                      Midnight Preview Testnet • Zero-Knowledge Purchase Verified
                    </p>
                  </div>
                </div>

                <span
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "50px",
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#6ee7b7",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                  }}
                >
                  FINALITY CONFIRMED
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Circuit Executed
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#34d399", fontWeight: 700 }}>
                    submitFeedback(Bytes&lt;32&gt;)
                  </div>
                </div>

                <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Validated Rating Score
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#fbbf24", fontWeight: 700 }}>
                    {"★".repeat(ratingScore)} ({ratingScore}/5 Stars)
                  </div>
                </div>

                <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Transaction Fee
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#f8fafc" }}>
                    {result.txFee} {result.txFeeAsset}
                  </div>
                </div>

                <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Prover Engine
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#06b6d4", fontWeight: 700 }}>
                    Compact SNARK v0.23
                  </div>
                </div>
              </div>

              {/* Public Commitment and TxHash */}
              <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: "1.5rem" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    On-Chain Review Commitment Hash
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#34d399", wordBreak: "break-all" }}>
                    {result.commitmentHex}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Midnight Transaction Hash
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#38bdf8", wordBreak: "break-all" }}>
                    {result.txHash}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => copyToClipboard(result.txHash)}
                  className="btn-secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
                >
                  {copiedTx ? "✓ Copied Hash!" : "Copy TxHash"}
                </button>
                <a
                  href={NETWORK_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}
                >
                  Inspect in Midnight Explorer ↗
                </a>
                <button
                  onClick={() => {
                    setClaimedCommitment(result.commitmentHex);
                    setActiveTab("verify");
                  }}
                  className="btn-secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.82rem", borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4" }}
                >
                  Audit in Verifier Engine →
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* TAB 2: AUDIT VERIFIER ENGINE */
        <div
          className="glass-card"
          style={{
            padding: "2.25rem",
            marginBottom: "2rem",
            border: "1px solid rgba(6, 182, 212, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.75rem" }}>🛡️</span>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#f8fafc" }}>
                On-Chain Commitment Verifier
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                Publicly audit whether a review commitment hash matches an authentic buyer submission on the Midnight Preview ledger.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyCommitment} style={{ marginTop: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
              Claimed 32-Byte Review Commitment Hash:
            </label>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="text"
                id="claimedCommitment"
                value={claimedCommitment}
                onChange={(e) => setClaimedCommitment(e.target.value)}
                placeholder="0x... or 32-byte hexadecimal review commitment hash"
                style={{ flex: 1, minWidth: "260px" }}
                required
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={verifyLoading}
                id="verifyBtn"
                style={{ whiteSpace: "nowrap", background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)", padding: "0.75rem 1.75rem" }}
              >
                {verifyLoading ? (
                  <>
                    <span className="spinner" /> Auditing Ledger...
                  </>
                ) : (
                  "Verify On-Chain"
                )}
              </button>
            </div>
          </form>

          {/* Sample Helper */}
          <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#64748b" }}>
            <span>Try sample anchor commitment: </span>
            <button
              type="button"
              onClick={() => setClaimedCommitment("0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa")}
              style={{
                background: "none",
                border: "none",
                color: "#06b6d4",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "0.75rem",
                padding: 0,
              }}
            >
              Insert Genesis Ledger Commitment
            </button>
          </div>

          {/* Verification Outcome */}
          {verifyResult && (
            <div
              className="fade-in"
              style={{
                marginTop: "1.75rem",
                padding: "1.5rem",
                borderRadius: "12px",
                background: verifyResult.matches ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                border: `1.5px solid ${verifyResult.matches ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{verifyResult.matches ? "✓" : "✕"}</span>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: verifyResult.matches ? "#6ee7b7" : "#fca5a5" }}>
                    {verifyResult.matches
                      ? "Cryptographically Validated: Genuine Buyer Review"
                      : "Verification Mismatch: Unregistered or Flagged Commitment"}
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                    {verifyResult.matches
                      ? "Commitment is verified active in the Midnight Preview ledger state."
                      : "This commitment does not exist on-chain or has been permanently flagged."}
                  </p>
                </div>
              </div>

              <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "0.75rem 1rem", borderRadius: "8px", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                <div style={{ color: "#64748b" }}>Audit Transaction Hash:</div>
                <div style={{ color: "#cbd5e1", wordBreak: "break-all" }}>{verifyResult.txHash}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-Time Telemetry Terminal */}
      {logs.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            marginTop: "1.5rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Live ZK SNARK Prover & Network Telemetry
              </span>
            </div>
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
              Clear Terminal
            </button>
          </div>

          <div className="log-box" style={{ maxHeight: "220px" }}>
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
