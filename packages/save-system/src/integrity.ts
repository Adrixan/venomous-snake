// Embedded HMAC key (deters casual JSON editing, not cryptographically secure)
const HMAC_KEY_RAW = 'venomous-snake-save-integrity-2024-hmac-key';

async function getHmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(HMAC_KEY_RAW),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Sign arbitrary JSON data and return the hex-encoded HMAC-SHA256 signature.
 */
export async function computeSignature(data: string): Promise<string> {
  const key = await getHmacKey();
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return arrayBufferToHex(signature);
}

/**
 * Verify a hex-encoded HMAC-SHA256 signature against the provided data string.
 */
export async function verifySignature(data: string, signatureHex: string): Promise<boolean> {
  const key = await getHmacKey();
  const encoder = new TextEncoder();
  const sigBuffer = hexToArrayBuffer(signatureHex);
  return crypto.subtle.verify('HMAC', key, sigBuffer, encoder.encode(data));
}
