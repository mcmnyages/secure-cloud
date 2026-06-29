import { MediaResolver } from "../media/media.resolver.js";
import { MEDIA_FIELDS } from "../media/media.fields.js";

export function createSerializer(req: any) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const media = new MediaResolver(baseUrl);

  function transform(value: any): any {
    if (Array.isArray(value)) {
      return value.map(transform);
    }

    if (value && typeof value === "object") {
      const out: any = {};

      for (const [key, val] of Object.entries(value)) {
        if (MEDIA_FIELDS.has(key)) {
          out[key] = media.toUrl(val as any);
        } else {
          out[key] = transform(val);
        }
      }

      return out;
    }

    return value;
  }

  return { transform };
}