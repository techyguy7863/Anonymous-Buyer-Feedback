"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const addrStr = walletAddress
    ? typeof walletAddress === "string" ? walletAddress : JSON.stringify(walletAddress)
    : null;

  const shortAddr = addrStr && addrStr.length >= 6
    ? `${addrStr.substring(0, 6)}...${addrStr.slice(-4)}`
    : addrStr || null;

  const links = [
    { href: "/",         label: "Dashboard" },
    { href: "/submit",   label: "Submit Feedback" },
    { href: "/merchant", label: "Merchant Console" },
    { href: "/explorer", label: "Explorer" },
  ];

  return (
    <header className="nav">
      <Link href="/" className="nav-brand">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
          <rect width="22" height="22" rx="5" fill="#0A0A0A"/>
          <circle cx="11" cy="8" r="3" fill="white"/>
          <path d="M5 18 Q11 12 17 18" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
        ABF<span className="dot">.</span>
      </Link>

      <nav className="nav-links">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className={`nav-link${pathname === href ? " active" : ""}`}>
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {addrStr ? (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "var(--bg-alt)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "0.3rem 0.75rem",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0A0A0A", display: "inline-block" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{shortAddr}</span>
            </div>
            <button onClick={onDisconnect} className="btn-outline" style={{ padding: "0.3rem 0.8rem", fontSize: "0.78rem" }}>
              Disconnect
            </button>
          </>
        ) : (
          <button onClick={onConnect} className="btn-primary"
            style={{ padding: "0.42rem 1.1rem", fontSize: "0.83rem" }} disabled={connecting}>
            {connecting ? <><span className="spinner" /> Connecting...</> : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}