export function formatINR(n: number): string {
  if (n >= 100_000) return '₹' + (n / 100_000).toFixed(2) + 'L'
  if (n >= 1_000) return '₹' + (n / 1_000).toFixed(1) + 'K'
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

export function formatINRFull(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}
