export class MediaResolver {
  constructor(private baseUrl: string) {}

  toUrl(value?: string | null): string | null {
    if (!value) return null;

    if (/^https?:\/\//.test(value)) return value;

    const normalized = value.replace(/\\/g, "/");

    const idx = normalized.indexOf("/uploads/");
    const relative = idx >= 0 ? normalized.slice(idx) : normalized;

    return `${this.baseUrl}${relative}`;
  }
}