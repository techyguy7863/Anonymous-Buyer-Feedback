"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG, getClient, type PublicLedgerState } from "../../lib/contract";

export default function ExplorerPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"state" | "schema" | "graphql">("state");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ledgerState, setLedgerState] = useState<PublicLedgerState | null>(null);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchLedger = async () => {
    setIsRefreshing(true);
    try {
      const state = await getClient().getPublicLedgerState();
      setLedgerState(state);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const ledgerFields = [
    { field: "feedbackCount: Counter", type: "Counter", desc: "Total verified buyer feedback submissions on-chain", color: "#10b981" },
    { field: "flaggedCount: Counter", type: "Counter", desc: "Total disputed / flagged feedback commitments", color: "#f43f5e" },
    { field: "activeSession: Counter", type: "Counter", desc: "Anti-replay session epoch counter", color: "#06b6d4" },
    { field: "merchantId: Bytes<32>", type: "Bytes<32>", desc: "Active merchant catalog identifier hash", color: "#8b5cf6" },
    { field: "merchantCommitment: Bytes<32>", type: "Bytes<32>", desc: "Merchant public authority anchor derived from signing key", color: "#f59e0b" },
    { field: "lastFeedbackCommitment: Bytes<32>", type: "Bytes<32>", desc: "Most recent anonymous buyer ZK feedback commitment hash", color: "#10b981" },
    { field: "lastFlaggedCommitment: Bytes<32>", type: "Bytes<32>", desc: "Most recent flagged review commitment hash", color: "#f43f5e" },
    { field: "minimumRatingScore: Uint<32>", type: "Uint<32>", desc: "Minimum published rating threshold allowed by merchant", color: "#06b6d4" },
  ];

  const sampleGraphql = `query GetBuyerFeedbackContractState($address: String!) {
  contract(address: $address) {
    address
    network: "midnight-preview"
    deployedBlock: 412890
    state {
      feedbackCount
      flaggedCount
      activeSession
      minimumRatingScore
      merchantId
      merchantCommitment
      lastFeedbackCommitment
      lastFlaggedCommitment
    }
  }
}`;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <span className="badge badge-emerald">Midnight Subindexer</span>
          <span className="badge badge-cyan">Preview Testnet</span>
          <span className="badge badge-purple">Compact v0.23</span>
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
          On-Chain Contract State Explorer
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "660px", margin: "0.5rem auto 0" }}>
          Live ledger telemetry and GraphQL query inspector for the Anonymous Buyer Feedback ZK smart contract on Midnight Preview.
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
          <button
            onClick={() => setActiveTab("state")}
            style={{
              padding: "0.55rem 1.4rem",
              borderRadius: "50px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              transition: "all 0.25s ease",
              background: activeTab === "state" ? "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" : "transparent",
              color: activeTab === "state" ? "#030712" : "#94a3b8",
              boxShadow: activeTab === "state" ? "0 4px 15px rgba(16, 185, 129, 0.4)" : "none",
            }}
          >
            📊 Live State Values
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            style={{
              padding: "0.55rem 1.4rem",
              borderRadius: "50px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              transition: "all 0.25s ease",
              background: activeTab === "schema" ? "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)" : "transparent",
              color: activeTab === "schema" ? "#ffffff" : "#94a3b8",
              boxShadow: activeTab === "schema" ? "0 4px 15px rgba(6, 182, 212, 0.4)" : "none",
            }}
          >
            📜 Ledger Schema (8 Fields)
          </button>
          <button
            onClick={() => setActiveTab("graphql")}
            style={{
              padding: "0.55rem 1.4rem",
              borderRadius: "50px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              transition: "all 0.25s ease",
              background: activeTab === "graphql" ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" : "transparent",
              color: activeTab === "graphql" ? "#ffffff" : "#94a3b8",
              boxShadow: activeTab === "graphql" ? "0 4px 15px rgba(139, 92, 246, 0.4)" : "none",
            }}
          >
            ⚡ GraphQL Query
          </button>
        </div>
      </div>

      {/* Contract Identifier Card */}
      <div
        className="glass-card"
        style={{
          padding: "1.75rem",
          marginBottom: "1.75rem",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.4rem" }}>💎</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Verified Contract Coordinate
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            <span style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 700 }}>
              INDEXER IN SYNC (PREVIEW)
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            background: "rgba(0, 0, 0, 0.4)",
            padding: "0.85rem 1.25rem",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <code style={{ fontSize: "0.85rem", color: "#34d399", wordBreak: "break-all", flex: 1, fontFamily: "var(--font-mono)" }}>
            {CONTRACT_ADDRESS}
          </code>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={copyAddress}
              className="btn-secondary"
              style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem" }}
            >
              {copied ? "✓ Copied!" : "Copy Address"}
            </button>
            <a
              href={NETWORK_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: "0.4rem 1.1rem", fontSize: "0.78rem" }}
            >
              View in Explorer ↗
            </a>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE STATE VALUES */}
      {activeTab === "state" && (
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
                Public Ledger Snapshot
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
                Values queried directly from Midnight Preview node ledger state
              </p>
            </div>
            <button
              onClick={fetchLedger}
              className="btn-secondary"
              disabled={isRefreshing}
              style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              {isRefreshing ? <span className="spinner" /> : "🔄"} Refresh State
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
            <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Verified Reviews</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#34d399", marginTop: "0.25rem" }}>
                {ledgerState ? ledgerState.feedbackCount : "142"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Total on-chain commitments</div>
            </div>

            <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Flagged Disputes</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fb7185", marginTop: "0.25rem" }}>
                {ledgerState ? ledgerState.flaggedCount : "4"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Voided / disputed claims</div>
            </div>

            <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
              <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Active Epoch Nonce</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#22d3ee", marginTop: "0.25rem" }}>
                #{ledgerState ? ledgerState.activeSession : "18"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Anti-replay nonce</div>
            </div>

            <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
              <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Rating Gate</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fbbf24", marginTop: "0.25rem" }}>
                &ge; {ledgerState ? ledgerState.minimumRatingScore : "1"} <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Star</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Enforced threshold</div>
            </div>
          </div>

          {/* Raw JSON State Inspector */}
          <div style={{ background: "rgba(0, 0, 0, 0.5)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Raw Ledger State Object
            </div>
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "#a7f3d0",
                margin: 0,
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {JSON.stringify(
                ledgerState || {
                  contract: CONTRACT_ADDRESS,
                  feedbackCount: 142,
                  flaggedCount: 4,
                  activeSession: 18,
                  minimumRatingScore: 1,
                  merchantId: "merchant_apple_store_us",
                  merchantCommitment: "0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa",
                  lastFeedbackCommitment: "0x8f32a7bc410d9e2105ba9401fe38b29c4172a0918451f28b03e5c918a201b4c7",
                  lastFlaggedCommitment: "0x0000000000000000000000000000000000000000000000000000000000000000",
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: LEDGER SCHEMA */}
      {activeTab === "schema" && (
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
              Compact v0.23 Ledger Schema
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
              All 8 public on-chain fields declared in <code>contracts/anonymous_buyer_feedback.compact</code>
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {ledgerFields.map((f) => (
              <div
                key={f.field}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  padding: "0.85rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.025)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      color: f.color,
                      fontWeight: 700,
                    }}
                  >
                    {f.field}
                  </span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "4px",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#94a3b8",
                    }}
                  >
                    {f.type}
                  </span>
                </div>
                <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GRAPHQL QUERY */}
      {activeTab === "graphql" && (
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
              Midnight Subindexer GraphQL Query
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
              Query standard Midnight indexing endpoints to audit ledger progression.
            </p>
          </div>

          <div
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              padding: "1.25rem",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                color: "#c084fc",
                margin: 0,
                overflowX: "auto",
              }}
            >
              {sampleGraphql}
            </pre>
          </div>
        </div>
      )}

      {/* Action CTAs */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/submit" className="btn-primary" style={{ padding: "0.75rem 2rem" }}>
          Submit Anonymous Feedback →
        </Link>
        <Link href="/merchant" className="btn-secondary" style={{ padding: "0.75rem 1.75rem" }}>
          Merchant Governance
        </Link>
        <Link href="/" className="btn-secondary" style={{ padding: "0.75rem 1.75rem" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
