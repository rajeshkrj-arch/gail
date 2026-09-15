/** Public file path that respects Vite `base` (needed on GitHub Pages). */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const rel = path.replace(/^\//, "");
  return `${base}${rel}`;
}
