// products.json stores asset paths without a leading slash (e.g. "images/x.jpg"),
// which resolved relative to root on the old static site. Under Next routing we
// need absolute paths so they resolve from any route (e.g. /beats/<id>/).
export function assetUrl(path: string | null | undefined): string {
  if (!path) return '';
  return path.startsWith('/') || /^https?:\/\//.test(path) ? path : '/' + path;
}

// Inline cover style: real image when present, else the gradient fallback.
export function coverStyle(imgFile: string | null | undefined, imgGradient: string): React.CSSProperties {
  if (imgFile) {
    return { backgroundImage: `url(${assetUrl(imgFile)})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return { backgroundImage: imgGradient };
}
