// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
//
// Faithful port of Expo's `expo-blob` surface on top of the native
// `BlobModule`. The native twin stores bytes in-process and speaks base64
// across the bridge (Lynx supported types do not include raw byte arrays),
// so the JS facade encodes/decodes around it. The `Blob` class mirrors the
// Web-standard Blob API: `size`, `type`, `slice`, `bytes`, `text`,
// `arrayBuffer`, `stream`, `toString`, `Symbol.toStringTag`.

import { BlobModule } from './generated/BlobModule';

// `NativeModules` is injected as a runtime global by the Lynx engine. Declare
// it ambiently so the native accessors below type-check under tsc/rslib dts.
declare const NativeModules: Record<string, any>;

// Native accessors — reference the bare `NativeModules.BlobModule` global
// directly (matching the repo-wide `get*` accessor convention, e.g.
// @lynxpo/mods-crypto) so the dashboard registry and legacy hook callers
// resolve the module by name. The `Blob` class below wraps these for the
// Web-standard Blob API surface.
export const getCreate = (payload: string, type: string): string | null =>
  NativeModules.BlobModule?.create?.(payload, type);
export const getSize = (blobId: string): number =>
  NativeModules.BlobModule?.size?.(blobId) ?? 0;
export const getType = (blobId: string): string =>
  NativeModules.BlobModule?.type?.(blobId) ?? '';
export const getSlice = (
  blobId: string,
  start: number,
  end: number,
  contentType: string,
): string | null =>
  NativeModules.BlobModule?.slice?.(blobId, start, end, contentType);
export const getBytes = (blobId: string): string | null =>
  NativeModules.BlobModule?.bytes?.(blobId);
export const getText = (blobId: string): string | null =>
  NativeModules.BlobModule?.text?.(blobId);
export const getArrayBuffer = (blobId: string): string | null =>
  NativeModules.BlobModule?.arrayBuffer?.(blobId);

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // btoa is available in the Lynx JS runtime; fall back to a manual encoder.
  if (typeof btoa === 'function') return btoa(binary);
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < binary.length; i += 3) {
    const b0 = binary.charCodeAt(i);
    const b1 = i + 1 < binary.length ? binary.charCodeAt(i + 1) : 0;
    const b2 = i + 2 < binary.length ? binary.charCodeAt(i + 2) : 0;
    const e0 = b0 >> 2;
    const e1 = ((b0 & 3) << 4) | (b1 >> 4);
    const e2 = ((b1 & 15) << 2) | (b2 >> 6);
    const e3 = b2 & 63;
    out += chars[e0] + chars[e1] + (i + 1 < binary.length ? chars[e2] : '=');
    out += i + 2 < binary.length ? chars[e3] : '=';
  }
  return out;
}

function fromBase64(b64: string): Uint8Array {
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup: Record<string, number> = {};
  for (let i = 0; i < chars.length; i++) lookup[chars[i]] = i;
  const clean = b64.replace(/=+$/, '');
  const outLen = Math.floor((clean.length * 6) / 8);
  const out = new Uint8Array(outLen);
  let acc = 0;
  let bits = 0;
  let idx = 0;
  for (let i = 0; i < clean.length; i++) {
    acc = (acc << 6) | lookup[clean[i]];
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[idx++] = (acc >> bits) & 0xff;
    }
  }
  return out;
}

export type BlobPart = string | ArrayBuffer | ArrayBufferView | Blob;

export interface BlobPropertyBag {
  type?: string;
  endings?: 'transparent' | 'native';
}

function normalizeType(type?: string): string {
  if (!type) return '';
  // Strip any parameters; keep the MIME type only.
  return type.split(';')[0].trim().toLowerCase();
}

function encodePart(part: BlobPart): string {
  if (typeof part === 'string') {
    return toBase64(new TextEncoder().encode(part));
  }
  if (part instanceof ArrayBuffer) {
    return toBase64(new Uint8Array(part));
  }
  if (ArrayBuffer.isView(part)) {
    return toBase64(
      new Uint8Array(part.buffer, part.byteOffset, part.byteLength),
    );
  }
  if (part instanceof Blob) {
    return part._payload;
  }
  return '';
}

export class Blob {
  readonly _blobId: string;
  readonly _payload: string;
  readonly _type: string;

  constructor(
    blobParts?: BlobPart[] | Iterable<BlobPart>,
    options?: BlobPropertyBag,
  ) {
    if (!new.target) {
      throw new TypeError("Blob constructor requires 'new' operator");
    }
    const type = normalizeType(options?.type);
    if (blobParts == null) {
      const id = BlobModule.create?.('', type) ?? null;
      this._blobId = id ?? '';
      this._payload = '';
      this._type = type;
      return;
    }
    if (typeof blobParts !== 'object') {
      throw new TypeError(
        'Blob constructor requires blobParts to be a non-null object or undefined',
      );
    }
    let combined = '';
    for (const part of blobParts as Iterable<BlobPart>) {
      combined += encodePart(part);
    }
    const id = BlobModule.create?.(combined, type) ?? null;
    this._blobId = id ?? '';
    this._payload = combined;
    this._type = type;
  }

  get size(): number {
    return BlobModule.size?.(this._blobId) ?? 0;
  }

  get type(): string {
    return BlobModule.type?.(this._blobId) ?? this._type;
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    const normalizedType = normalizeType(contentType);
    const id = BlobModule.slice?.(
      this._blobId,
      start ?? 0,
      end ?? this.size,
      normalizedType,
    );
    const b = new Blob();
    Object.assign(b, {
      _blobId: id ?? this._blobId,
      _payload: this._payload,
      _type: normalizedType || this._type,
    });
    return b;
  }

  async bytes(): Promise<Uint8Array> {
    const b64 = BlobModule.bytes?.(this._blobId) ?? null;
    if (b64 == null) return new Uint8Array(0);
    return fromBase64(b64);
  }

  async text(): Promise<string> {
    return BlobModule.text?.(this._blobId) ?? '';
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const out = await this.bytes();
    return out.buffer.slice(
      out.byteOffset,
      out.byteOffset + out.byteLength,
    ) as ArrayBuffer;
  }

  stream(): ReadableStream<Uint8Array> {
    const self = this;
    let sent = false;
    return new ReadableStream<Uint8Array>({
      async pull(controller: ReadableStreamDefaultController<Uint8Array>) {
        if (sent) {
          controller.close();
          return;
        }
        const data = await self.bytes();
        controller.enqueue(data);
        sent = true;
        controller.close();
      },
    });
  }

  toString(): string {
    return '[object Blob]';
  }

  get [Symbol.toStringTag](): string {
    return 'Blob';
  }

  static get length(): number {
    return 0;
  }
}

export default Blob;
