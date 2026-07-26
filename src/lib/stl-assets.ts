/**
 * Resolve STL/preview paths to absolute CDN URLs when NEXT_PUBLIC_STL_BASE_URL is set.
 * Locally (no env): keep relative `/models/3d/...` so `public/` works in `npm run dev`.
 */
export function getStlBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_STL_BASE_URL ?? "").replace(/\/+$/, "");
}

export function stlAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getStlBaseUrl();
  if (!base) return normalized;
  return `${base}${normalized}`;
}
