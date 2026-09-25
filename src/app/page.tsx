import Link from "next/link";
import type { Metadata } from "next";
import { CONTRACT_ADDRESS, NETWORK_CONFIG, VERIFIED_DEPLOYMENT } from "@/lib/constants";
import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/ThreeScene"), { ssr: false });

export const metadata: Metadata = {
  title: "ABF — Anonymous Buyer Feedback | Midnight Network ZK dApp",
  description: "Leave anonymous zero-knowledge product reviews on the Midnight Network. No identity, no transaction trail, complete privacy.",
};

export default function HomePage() {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100vh - 64px)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "5rem 3.5rem 5rem 5rem", borderRight: "1px solid var(--border)",
        }}>
          <span className="badge badge-black" style={{ marginBottom: "1.2rem", alignSelf: "flex-start" }}>
            LIVE ON MIDNIGHT PREVIEW TESTNET
          </span>
          <h1 className="hero-display" style={{ marginBottom: "1.5rem" }}>
            ANONYMOUS.<br />VERIFIED.<br />TRUSTED.<br />FEEDBACK.
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--fg-2)", lineHeight: 1.65, maxWidth: 460, marginBottom: "2.5rem" }}>
            Leave honest e-commerce reviews using zero-knowledge proofs. Your identity, wallet address, and purchase receipts never touch the public ledger.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/submit" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.65rem 1.5rem" }}>
              Submit ZK Feedback &rarr;
            </Link>
            <Link href="/explorer" className="btn-outline" style={{ fontSize: "0.9rem", padding: "0.65rem 1.5rem" }}>
              Contract Explorer
            </Link>
          </div>
        </div>
        <div style={{ position: "relative", background: "var(--bg)", minHeight: 480 }}>
          <ThreeScene />
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="stats-grid" style={{ borderRadius: 0, border: "none" }}>
          {[
            { value: "5", label: "ZK Circuits", sub: "Compact v0.23" },
            { value: "0", label: "PII Leaked", sub: "100% Zero-Knowledge" },
            { value: "142+", label: "Verified Reviews", sub: "On-Chain Ledger" },
            { value: "tDUST", label: "Shielded Gas", sub: "Midnight Preview" },
          ].map(({ value, label, sub }) => (
            <div key={label} className="stat-card">
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ON-CHAIN DEPLOYMENT SUMMARY */}
      <section style={{ padding: "4rem 5rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span className="badge" style={{ marginBottom: "0.75rem" }}>VERIFIED DEPLOYMENT</span>
          <h2 className="section-title">On-Chain Evidence</h2>
          <p className="section-desc">Live smart contract deployed and verified on the Midnight Network Preview testnet.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="card">
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-3)", marginBottom: "0.4rem" }}>
              Contract Address
            </div>
            <code className="mono-text" style={{ fontSize: "0.82rem" }}>{CONTRACT_ADDRESS}</code>
          </div>
          <div className="card">
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-3)", marginBottom: "0.4rem" }}>
              Network & Language
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--fg)" }}>
              {VERIFIED_DEPLOYMENT.network} — {VERIFIED_DEPLOYMENT.contractLanguage}
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY ARCHITECTURE FEATURES */}
      <section style={{ padding: "5rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ marginBottom: "3rem" }}>
          <span className="badge" style={{ marginBottom: "0.75rem" }}>ZK ARCHITECTURE</span>
          <h2 className="section-title">How Privacy Is Preserved</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border)" }}>
          {[
            {
              num: "01",
              title: "Anonymous Proofs",
              desc: "ZK proofs are generated locally in your browser memory using your buyer secret key and invoice hash. No wallet signature leaks your identity."
            },
            {
              num: "02",
              title: "Anti-Replay Sessions",
              desc: "Cryptographic nullifiers bind each feedback to an active session epoch, ensuring sybil resistance and preventing double-submission."
            },
            {
              num: "03",
              title: "Merchant Authority",
              desc: "Merchants anchor authority on-chain via ZK witnesses to flag invalid reviews or rotate catalogs without exposing master credentials."
            },
          ].map(({ num, title, desc }) => (
            <div key={num} style={{ background: "var(--card)", padding: "2.5rem 2rem" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", fontWeight: 900, color: "var(--fg-4)", lineHeight: 1, marginBottom: "1rem" }}>
                {num}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.75rem" }}>
                {title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-3)", lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTAL NAVIGATION */}
      <section style={{ padding: "5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            {
              href: "/submit",
              label: "Feedback Portal",
              desc: "Generate client-side zero-knowledge proof and submit anonymous review.",
              tag: "ZK Circuits 1 & 2"
            },
            {
              href: "/merchant",
              label: "Merchant Console",
              desc: "Manage signing authority, review dispute flags, and rotate product catalog.",
              tag: "ZK Circuits 3, 4 & 5"
            },
            {
              href: "/explorer",
              label: "Contract Explorer",
              desc: "Inspect live on-chain ledger state, counter registers, and indexer GraphQL.",
              tag: "Live Indexer"
            },
          ].map(({ href, label, desc, tag }) => (
            <Link key={href} href={href} className="card" style={{ display: "block", textDecoration: "none", transition: "transform 0.15s, border-color 0.15s" }}>
              <span className="badge" style={{ marginBottom: "1rem" }}>{tag}</span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.5rem", color: "var(--fg)" }}>
                {label}
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--fg-3)", marginBottom: "1.5rem" }}>{desc}</p>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--fg)" }}>
                Launch Portal &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}