// Utility to normalize asset/image URLs.
export function resolveAssetUrl(src) {
  if (!src) return src;

  // Determine configured API base from common env locations (works in dev and Vercel builds)
  const envBase = (typeof process !== 'undefined' && (process.env.VITE_API_URL || process.env.REACT_APP_API_URL)) ||
    (typeof window !== 'undefined' && window.__env__ && window.__env__.VITE_API_URL) || '';
  let apiBase = envBase || 'http://localhost:5000';
  apiBase = apiBase.replace(/\/+$/g, '').replace(/\/api\/?$/i, '');

  try {
    // If src is an absolute URL, parse it
    const parsed = new URL(src);
    // If it points to localhost, rewrite host to the API base origin
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      const base = new URL(apiBase);
      return `${base.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    // Otherwise return as-is
    return src;
  } catch (err) {
    // src is likely a relative path such as /uploads/...
    if (src.startsWith('/api')) return `${apiBase}${src}`;
    if (src.startsWith('/uploads')) return `${apiBase}/api${src}`;
    if (src.startsWith('/')) return `${apiBase}${src}`;
    return src;
  }
}
