import type { NextRequest } from "next/server"
import { findUserById } from "@/lib/dal"
import type { User } from "@/types"

const JWT_SECRET = process.env.JWT_SECRET || "agencyos-dev-secret-not-for-production"

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error(
    "WARNING: JWT_SECRET is not set. Using insecure default. Set JWT_SECRET environment variable in production!",
  )
}

const HEADER = { alg: "HS256", typ: "JWT" } as const

export type JwtPayload = {
  sub: string
  email: string
  role: string
  tenantId: string
  iat: number
  exp: number
}

let signingKeyPromise: Promise<CryptoKey> | null = null

function getSigningKey(): Promise<CryptoKey> {
  if (!signingKeyPromise) {
    signingKeyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    )
  }
  return signingKeyPromise
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function stringToBase64Url(s: string): string {
  return bytesToBase64Url(new TextEncoder().encode(s))
}

function base64UrlToUint8Array(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4))
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad
  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)!
  return out
}

function base64UrlToString(str: string): string {
  return new TextDecoder().decode(base64UrlToUint8Array(str))
}

export async function signToken(
  payload: Omit<JwtPayload, "iat" | "exp"> & Partial<Pick<JwtPayload, "iat" | "exp">>,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const full: JwtPayload = {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    tenantId: payload.tenantId,
    iat: payload.iat ?? now,
    exp: payload.exp ?? now + 24 * 60 * 60,
  }

  const headerPart = stringToBase64Url(JSON.stringify(HEADER))
  const payloadPart = stringToBase64Url(JSON.stringify(full))
  const signingInput = `${headerPart}.${payloadPart}`

  const key = await getSigningKey()
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signingInput),
  )
  const sigPart = bytesToBase64Url(new Uint8Array(sigBuf))

  return `${signingInput}.${sigPart}`
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  const [headerPart, payloadPart, sigPart] = parts as [string, string, string]
  if (!headerPart || !payloadPart || !sigPart) return null

  const signingInput = `${headerPart}.${payloadPart}`
  const key = await getSigningKey()
  let ok: boolean
  const sigBytes = base64UrlToUint8Array(sigPart)
  const sigBuf = sigBytes.buffer.slice(
    sigBytes.byteOffset,
    sigBytes.byteOffset + sigBytes.byteLength,
  ) as ArrayBuffer
  try {
    ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuf,
      new TextEncoder().encode(signingInput),
    )
  } catch {
    return null
  }
  if (!ok) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(base64UrlToString(payloadPart))
  } catch {
    return null
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as JwtPayload).sub !== "string" ||
    typeof (parsed as JwtPayload).email !== "string" ||
    typeof (parsed as JwtPayload).role !== "string" ||
    typeof (parsed as JwtPayload).tenantId !== "string" ||
    typeof (parsed as JwtPayload).iat !== "number" ||
    typeof (parsed as JwtPayload).exp !== "number"
  ) {
    return null
  }

  const claims = parsed as JwtPayload
  if (claims.exp < Math.floor(Date.now() / 1000)) return null

  return claims
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const auth = request.headers.get("authorization")
  if (!auth?.toLowerCase().startsWith("bearer ")) return null

  const token = auth.slice(7).trim()
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  const dbUser = await findUserById(payload.sub)
  if (!dbUser) return null

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    tenantId: dbUser.tenantId,
    specialty: dbUser.specialty,
    createdAt: dbUser.createdAt,
  }
}
