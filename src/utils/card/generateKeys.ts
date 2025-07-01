import forge from 'node-forge';
export function generateKeyPair(bits: number = 2048) {
  const keypair = forge.pki.rsa.generateKeyPair({ bits, e: 0x10001 });

  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

  return {
    publicKey: publicKeyPem,
    privateKey: keypair.privateKey,
  };
}

export async function exportPublicKey(key: CryptoKey) {
  const spki = await window.crypto.subtle.exportKey('spki', key);
  return bufferToBase64(spki);
}

export async function exportPrivateKey(key: CryptoKey) {
  const pkcs8 = await window.crypto.subtle.exportKey('pkcs8', key);
  return bufferToBase64(pkcs8);
}

function bufferToBase64(buffer: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return window.btoa(binary);
}
