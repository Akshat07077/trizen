const RASTER_EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png", ".avif"];

export function isRasterUrl(url: string): boolean {
  if (!url) return false;
  const name = (url.split("/").pop() ?? "").toLowerCase();
  return RASTER_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function isRasterFilename(filename: string): boolean {
  const lower = filename.toLowerCase();
  return RASTER_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
