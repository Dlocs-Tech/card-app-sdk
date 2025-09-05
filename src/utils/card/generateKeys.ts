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
