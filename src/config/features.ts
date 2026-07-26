/**
 * Feature flags for go-live.
 * stlFilesPublished=true → previews/downloads use NEXT_PUBLIC_STL_BASE_URL (R2)
 * or local `/models/3d` when the env is empty (dev with files on disk).
 */
export const features = {
  stlFilesPublished: true,
} as const;
