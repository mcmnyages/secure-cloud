
/**
 * Converts any stored image path into a browser-safe URL
 */
export class ImageUrlNormalizer {
  static normalize(
    storedPath: string | null | undefined,
    baseUrl: string
  ): string | null {
    if (!storedPath) return null;

    // already a full URL
    if (storedPath.startsWith("http://") || storedPath.startsWith("https://")) {
      return storedPath;
    }

    // normalize windows backslashes → forward slashes
    const normalized = storedPath.replace(/\\/g, "/");

    // extract only /uploads/... part if full filesystem path was stored
    const uploadsIndex = normalized.indexOf("/uploads/");

    const relativePath =
      uploadsIndex !== -1
        ? normalized.slice(uploadsIndex)
        : normalized;

    return `${baseUrl}${relativePath}`;
  }
}