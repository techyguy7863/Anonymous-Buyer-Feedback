"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnectModal from "./WalletConnectModal";

export default function Navbar({
  walletAddress,
  onConnect,
  onDisconnect,
  connecting,
}: {
  walletAddress: string | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  connecting: boolean;
}) {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);

  const shortAddr = walletAddress
    ? `${walletAddress.substring(0, 10)}...${walletAddress.slice(-6)}`
    : null;

  return (
    <>
      <header className="nav">
        {/* Brand */}
        <Link href="/" className="nav-brand">
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.15rem",
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
            }}
          >
            🛡️
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "#f8fafc" }}>
                ABF<span style={{ color: "#10b981" }}>.ZK</span>
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
                  padding: "0.15rem 0.5rem",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "99px",
                  color: "#34d399",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                }}
              >
                PREVIEW
              </span>
            </div>
            <div style={{ fontSize: "0.62rem", color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Anonymous Buyer Feedback
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link href="/submit" className={`nav-link ${pathname === "/submit" ? "active" : ""}`}>
            Submit ZK Feedback
          </Link>
          <Link href="/merchant" className={`nav-link ${pathname === "/merchant" ? "active" : ""}`}>
            Merchant Console
          </Link>
          <Link href="/explorer" className={`nav-link ${pathname === "/explorer" ? "active" : ""}`}>
            Explorer
          </Link>
        </nav>

        {/* Wallet & Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {walletAddress ? (
            <button
              onClick={() => setModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.45rem 0.95rem",
                borderRadius: "50px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#34d399",
                fontSize: "0.8rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <span>{shortAddr}</span>
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}
            >
              {connecting ? (
                <>
                  <span className="spinner" /> Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </button>
          )}
        </div>
      </header>

      {/* Connect Modal */}
      <WalletConnectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConnect={onConnect}
        walletAddress={walletAddress}
        onDisconnect={onDisconnect}
        connecting={connecting}
      />
    </>
  );
}
