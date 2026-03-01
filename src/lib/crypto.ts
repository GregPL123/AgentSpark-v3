// src/lib/crypto.ts

/**
 * Kompresuje dane Uint8Array używając CompressionStream (GZIP)
 */
export async function _compressBytes(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as unknown as BlobPart]).stream()
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'))
  const response = new Response(compressedStream)
  const blob = await response.blob()
  return new Uint8Array(await blob.arrayBuffer())
}

/**
 * Dekompresuje dane Uint8Array używając DecompressionStream (GZIP)
 */
export async function _decompressBytes(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as unknown as BlobPart]).stream()
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'))
  const response = new Response(decompressedStream)
  const blob = await response.blob()
  return new Uint8Array(await blob.arrayBuffer())
}

/**
 * Szyfruje dane używając AES-GCM zawartego w Web Crypto API
 */
export async function aesGcmEncrypt(
  data: Uint8Array,
  keyStr: string
): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.digest('SHA-256', enc.encode(keyStr))
  const key = await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, [
    'encrypt',
  ])
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Rzutowanie na domyślny BufferSource jest potrzebne w surowym TS dla starszych targetów lib
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    data as BufferSource
  )

  return { iv, ciphertext: new Uint8Array(ciphertextBuffer) }
}

/**
 * Odszyfrowuje dane używając AES-GCM zawartego w Web Crypto API
 */
export async function aesGcmDecrypt(
  ciphertext: Uint8Array,
  keyStr: string,
  iv: Uint8Array
): Promise<Uint8Array> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.digest('SHA-256', enc.encode(keyStr))
  const key = await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, [
    'decrypt',
  ])
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  )

  return new Uint8Array(plainBuffer)
}

// Utils (Base64) - kompresja URL friendly
export function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
