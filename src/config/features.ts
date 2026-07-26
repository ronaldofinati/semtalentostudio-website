/**
 * Feature flags for go-live.
 * stlFilesPublished=false → catalog UI stays, downloads/previews from /models/3d are off
 * (files are too heavy for first Vercel deploy; enable after CDN/R2).
 */
export const features = {
  stlFilesPublished: false,
} as const;