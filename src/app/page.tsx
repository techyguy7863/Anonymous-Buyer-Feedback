import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anonymous Buyer Feedback | Zero-Knowledge E-Commerce Reviews on Midnight',
  description: 'Submit and verify e-commerce product reviews anonymously using zero-knowledge proofs on the Midnight Network.',
};

const CONTRACT_ADDRESS = "0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa";
const EXPLORER_URL = `https://preview.midnightexplorer.com/contracts/${CONTRACT_ADDRESS}`;

export default function HomePage() {
  const stats = [
    { value: '6', label: 'ZK Circuits', color: '#10b981', desc: 'Compact v0.23 logic' },
    { value: '8', label: 'Ledger Fields', color: '#06b6d4', desc: 'Public on-chain state' },
    { value: '5', label: 'Private Witnesses', color: '#8b5cf6', desc: 'Client-side secrets' },
    { value: '10/10', label: 'Unit Tests Passing', color: '#f59e0b', desc: 'Vitest test suite' },
  ];

  const features = [
    {
      icon: '🛡️',
      title: 'Zero-Knowledge Review Proofs',
      desc: 'Prove purchase authenticity and submit star ratings in ZK without exposing buyer name, address, or credit card on-chain.',
      badge: 'Privacy-First',
      color: '#10b981',
    },
    {
      icon: '⭐',
      title: 'Cryptographic Rating Bounds',
      desc: 'Review scores (1-5 stars) are mathematically constrained and validated inside the ZK circuit before commitment generation.',
      badge: 'Tamper-Proof',
      color: '#06b6d4',
    },
    {
      icon: '🏬',
      title: 'Merchant Authority & Moderation',
      desc: 'Merchants anchor review criteria, rotate catalog epochs, and flag disputed reviews using private signing keys.',
      badge: 'Governance',
      color: '#8b5cf6',
    },
    {
      icon: '⚡',
      title: 'Replay Attack Protection',
      desc: 'Active session nonces prevent duplicate submissions from the same purchase across different catalog epochs.',
      badge: 'Security',
      color: '#f59e0b',
    },
  ];

  const circuits = [
    { name: 'submitFeedback', inputs: 'expectedMerchantId: Bytes<32>', witnesses: 'buyerSecretKey, orderInvoiceHash, ratingScore, nonce', desc: 'Private review prover — validates rating bounds and publishes commitment' },
    { name: 'verifyFeedback', inputs: 'claimedCommitment: Bytes<32>', witnesses: 'None (Public)', desc: 'Public verification of published review commitment against ledger state' },
    { name: 'flagFeedback', inputs: 'commitmentToFlag: Bytes<32>', witnesses: 'merchantSigningKey', desc: 'Authorized merchant moderation to dispute fraudulent review claims' },
    { name: 'setMerchantCommitment', inputs: 'newMinimumRating: Uint<32>', witnesses: 'merchantSigningKey', desc: 'Anchors brand authority commitment and sets minimum published rating' },
    { name: 'resetMerchantProduct', inputs: 'newMerchantId: Bytes<32>, minRating: Uint<32>', witnesses: 'None', desc: 'Rotates catalog identifier and initiates fresh catalog epoch' },
    { name: 'incrementSession', inputs: 'None', witnesses: 'None', desc: 'Increments active session counter for replay attack protection' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span>⚡</span> Midnight Preview Network — Live ZK Review Engine
        </div>
        <h1>Anonymous Buyer Feedback</h1>
        <p>
          Submit cryptographically verified product reviews and star ratings using <strong>zero-knowledge proofs</strong> — without disclosing your buyer identity, order receipts, purchase dates, or payment details on-chain.
        </p>
        <div className="hero-actions">
          <Link href="/submit" className="btn-primary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
            🛡️ Submit Feedback (ZK Proof)  
          </Link>
          <Link href="/merchant" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
            🏬 Merchant Console
          </Link>
          <Link href="/explorer" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
            🔍 Explorer
          </Link>
        </div>
      </section>

      {/* Verified Midnight Contract Banner */}
      <section style={{ marginBottom: "3rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem", borderLeft: "4px solid #10b981" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className="badge badge-emerald">On-Chain Verified</span>
                <span className="badge badge-cyan">Midnight Preview</span>
                <span className="badge badge-purple">Compact v0.23</span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.35rem" }}>
                Deployed Smart Contract
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "0.75rem" }}>
                Active Midnight testnet contract handling anonymous buyer feedback commitments and merchant governance.
              </p>
              <code style={{ fontSize: "0.8rem", color: "#06b6d4", wordBreak: "break-all", background: "rgba(6, 182, 212, 0.08)", padding: "0.35rem 0.65rem", borderRadius: "6px", display: "inline-block" }}>
                {CONTRACT_ADDRESS}
              </code>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a
                href={EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: "0.8rem", padding: "0.45rem 1rem" }}
              >
                View in Explorer ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div className="stats-grid">
          {stats.map((s, idx) => (
            <div key={idx} className="glass-card stat-card">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.35rem" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", textAlign: "center", color: "#f8fafc" }}>
          Core Privacy & Architecture Features
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <span className="badge" style={{ background: `${f.color}22`, color: f.color, border: `1px solid ${f.color}44`, marginBottom: "0.75rem" }}>
                {f.badge}
              </span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.5rem 0", color: "#f8fafc" }}>{f.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compact Smart Contract Circuits Directory */}
      <section style={{ marginBottom: "4rem" }}>
        <div className="glass-card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem", color: "#f8fafc" }}>
            Compact Smart Contract — 6 Circuits
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
            File: <code>contracts/anonymous_buyer_feedback.compact</code>
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {circuits.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <code style={{ fontSize: "0.88rem", fontWeight: 700, color: "#10b981" }}>{c.name}()</code>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{c.inputs}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.35rem" }}>{c.desc}</div>
                </div>
                <span style={{ fontSize: "0.72rem", color: "#8b5cf6", background: "rgba(139, 92, 246, 0.12)", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                  {c.witnesses}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
