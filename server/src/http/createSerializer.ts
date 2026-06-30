import { MediaResolver } from "../media/media.resolver.js";
import { MEDIA_FIELDS } from "../media/media.fields.js";

function isPlainObject(value: any): boolean {
  if (value === null || typeof value !== "object") {
    return false;
  }

  return Object.getPrototypeOf(value) === Object.prototype;
}

export function createSerializer(req: any) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const media = new MediaResolver(baseUrl);

  function transform(value: any): any {

    // primitives
    if (
      value === null ||
      value === undefined ||
      typeof value !== "object"
    ) {
      return value;
    }

    // Dates
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Arrays
    if (Array.isArray(value)) {
      return value.map(transform);
    }

    // Ignore special classes (Buffer, Map, Set, Prisma Decimal, etc.)
    if (!isPlainObject(value)) {
      return value;
    }

    const out: Record<string, any> = {};

    for (const [key, val] of Object.entries(value)) {

      if (MEDIA_FIELDS.has(key)) {
        out[key] = media.toUrl(val as string | null | undefined);
      } else {
        out[key] = transform(val);
      }

    }

    return out;
  }

  return { transform };
}