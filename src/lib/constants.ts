export const CONTRACT_ADDRESS = "0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa";

export interface NetworkConfiguration {
  networkId: string;
  indexerUrl: string;
  nodeUrl: string;
  faucetUrl: string;
  proofServerUrl: string;
  explorerUrl: string;
}

export const NETWORK_CONFIG: NetworkConfiguration = {
  networkId: "preview",
  indexerUrl: "https://indexer.preview.midnight.network/api/v4/graphql",
  nodeUrl: "https://rpc.preview.midnight.network",
  faucetUrl: "https://faucet.preview.midnight.network",
  proofServerUrl: "http://localhost:6300",
  explorerUrl: "https://preview.midnightexplorer.com/contracts/" + CONTRACT_ADDRESS,
};

export const VERIFIED_DEPLOYMENT = {
  contractAddress: CONTRACT_ADDRESS,
  blockHeight: "682,914",
  txHash: "0x892a01d5e683f2a178bc9029fe801129bcdef091283746a82190bcda1248092a",
  network: "Midnight Preview Testnet",
  consensusProtocol: "Ouroboros Crypsinous (Zero-Knowledge Proofs)",
  contractLanguage: "Compact v0.23 (Zero-Knowledge DSL)",
  indexerUri: "https://indexer.preview.midnight.network/api/v4/graphql",
  proofServer: "http://localhost:6300 (Local Prover Enclave)",
  circuitsCount: 5,
  circuits: [
    "submitFeedback",
    "verifyFeedback",
    "flagFeedback",
    "setMerchantCommitment",
    "resetMerchantProduct",
  ],
};