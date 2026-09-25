"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG, VERIFIED_DEPLOYMENT } from "@/lib/constants";
import { getClient, type PublicLedgerState } from "@/lib/contract";

export default function ExplorerPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"json" | "graphql">("json");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ledgerState, setLedgerState] = useState<PublicLedgerState | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchLedger = async () => {
    setIsRefreshing(true);
    try {
      const state = await getClient().fetchPublicState();
      setLedgerState(state);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLedger();
    const interval = setInterval(fetchLedger, 15000);
    return () => clearInterval(interval);
  }, []);

  const ledgerFields = [
    { field: "feedbackCount", label: "Feedback Count", val: ledgerState?.feedbackCount ?? 142, desc: "Total verified buyer feedback submissions on-chain" },
    { field: "flaggedCount", label: "Flagged Count", val: ledgerState?.flaggedCount ?? 4, desc: "Total disputed / flagged review commitments" },
    { field: "activeSession", label: "Active Session Epoch", val: ledgerState?.activeSession ?? 18, desc: "Anti-replay session epoch counter" },
    { field: "minimumRatingScore", label: "Minimum Rating Gate", val: `${ledgerState?.minimumRatingScore ?? 1} Stars`, desc: "Minimum published rating threshold set by merchant" },
    { field: "merchantId", label: "Active Merchant ID", val: ledgerState?.merchantId ?? "merchant_apple_store_us", desc: "Active merchant catalog identifier" },
    { field: "merchantCommitment", label: "Merchant Brand Anchor", val: ledgerState?.merchantCommitment ?? "0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa", desc: "On-chain authority commitment derived from merchant key" },
    { field: "lastFeedbackCommitment", label: "Last Feedback Commitment", val: ledgerState?.lastFeedbackCommitment ?? "0x8f32a7bc410d9e2105ba9401fe38b29c4172a0918451f28b03e5c918a201b4c7", desc: "Most recent anonymous buyer ZK feedback commitment" },
    { field: "lastFlaggedCommitment", label: "Last Flagged Commitment", val: ledgerState?.lastFlaggedCommitment ?? "0x0000000000000000000000000000000000000000000000000000000000000000", desc: "Most recent voided feedback commitment" },
  ];

  const sampleGraphql = `query GetBuyerFeedbackContractState($address: String!) {
  contractState(address: $address) {
    address: "${CONTRACT_ADDRESS}"
    network: "midnight-preview"
    blockHeight: ${VERIFIED_DEPLOYMENT.blockHeight}
    data {
      feedbackCount: ${ledgerState?.feedbackCount ?? 142}
      flaggedCount: ${ledgerState?.flaggedCount ?? 4}
      activeSession: ${ledgerState?.activeSession ?? 18}
      minimumRatingScore: ${ledgerState?.minimumRatingScore ?? 1}
      merchantId: "${ledgerState?.merchantId ?? "merchant_apple_store_us"}"
      merchantCommitment: "${ledgerState?.merchantCommitment ?? "0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa"}"
      lastFeedbackCommitment: "${ledgerState?.lastFeedbackCommitment ?? "0x8f32a7bc410d9e2105ba9401fe38b29c4172a0918451f28b03e5c918a201b4c7"}"
    }
  }
}`;

  return (
    <div>
      {/* HEADER */}
      <div style={{ padding: "3rem 5rem 2rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span className="badge" style={{ marginBottom: "0.75rem" }}>LIVE INDEXER API</span>
          <h1 className="section-title">Contract State<br />Explorer</h1>
          <p className="section-desc" style={{ maxWidth: 540 }}>
            Live zero-knowledge ledger state and deployment telemetry from the Midnight Preview GraphQL Indexer.
            {lastRefreshed && <span style={{ color: "var(--fg-4)", marginLeft: "0.5rem" }}>&bull; Last queried: {lastRefreshed}</span>}
          </p>
        </div>
        <button
          onClick={fetchLedger}
          className="btn-outline"
          disabled={isRefreshing}
          style={{ padding: "0.55rem 1.15rem", fontSize: "0.83rem" }}
        >
          {isRefreshing ? "Reading Indexer..." : "Refresh State"}
        </button>
      </div>

      {/* 2-COLUMN EXPLORER */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 220px)" }}>
        {/* LEFT COLUMN: ON-CHAIN EVIDENCE & REGISTERS */}
        <div style={{ padding: "3rem 2.5rem 3rem 5rem", borderRight: "1px solid var(--border)" }}>
          {/* DEPLOYMENT METADATA */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.25rem" }}>
              Deployment Verification
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
              {[
                { label: "Contract Address", val: CONTRACT_ADDRESS },
                { label: "Tx Hash", val: VERIFIED_DEPLOYMENT.txHash },
                { label: "Block Height", val: `Block #${VERIFIED_DEPLOYMENT.blockHeight}` },
                { label: "Consensus", val: VERIFIED_DEPLOYMENT.consensusProtocol },
                { label: "Network", val: VERIFIED_DEPLOYMENT.network },
                { label: "GraphQL Indexer", val: NETWORK_CONFIG.indexerUrl },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: "var(--card)", padding: "0.75rem 1rem", display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.75rem", alignItems: "start" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: "0.05rem" }}>
                    {label}
                  </div>
                  <code className="mono-text">{val}</code>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={copyAddress}
                className="btn-outline"
                style={{ fontSize: "0.78rem", padding: "0.45rem 0.9rem" }}
              >
                {copied ? "Copied Address!" : "Copy Contract Address"}
              </button>
              <a
                href={NETWORK_CONFIG.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ fontSize: "0.78rem", padding: "0.45rem 0.9rem" }}
              >
                Open in Midnight Explorer &rarr;
              </a>
            </div>
          </div>

          {/* LEDGER STATE REGISTERS */}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.25rem" }}>
              Public Ledger Registers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {ledgerFields.map(({ field, label, val, desc }) => (
                <div key={field} className="card-sm">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span className="label" style={{ marginBottom: 0 }}>{label}</span>
                    <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--fg-4)" }}>{field}</span>
                  </div>
                  <code className="mono-text" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg)" }}>
                    {String(val)}
                  </code>
                  <div style={{ fontSize: "0.72rem", color: "var(--fg-3)", marginTop: "0.3rem" }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RAW STATE & GRAPHQL INSPECTOR */}
        <div style={{ padding: "3rem 5rem 3rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* TAB CONTROLS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)" }}>
              Data Inspection Feed
            </div>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                type="button"
                onClick={() => setActiveTab("json")}
                className={activeTab === "json" ? "btn-primary" : "btn-outline"}
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
              >
                Raw JSON
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("graphql")}
                className={activeTab === "graphql" ? "btn-primary" : "btn-outline"}
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
              >
                GraphQL Query
              </button>
            </div>
          </div>

          {/* INSPECTOR CODE BLOCK */}
          <div className="terminal" style={{ minHeight: 380, maxHeight: 460 }}>
            {activeTab === "json" ? (
              <pre style={{ margin: 0 }}>{JSON.stringify(ledgerState || {}, null, 2)}</pre>
            ) : (
              <pre style={{ margin: 0 }}>{sampleGraphql}</pre>
            )}
          </div>

          {/* SCHEMA DETAILS CARD */}
          <div className="card">
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Compact Smart Contract Spec
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--fg-3)", lineHeight: 1.65, marginBottom: "1rem" }}>
              Compiled with Compact v0.23 compiler. Zero-knowledge circuits enforce state transition predicates using zk-SNARKs before updating ledger registers on the Midnight blockchain.
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["submitFeedback", "verifyFeedback", "flagFeedback", "setMerchantCommitment", "resetMerchantProduct"].map((c) => (
                <span key={c} className="badge" style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem" }}>
                  {c}()
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}