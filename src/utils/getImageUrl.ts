const FALLBACK_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";

export function getImageUrl(name: string): string {
  if (!name || name.trim() === "") {
    return FALLBACK_IMAGE_URL;
  }

  try {
    return new URL(`../assets/images/${name}`, import.meta.url).href;
  } catch {
    console.warn(`⚠️ Bild saknas: ${name}`);
    return FALLBACK_IMAGE_URL;
  }
}
