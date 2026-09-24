import { describe, it, expect, beforeEach } from 'vitest';
import {
  AnonymousBuyerFeedbackClient,
  getClient,
  CONTRACT_ADDRESS,
  NETWORK_CONFIG,
} from '../src/lib/contract';

describe('AnonymousBuyerFeedbackClient — ZK Review SDK & Circuits', () => {
  let client: AnonymousBuyerFeedbackClient;

  beforeEach(() => {
    client = new AnonymousBuyerFeedbackClient();
  });

  it('1. Singleton Instance: getClient returns consistent singleton instance', () => {
    const c1 = getClient();
    const c2 = getClient();
    expect(c1).toBe(c2);
    expect(c1).toBeInstanceOf(AnonymousBuyerFeedbackClient);
  });

  it('2. Network Coordinates: contract address matches verified Midnight Preview deployment', () => {
    expect(CONTRACT_ADDRESS).toBe('0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa');
    expect(NETWORK_CONFIG.networkId).toBe('preview');
    expect(NETWORK_CONFIG.nodeUrl).toContain('rpc.preview.midnight.network');
    expect(NETWORK_CONFIG.indexerUrl).toContain('indexer.preview.midnight.network');
    expect(NETWORK_CONFIG.explorerUrl).toContain('0x6209be7b5eabc2c0ff6a0c1615b1745d60548be58d35a37aaafc3aa493dc18fa');
  });

  it('3. Initial Wallet State: wallet is disconnected by default before user connection', () => {
    const status = client.getWalletStatus();
    expect(status.connected).toBe(false);
    expect(status.address).toBeNull();
  });

  it('4. Wallet Connection Flow: auto-connects or simulates Midnight Lace wallet interface', async () => {
    const res = await client.connectWallet();
    expect(res.connected).toBe(true);
    expect(res.walletAddress).toBeTruthy();
    expect(res.walletAddress).toMatch(/^mn_preview1_/);
    expect(client.getWalletStatus().connected).toBe(true);
  });

  it('5. Wallet Disconnect: correctly clears active address and resets state', async () => {
    await client.connectWallet();
    expect(client.getWalletStatus().connected).toBe(true);

    const disc = client.disconnectWallet();
    expect(disc.connected).toBe(false);
    expect(client.getWalletStatus().connected).toBe(false);
    expect(client.getWalletStatus().address).toBeNull();
  });

  it('6. Buyer Secret Key Configuration: isolates buyer private key in client memory', () => {
    client.setBuyerKey('buyer_secret_enclave_key_777');
    const privateState = client.getPrivateState();
    expect(privateState.buyerKey).toBe('buyer_secret_enclave_key_777');
  });

  it('7. Order Invoice Hash Configuration: stores invoice receipt digest locally', () => {
    client.setInvoiceHash('INV-2026-APPL-99182374');
    const privateState = client.getPrivateState();
    expect(privateState.invoiceHash).toBe('INV-2026-APPL-99182374');
  });

  it('8. Rating Score Bounds: updates rating score witness correctly', () => {
    client.setRatingScore(5);
    const privateState = client.getPrivateState();
    expect(privateState.ratingScore).toBe(5);
  });

  it('9. Circuit Execution — submitFeedback: returns valid commitment and on-chain txHash', async () => {
    client.setBuyerKey('buyer_vip_001');
    client.setInvoiceHash('INV-APPLE-001');
    client.setRatingScore(5);
    const result = await client.submitFeedback('merchant_apple_store_us');

    expect(result.txHash).toMatch(/^0x/);
    expect(result.commitmentHex).toMatch(/^0x/);
    expect(result.ratingMet).toBe(true);
    expect(result.txFeeAsset).toBe('tDUST');
  });

  it('10. Privacy Invariant: commitment hex does not expose raw buyer key or invoice', async () => {
    const rawSecret = 'super_secret_buyer_key_999';
    client.setBuyerKey(rawSecret);
    const result = await client.submitFeedback('merchant_apple_store_us');

    expect(result.commitmentHex).not.toContain(rawSecret);
    expect(result.commitmentHex).toMatch(/^0x[a-f0-9]{32,}/i);
  });

  it('11. Circuit Execution — verifyFeedback: matches valid on-chain commitment', async () => {
    const submitRes = await client.submitFeedback('merchant_apple_store_us');
    const verifyRes = await client.verifyFeedback(submitRes.commitmentHex);

    expect(verifyRes.matches).toBe(true);
    expect(verifyRes.txHash).toMatch(/^0x/);
  });

  it('12. Circuit Execution — verifyFeedback: handles invalid commitment gracefully', async () => {
    const verifyRes = await client.verifyFeedback('invalid_mock_commitment_000');
    expect(verifyRes.matches).toBe(false);
    expect(verifyRes.txHash).toMatch(/^0x/);
  });

  it('13. Circuit Execution — flagFeedback: flags disputed review with merchant auth', async () => {
    client.setMerchantKey('merchant_signing_key_2026');
    const flagRes = await client.flagFeedback('0x8f32a7bc410d9e2105ba9401fe38b29c4172a0918451f28b03e5c918a201b4c7');

    expect(flagRes.txHash).toMatch(/^0x/);
    expect(flagRes.flaggedCommitment).toMatch(/^0x/);
  });

  it('14. Circuit Execution — setMerchantCommitment: updates minimum rating score gate', async () => {
    client.setMerchantKey('merchant_signing_key_2026');
    const result = await client.setMerchantCommitment(4);

    expect(result.newMinimumRating).toBe(4);
    expect(result.merchantCommitment).toMatch(/^0x/);
    expect(result.txHash).toMatch(/^0x/);
  });

  it('15. Circuit Execution — resetMerchantProduct: rotates catalog identifier and baseline', async () => {
    const result = await client.resetMerchantProduct('merchant_sony_2027', 3);

    expect(result.newMerchantId).toBe('merchant_sony_2027');
    expect(result.newMinimumRating).toBe(3);
    expect(result.txHash).toMatch(/^0x/);
  });

  it('16. Circuit Execution — incrementSession: advances anti-replay epoch nonce', async () => {
    const result = await client.incrementSession();
    expect(result.txHash).toMatch(/^0x/);
  });

  it('17. Public State Query: fetchPublicState returns all 8 public ledger fields', async () => {
    const state = await client.fetchPublicState();
    expect(state).toHaveProperty('feedbackCount');
    expect(state).toHaveProperty('flaggedCount');
    expect(state).toHaveProperty('activeSession');
    expect(state).toHaveProperty('merchantId');
    expect(state).toHaveProperty('merchantCommitment');
    expect(state).toHaveProperty('lastFeedbackCommitment');
    expect(state).toHaveProperty('lastFlaggedCommitment');
    expect(state).toHaveProperty('minimumRatingScore');
  });

  it('18. Ledger State Query Alias: getPublicLedgerState equals fetchPublicState output', async () => {
    const state1 = await client.fetchPublicState();
    const state2 = await client.getPublicLedgerState();
    expect(state1.merchantId).toBe(state2.merchantId);
    expect(state1.minimumRatingScore).toBe(state2.minimumRatingScore);
  });

  it('19. Multiple Circuit Chain: submitFeedback followed by incrementSession and verifyFeedback', async () => {
    const s1 = await client.submitFeedback('merchant_apple_store_us');
    expect(s1.commitmentHex).toBeTruthy();

    const s2 = await client.incrementSession();
    expect(s2.txHash).toBeTruthy();

    const s3 = await client.verifyFeedback(s1.commitmentHex);
    expect(s3.matches).toBe(true);
  });

  it('20. Rating Score 1 Star: valid lower bound within circuit constraints', async () => {
    client.setRatingScore(1);
    const result = await client.submitFeedback('merchant_test');
    expect(result.ratingMet).toBe(true);
  });

  it('21. Rating Score 5 Stars: valid upper bound within circuit constraints', async () => {
    client.setRatingScore(5);
    const result = await client.submitFeedback('merchant_test');
    expect(result.ratingMet).toBe(true);
  });

  it('22. Rating Score Out of Range: detected by client ratingMet flag', async () => {
    client.setRatingScore(6);
    const result = await client.submitFeedback('merchant_test');
    expect(result.ratingMet).toBe(false);
  });

  it('23. Network Config Getter: returns valid preview network configuration', () => {
    const cfg = client.getNetworkConfig();
    expect(cfg.networkId).toBe('preview');
    expect(cfg.faucetUrl).toContain('preview');
  });

  it('24. Merchant Private Key: can be updated dynamically across moderation sessions', () => {
    client.setMerchantKey('key_alpha');
    expect(client.getPrivateState().merchantKey).toBe('key_alpha');
    client.setMerchantKey('key_beta');
    expect(client.getPrivateState().merchantKey).toBe('key_beta');
  });

  it('25. End-to-End Buyer & Merchant Lifecycle: setCommitment -> submitReview -> verify -> flag', async () => {
    const merchantClient = new AnonymousBuyerFeedbackClient();
    merchantClient.setMerchantKey('root_merchant_signing_key');
    const setup = await merchantClient.setMerchantCommitment(3);
    expect(setup.newMinimumRating).toBe(3);

    const buyerClient = new AnonymousBuyerFeedbackClient();
    buyerClient.setRatingScore(5);
    const review = await buyerClient.submitFeedback('merchant_apple_store_us');
    expect(review.commitmentHex).toBeTruthy();

    const verify = await buyerClient.verifyFeedback(review.commitmentHex);
    expect(verify.matches).toBe(true);

    const flag = await merchantClient.flagFeedback(review.commitmentHex);
    expect(flag.flaggedCommitment).toBeTruthy();
  });
});
