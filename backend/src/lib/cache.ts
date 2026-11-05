export interface Cache<T> { get(key: string): T | undefined; set(key: string, value: T): void }
export class MemoryCache<T> implements Cache<T> {
  private entries = new Map<string, { value: T; expires: number }>();
  constructor(private readonly ttlMs: number) {}
  get(key: string) { const entry = this.entries.get(key); if (!entry) return undefined; if (entry.expires <= Date.now()) { this.entries.delete(key); return undefined; } return entry.value; }
  set(key: string, value: T) { this.entries.set(key, { value, expires: Date.now() + this.ttlMs }); }
}
