import { neon, neonConfig } from "@neondatabase/serverless"

neonConfig.fetchConnectionCache = true

export type Row = Record<string, unknown>

/** Tagged-template SQL that always resolves to an array of row objects (Neon union narrowed). */
export type NeonSql = (
  strings: TemplateStringsArray,
  ...params: unknown[]
) => Promise<Row[]>

let _sql: NeonSql | null = null

export function getDb(): NeonSql | null {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) return null
    const raw = neon(url)
    _sql = (strings, ...params) =>
      raw(strings, ...params).then((result) =>
        Array.isArray(result) ? (result as Row[]) : [],
      )
  }
  return _sql
}

export function hasDb(): boolean {
  return !!process.env.DATABASE_URL
}
