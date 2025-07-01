import forge from 'node-forge';
export function generateKeyPair(bits: number = 2048) {
  const keypair = forge.pki.rsa.generateKeyPair({ bits, e: 0x10001 });

  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

  return {
    publicKey: publicKeyPem,
    privateKey: keypair.privateKey,
  };
}

export function exportPublicKey(publicKeyPem: string) {
  const publicKey = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\r?\n|\r/g, '')
    .trim();
  return publicKey;
}

export async function exportPrivateKey(key: CryptoKey) {
  const pkcs8 = await window.crypto.subtle.exportKey('pkcs8', key);
  return bufferToBase64(pkcs8);
}

function bufferToBase64(buffer: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return window.btoa(binary);
}
