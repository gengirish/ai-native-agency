export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`.replace(/\.0M$/, "M")
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`.replace(/\.0K$/, "K")
  return String(n)
}
