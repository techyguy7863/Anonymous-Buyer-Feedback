"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({
  walletAddress,
  onConnect,
  onDisconnect,
  connecting
}: {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  connecting: boolean;
}) {
  const pathname = usePathname();
  const shortAddr = walletAddress
    ? `${walletAddress.substring(0, 8)}...${walletAddress.slice(-6)}`
    : null;

  return (
    <header className="nav">
      <Link href="/" className="nav-brand">
        <span style={{ fontSize: "1.25rem" }}>🛡️</span>
        <span style={{ fontWeight: 800, background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ABF.zk
        </span>
        <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "6px", color: "#10b981", fontWeight: 700, marginLeft: "0.25rem" }}>
          Midnight Preview
        </span>
      </Link>
      <div className="nav-links">
        <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link href="/submit" className={`nav-link ${pathname === "/submit" ? "active" : ""}`}>
          Submit Feedback
        </Link>
        <Link href="/merchant" className={`nav-link ${pathname === "/merchant" ? "active" : ""}`}>
          Merchant Console
        </Link>
        <Link href="/explorer" className={`nav-link ${pathname === "/explorer" ? "active" : ""}`}>
          Explorer
        </Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {walletAddress ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.78rem",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#10b981",
                padding: "0.35rem 0.85rem",
                borderRadius: "99px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <span>👛</span> {shortAddr}
            </span>
            <button
              onClick={onDisconnect}
              className="btn-secondary"
              style={{ padding: "0.35rem 0.85rem", fontSize: "0.78rem" }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            id="connect-wallet-btn"
            onClick={onConnect}
            disabled={connecting}
            className="btn-primary"
            style={{ padding: "0.45rem 1.1rem", fontSize: "0.82rem" }}
          >
            {connecting ? (
              <>
                <span className="spinner" /> Connecting...
              </>
            ) : (
              <>Connect Wallet</>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
