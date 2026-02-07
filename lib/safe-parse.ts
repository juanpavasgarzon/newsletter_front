export function parseJson<T>(text: string): T | null {
  try {
    return (JSON.parse(text) as T) ?? null
  } catch {
    return null
  }
}

export function safeString(val: unknown): string {
  return typeof val === 'string' ? val : ''
}

export function safeNumber(
  val: unknown,
  min: number,
  fallback: number,
): number {
  return typeof val === 'number' && val >= min ? val : fallback
}
