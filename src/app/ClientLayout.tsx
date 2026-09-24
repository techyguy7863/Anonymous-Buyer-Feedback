"use client";

import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { getClient, type AnonymousBuyerFeedbackClient } from "../lib/contract";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const ok = sessionStorage.getItem("abf_wallet_connected") === "true";
    const addr = sessionStorage.getItem("abf_wallet_address");
    return ok && addr ? addr : null;
  });
  const [connecting, setConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const client: AnonymousBuyerFeedbackClient = getClient();
      const res = await client.connectWallet();
      setWalletAddress(res.walletAddress);
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    const client: AnonymousBuyerFeedbackClient = getClient();
    client.disconnectWallet();
    setWalletAddress(null);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        connecting={connecting}
      />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
