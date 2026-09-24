"use client";
import React, { useState } from "react";
import { NETWORK_CONFIG } from "../lib/contract";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  walletAddress: string | null;
  onDisconnect: () => void;
  connecting: boolean;
}

export default function WalletConnectModal({
  isOpen,
  onClose,
  onConnect,
  walletAddress,
  onDisconnect,
  connecting,
}: WalletConnectModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<"lace" | "oneam">("lace");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnectAction = async () => {
    setErrorMsg(null);
    try {
      await onConnect();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Wallet connection rejected or not found.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.4rem" }}>🛡️</span>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                Connect Midnight Wallet
              </h3>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Select an authorized ZK prover wallet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ✕
          </button>
        </div>

        {/* Status if already connected */}
        {walletAddress ? (
          <div>
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                ● Active Wallet Session
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#f8fafc", wordBreak: "break-all" }}>
                {walletAddress}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="btn-secondary"
                style={{ flex: 1, borderColor: "rgba(239, 68, 68, 0.4)", color: "#f87171" }}
              >
                Disconnect Session
              </button>
              <button onClick={onClose} className="btn-primary" style={{ flex: 1 }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Wallet Selection Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {/* Lace Midnight */}
              <div
                onClick={() => setSelectedWallet("lace")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "14px",
                  background: selectedWallet === "lace" ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: `1.5px solid ${selectedWallet === "lace" ? "#10b981" : "rgba(255, 255, 255, 0.08)"}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    💎
                  </div>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff" }}>
                      Midnight Lace Wallet
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                      Official Midnight Browser Extension
                    </div>
                  </div>
                </div>
                {selectedWallet === "lace" && <span style={{ color: "#10b981", fontWeight: 800 }}>✓</span>}
              </div>

              {/* 1AM Wallet */}
              <div
                onClick={() => setSelectedWallet("oneam")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "14px",
                  background: selectedWallet === "oneam" ? "rgba(6, 182, 212, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: `1.5px solid ${selectedWallet === "oneam" ? "#06b6d4" : "rgba(255, 255, 255, 0.08)"}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff" }}>
                      1AM Midnight Wallet
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                      Community Multi-Platform Signer
                    </div>
                  </div>
                </div>
                {selectedWallet === "oneam" && <span style={{ color: "#06b6d4", fontWeight: 800 }}>✓</span>}
              </div>
            </div>

            {/* Network Info Pill */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.75rem",
              }}
            >
              <span style={{ color: "#94a3b8" }}>Target Network:</span>
              <span style={{ color: "#34d399", fontWeight: 700 }}>
                ● Midnight Preview ({NETWORK_CONFIG.networkId})
              </span>
            </div>

            {errorMsg && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  padding: "0.75rem",
                  color: "#fca5a5",
                  fontSize: "0.8rem",
                  marginBottom: "1.25rem",
                }}
              >
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleConnectAction}
              disabled={connecting}
              className="btn-primary"
              style={{ width: "100%", padding: "0.85rem" }}
            >
              {connecting ? (
                <>
                  <span className="spinner" /> Authorizing Connection...
                </>
              ) : (
                `Connect with ${selectedWallet === "lace" ? "Midnight Lace" : "1AM Wallet"}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
