"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from "../lib/contract";

export default function HomePage() {
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "5star" | "4star">("all");

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleReviews = [
    {
      id: "rev-1",
      stars: 5,
      product: "Apple iPhone 16 Pro Max",
      merchant: "Apple Flagship Store",
      text: "Flawless titanium build and camera controls. The zero-knowledge proof compiled in under 1.8 seconds in-browser. Verified authentic purchase without leaking my receipt or credit card!",
      commitment: "0x8f32a7bc410d9e2105ba9401fe38b29c4172a0918451f28b03e5c918a201b4c7",
      date: "Midnight Preview Block #419208",
      verified: true,
      category: "5star",
    },
    {
      id: "rev-2",
      stars: 5,
      product: "Sony WH-1000XM5 Headphones",
      merchant: "Sony Electronics Official",
      text: "Class-leading active noise cancellation. Impressive that merchants can audit valid buyer status without demanding phone numbers, shipping addresses, or KYC.",
      commitment: "0x4b7190de12c84710a39fbc810427de91aa5720194821e78401928374a501c89f",
      date: "Midnight Preview Block #418942",
      verified: true,
      category: "5star",
    },
    {
      id: "rev-3",
      stars: 4,
      product: "Dell XPS 15 OLED Laptop",
      merchant: "Dell Technologies",
      text: "Vibrant 3.5K OLED panel and stellar thermals. Genuine verified buyer proof anchored on Midnight Preview without centralized merchant database storage.",
      commitment: "0x12a9bc48201f9283471092837410293847561029384756102938475610293847",
      date: "Midnight Preview Block #418610",
      verified: true,
      category: "4star",
    },
  ];

  const filteredReviews = sampleReviews.filter(
    (r) => selectedFilter === "all" || r.category === selectedFilter
  );

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />
          <span>Midnight Network • Level 3 ZK Review Engine</span>
        </div>

        <h1>
          Honest Reviews. <span className="text-gradient-emerald">Absolute Anonymity.</span>
        </h1>

        <p>
          Submit cryptographically verified e-commerce product reviews using{" "}
          <strong style={{ color: "#f8fafc" }}>Compact Zero-Knowledge smart contracts</strong>.
          Prove purchase authenticity and valid star ratings without revealing your buyer identity, order receipts, or payment details on-chain.
        </p>

        <div className="hero-actions">
          <Link href="/submit" className="btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "0.95rem" }}>
            ✨ Submit ZK Review →
          </Link>
          <Link href="/merchant" className="btn-secondary" style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem" }}>
            🛡️ Merchant Console
          </Link>
          <Link href="/explorer" className="btn-secondary" style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem" }}>
            🔍 Ledger Explorer
          </Link>
        </div>
      </section>

      {/* 3D Holographic ZK Review Pass Showcase */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div
          className="glass-card"
          style={{
            padding: "2.5rem 2rem",
            background: "rgba(11, 19, 41, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="badge badge-emerald" style={{ marginBottom: "0.5rem" }}>
              Interactive Cryptographic Pass
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc" }}>
              Zero-Knowledge Buyer Verification Pass
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.3rem" }}>
              Click the pass below to flip between public on-chain credentials and private client enclave witnesses.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "center" }}>
            {/* Left: 3D Holographic Card */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", perspective: "1000px" }}>
              <div
                className="zk-buyer-card"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  background: isFlipped
                    ? "linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)"
                    : "linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(3, 7, 18, 0.95) 100%)",
                  border: `1.5px solid ${isFlipped ? "rgba(139, 92, 246, 0.5)" : "rgba(16, 185, 129, 0.5)"}`,
                  boxShadow: `0 20px 40px -15px ${isFlipped ? "rgba(139, 92, 246, 0.35)" : "rgba(16, 185, 129, 0.35)"}`,
                  cursor: "pointer",
                }}
              >
                {!isFlipped ? (
                  /* Front: Verified Review Pass */
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{ fontSize: "1.6rem" }}>🛡️</span>
                        <div>
                          <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "0.05em" }}>
                            ABF VERIFIED BUYER
                          </div>
                          <div style={{ fontSize: "0.65rem", color: "#34d399", letterSpacing: "0.08em" }}>
                            MIDNIGHT ZK AUDITED
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.25rem 0.65rem",
                          borderRadius: "6px",
                          background: "rgba(16, 185, 129, 0.2)",
                          color: "#34d399",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                        }}
                      >
                        AUTHENTIC RECEIPT
                      </span>
                    </div>

                    {/* Middle: Rating stars & chip */}
                    <div style={{ margin: "1rem 0" }}>
                      <div style={{ fontSize: "1.3rem", color: "#fbbf24", marginBottom: "0.3rem" }}>
                        ★★★★★
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0" }}>
                        Apple iPhone 16 Pro Max • Order Verified
                      </div>
                    </div>

                    {/* Footer: Masked hash & identity protection */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        paddingTop: "0.75rem",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase" }}>
                          Buyer Identity
                        </div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#f8fafc" }}>
                          ANONYMOUS SOVEREIGN
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase" }}>
                          ZK Invoice Commitment
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#34d399" }}>
                          0x8F32 •••• C71A
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Back: Cryptographic Witness Breakdown */
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <span style={{ fontWeight: 800, color: "#c084fc", fontSize: "0.85rem" }}>
                          PRIVATE WITNESS ENCLAVE
                        </span>
                        <span style={{ fontSize: "0.68rem", color: "#10b981" }}>● LOCAL ENCLAVE ONLY</span>
                      </div>
                      <div
                        style={{
                          background: "rgba(0, 0, 0, 0.5)",
                          padding: "0.6rem 0.8rem",
                          borderRadius: "8px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          color: "#cbd5e1",
                          lineHeight: 1.6,
                        }}
                      >
                        <div>▸ buyerSecretKey: [KEPT ON DEVICE]</div>
                        <div>▸ orderInvoiceHash: SHA256(invoice_receipt)</div>
                        <div>▸ ratingScore: 5 (bounded 1 &le; rating &le; 5)</div>
                        <div>▸ feedbackProofNonce: 0x9a8f...4e12</div>
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "0.6rem", color: "#94a3b8", fontSize: "0.7rem", lineHeight: 1.4 }}>
                      * Cryptographically isolated. Zero personal details transmitted to Midnight network nodes.
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#64748b" }}>
                <span>🔄 Click pass to {isFlipped ? "view front credentials" : "inspect zero-knowledge witness"}</span>
              </div>
            </div>

            {/* Right: Technical Explanation */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span className="badge badge-cyan">Zero Proof Leakage</span>
                <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Verified without buyer registration
                </span>
              </div>

              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", marginBottom: "0.75rem" }}>
                True Review Authenticity Without Privacy Sacrifices
              </h3>

              <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Traditional online reviews force buyers to sacrifice privacy: names are public, order histories are logged, and merchants can cross-reference review sentiment with customer accounts.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
                {[
                  "Math-guaranteed proof of genuine product purchase",
                  "Rating score mathematically constrained (1 to 5 stars) inside circuit",
                  "Zero exposure of shipping address, credit card, or full name",
                  "Anti-replay nonce protection prevents spamming fake reviews",
                ].map((point, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <span style={{ color: "#10b981", fontSize: "1.1rem" }}>✓</span>
                    <span style={{ fontSize: "0.88rem", color: "#e2e8f0", fontWeight: 600 }}>{point}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/submit" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
                  Try Feedback Submission →
                </Link>
                <Link href="/explorer" className="btn-secondary" style={{ padding: "0.75rem 1.25rem" }}>
                  Inspect Ledger State
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live On-Chain Telemetry Grid */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value text-gradient-emerald">6 Circuits</div>
            <div className="stat-label">Compact v0.23 Logic</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem" }}>
              submit, verify, flag, authority, reset, session
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: "#06b6d4" }}>
              8 Fields
            </div>
            <div className="stat-label">Public Ledger State</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem" }}>
              Counters, public hashes & catalog ID
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: "#c084fc" }}>
              5 Witnesses
            </div>
            <div className="stat-label">Zero-Disclosure Secrets</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem" }}>
              buyerKey, invoiceHash, rating, nonce, merchantKey
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: "#fbbf24" }}>
              100% ZK
            </div>
            <div className="stat-label">Zero Identity Leaks</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem" }}>
              Cryptographic binding commitment
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Verified Feedback Feed */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: "0.5rem" }}>
              Live Consumer Feedback
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc" }}>
              Verified Buyer Reviews Feed
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.2rem" }}>
              All reviews below hold verified zero-knowledge purchase proofs anchored on Midnight Preview.
            </p>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(0, 0, 0, 0.4)",
              padding: "0.3rem",
              borderRadius: "50px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              gap: "0.25rem",
            }}
          >
            {[
              { id: "all", label: "All Reviews" },
              { id: "5star", label: "5-Star" },
              { id: "4star", label: "4-Star" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "50px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.2s ease",
                  background: selectedFilter === f.id ? "rgba(16, 185, 129, 0.2)" : "transparent",
                  color: selectedFilter === f.id ? "#34d399" : "#94a3b8",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: selectedFilter === f.id ? "rgba(16, 185, 129, 0.4)" : "transparent",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-card"
              style={{
                padding: "1.75rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "1.1rem", color: "#fbbf24" }}>
                      {"★".repeat(rev.stars)}
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f8fafc" }}>
                      {rev.product}
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "99px",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34d399",
                        fontWeight: 800,
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      ✓ VERIFIED ZK PURCHASE
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    Merchant: <strong style={{ color: "#cbd5e1" }}>{rev.merchant}</strong> • {rev.date}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "#64748b",
                      background: "rgba(0, 0, 0, 0.3)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                    }}
                  >
                    Commitment: {rev.commitment.substring(0, 10)}...{rev.commitment.slice(-6)}
                  </span>
                </div>
              </div>

              <p style={{ color: "#cbd5e1", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                "{rev.text}"
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  paddingTop: "0.75rem",
                  fontSize: "0.75rem",
                  color: "#64748b",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <span>Proof Status: Finalized on Midnight Preview</span>
                <Link
                  href="/submit"
                  style={{ color: "#34d399", textDecoration: "none", fontWeight: 700 }}
                >
                  Verify in Audit Engine →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selective Disclosure Privacy Matrix */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span className="badge badge-cyan" style={{ marginBottom: "0.5rem" }}>
            Privacy Architecture
          </span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc" }}>
            Web2 Reviews vs. Midnight ZK Feedback
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.2rem" }}>
            How zero-knowledge proofs eliminate consumer surveillance in retail reviews.
          </p>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "1.75rem",
            overflowX: "auto",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <th style={{ padding: "0.85rem 1rem", color: "#94a3b8", fontSize: "0.82rem", textTransform: "uppercase" }}>
                  Data Dimension
                </th>
                <th style={{ padding: "0.85rem 1rem", color: "#ef4444", fontSize: "0.82rem", textTransform: "uppercase" }}>
                  Traditional Web2 Review Platforms
                </th>
                <th style={{ padding: "0.85rem 1rem", color: "#10b981", fontSize: "0.82rem", textTransform: "uppercase" }}>
                  Midnight Anonymous Buyer Feedback (ZK)
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.88rem" }}>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                  Buyer Identity & Profile
                </td>
                <td style={{ padding: "1rem", color: "#fca5a5" }}>
                  🚨 Full name, profile photo, and public review history exposed
                </td>
                <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                  🛡️ Anonymous key retained on local client device only
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                  Order Receipt & Invoice
                </td>
                <td style={{ padding: "1rem", color: "#fca5a5" }}>
                  🚨 Credit card number, billing address, and item details stored on server
                </td>
                <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                  🛡️ Blind SHA-256 hash witness; receipt never leaves user device
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                  Rating Validation
                </td>
                <td style={{ padding: "1rem", color: "#fca5a5" }}>
                  🚨 Centralized database susceptible to bot reviews and manipulation
                </td>
                <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                  🛡️ Cryptographic bounds (1 &le; rating &le; 5) verified in SNARK circuit
                </td>
              </tr>
              <tr>
                <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                  Spam & Replay Resistance
                </td>
                <td style={{ padding: "1rem", color: "#fca5a5" }}>
                  🚨 Invasive CAPTCHAs, email verification, and IP address tracking
                </td>
                <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                  🛡️ Cryptographic nonce + on-chain epoch counter prevents replay
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Verified Smart Contract Coordinates */}
      <section>
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>📜</span>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f8fafc" }}>
                  Live Deployed Midnight Smart Contract
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
                  Compact v0.23 • Verified on Midnight Explorer • Zero-Knowledge Prover Enabled
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "99px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                fontWeight: 800,
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              ● ACTIVE ON PREVIEW TESTNET
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
              background: "rgba(0, 0, 0, 0.4)",
              padding: "0.85rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                Contract:
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  color: "#34d399",
                  wordBreak: "break-all",
                }}
              >
                {CONTRACT_ADDRESS}
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={copyAddress}
                className="btn-secondary"
                style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}
              >
                {copied ? "✓ Copied" : "Copy Address"}
              </button>
              <a
                href={NETWORK_CONFIG.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: "0.45rem 1.15rem", fontSize: "0.8rem" }}
              >
                Midnight Explorer ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
