"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getClient, type AnonymousBuyerFeedbackClient } from "../lib/contract";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const ok = sessionStorage.getItem("abf_wallet_connected") === "true";
      const addr = sessionStorage.getItem("abf_wallet_address");
      if (ok && addr) setWalletAddress(addr);
    } catch {}
  }, []);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const client: AnonymousBuyerFeedbackClient = getClient();
      const res = await client.connectWallet();
      const addr = typeof res.walletAddress === "string" ? res.walletAddress : JSON.stringify(res.walletAddress);
      setWalletAddress(addr);
      try {
        sessionStorage.setItem("abf_wallet_connected", "true");
        sessionStorage.setItem("abf_wallet_address", addr);
      } catch {}
    } catch (err: any) {
      alert(err?.message || "Wallet connection failed.");
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    try { getClient().disconnectWallet(); } catch {}
    setWalletAddress(null);
    try {
      sessionStorage.removeItem("abf_wallet_connected");
      sessionStorage.removeItem("abf_wallet_address");
    } catch {}
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        walletAddress={mounted ? walletAddress : null}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        connecting={connecting}
      />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}