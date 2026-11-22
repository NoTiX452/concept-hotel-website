import type { ImageMetadata } from "astro";
import { photos, type PhotoName, type PhotoSlot } from "../content/photos";

// Every image file in src/assets/photos/, keyed by file name without extension.
const files = import.meta.glob<{ default: ImageMetadata }>("../assets/photos/*.{jpg,jpeg,png,webp}", {
  eager: true,
});

const byName = new Map<string, ImageMetadata>();
for (const [path, module] of Object.entries(files)) {
  const name = path.split("/").pop()!.replace(/\.[^.]+$/, "");
  byName.set(name, module.default);
}

export type ResolvedPhoto =
  | { ready: true; image: ImageMetadata; slot: PhotoSlot }
  // Not ready; `image` is set when only the alt text is missing.
  | { ready: false; image?: ImageMetadata; slot: PhotoSlot; missing: string[] };

// A photo is ready with a file and alt text. Credits are optional: the photos
// page says where the photos come from.
export function resolvePhoto(name: PhotoName): ResolvedPhoto {
  const slot: PhotoSlot = photos[name];
  const image = byName.get(name);
  const missing: string[] = [];
  if (!image) missing.push("file");
  if (!slot.alt.trim()) missing.push("alt text");
  return image && missing.length === 0 ? { ready: true, image, slot } : { ready: false, image, slot, missing };
}

export function isPhotoName(name: string): name is PhotoName {
  return name in photos;
}
