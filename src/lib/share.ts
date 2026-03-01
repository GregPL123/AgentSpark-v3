// src/lib/share.ts

import type { SharePayloadV1, SharePayloadV2, SharePayloadV3 } from '@/types'
import {
  _compressBytes,
  _decompressBytes,
  aesGcmDecrypt,
  aesGcmEncrypt,
  fromBase64,
  toBase64,
} from './crypto'
import type { ProjectDoc } from './db'

/**
 * Generuje link/hash współdzielenia.
 * Używamy payloadV3. Kompresja -> ew. AES szyfrowanie -> Base64 Hash.
 */
export async function generateShareUrl(project: ProjectDoc, password?: string): Promise<string> {
  const payloadStr = JSON.stringify(project)
  const enc = new TextEncoder()
  const rawBytes = enc.encode(payloadStr)
  const compressedBytes = await _compressBytes(rawBytes)

  let finalPayload: SharePayloadV3 | SharePayloadV2

  if (password) {
    // Generowanie zabezpieczonego Payload V3
    const { iv, ciphertext } = await aesGcmEncrypt(compressedBytes, password)
    finalPayload = {
      version: 3,
      salt: 'default-salt', // Reserved for KDF implementations
      iv: toBase64(iv),
      data: toBase64(ciphertext),
      title: project.name,
      description: project.topic,
    }
  } else {
    // Generowanie NIEZABEZPIECZONEGO Payload V3 (z opcjonalnym title/desc, oznaczającym public link)
    // UWAGA: V3 bez IV oznacza brak szyfrowania (jawne dane, skompresowane)
    finalPayload = {
      version: 3,
      salt: 'unencrypted',
      data: toBase64(compressedBytes),
      title: project.name,
      description: project.topic,
    }
  }

  const payloadBase64 = toBase64(new TextEncoder().encode(JSON.stringify(finalPayload)))
  return `${window.location.origin}/#${payloadBase64}`
}

/**
 * Odczytuje Hash i transformuje od deszyfracji do odpakowania V3 / V2 / V1
 */
export async function loadFromHash(hash: string, passwordAttempt?: string): Promise<ProjectDoc> {
  const cleanHash = hash.replace(/^#/, '')
  if (!cleanHash) throw new Error('Pusty hash')

  const decodedJsonStr = new TextDecoder().decode(fromBase64(cleanHash))
  const payload = JSON.parse(decodedJsonStr) as SharePayloadV1 | SharePayloadV2 | SharePayloadV3

  let compressedBytes: Uint8Array

  // Routing wersji:
  if (payload.version === 3) {
    if (payload.salt !== 'unencrypted' && payload.iv) {
      if (!passwordAttempt) {
        throw new Error('PASSWORD_REQUIRED') // Flaga rzucana pod UI (Faza 4 okienka)
      }
      const iv = fromBase64(payload.iv)
      const ciphertext = fromBase64(payload.data)
      compressedBytes = await aesGcmDecrypt(ciphertext, passwordAttempt, iv)
    } else {
      // V3 Niezabezpieczone
      compressedBytes = fromBase64(payload.data)
    }
  } else if (payload.version === 2 || payload.version === 1) {
    // V1 i V2 zawsze jawne Base64
    // Nie mamy w payloadzie V1/V2 opcji "salt", ale dla bezpieczenstwa asercji TS:
    if ('data' in payload) {
      compressedBytes = fromBase64(payload.data as string)
    } else {
      throw new Error('Uszkodzony stary blok v1/v2')
    }
  } else {
    throw new Error('Nieznana wersja payloadu')
  }

  const decompressedBytes = await _decompressBytes(compressedBytes)
  const jsonStr = new TextDecoder().decode(decompressedBytes)
  const parsedProject = JSON.parse(jsonStr) as ProjectDoc

  // Zwracamy obiekt w odpowiednim trybie wglądowym
  return {
    ...parsedProject,
    readOnly: true, // Zawsze traktujmy jako link wgladowy na poczatku
    originId: parsedProject.id, // Zapis oryginalny na znak kopii
  }
}
