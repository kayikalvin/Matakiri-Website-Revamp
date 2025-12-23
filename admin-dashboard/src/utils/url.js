// Admin dashboard URL helper to normalize asset URLs and rewrite localhost origins
export function resolveAssetUrl(src) {
  if (!src) return src;
  const envBase = (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env && (process.env.VITE_API_URL || process.env.REACT_APP_API_URL)) ||
    (typeof window !== 'undefined' && window.__env__ && window.__env__.VITE_API_URL) || '';
  let apiBase = envBase || '';
  apiBase = apiBase.replace(/\/+$/g, '').replace(/\/api\/?$/i, '');

  try {
    const parsed = new URL(src);
    if ((parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') && apiBase) {
      const base = new URL(apiBase);
      return `${base.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return src;
  } catch (err) {
    if (!apiBase) return src;
    if (src.startsWith('/api')) return `${apiBase}${src}`;
    if (src.startsWith('/uploads')) return `${apiBase}/api${src}`;
    if (src.startsWith('/')) return `${apiBase}${src}`;
    return src;
  }
}
