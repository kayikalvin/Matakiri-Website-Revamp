// Utility to apply theme colors as CSS variables and generate simple shades

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const color = l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateShades(hex, steps = [95, 90, 85, 75, 65, 55, 45, 35, 25, 15]) {
  // returns an array of hex shades from lightest to darkest
  const { r, g, b } = hexToRgb(hex || '#10B981');
  const { h, s, l } = rgbToHsl(r, g, b);
  return steps.map((targetL) => hslToHex(h, s, targetL));
}

export function applyThemeToRoot(theme) {
  if (!theme) return;
  const root = document.documentElement;
  try {
    const primary = theme.primaryColor || theme.primary || '#10B981';
    const secondary = theme.secondaryColor || theme.secondary || primary;
    const accent = theme.accentColor || '#059669';
    const text = theme.textColor || '#0f172a';
    const background = theme.backgroundColor || '#ffffff';

    // generate basic primary shades
    const primaryShades = generateShades(primary, [95, 90, 80, 70, 60, 50, 40, 30, 20]);
    // assign to --primary-50...--primary-900 like mapping
    const mapping = [50,100,200,300,400,500,600,700,800,900];
    mapping.forEach((key, idx) => {
      root.style.setProperty(`--primary-${key}`, primaryShades[idx]);
    });

    // other vars (ensure fallbacks)
    root.style.setProperty('--primary-500', primaryShades[5] || primary);
    root.style.setProperty('--primary-600', primaryShades[6] || secondary);
    root.style.setProperty('--primary-900', primaryShades[9] || primaryShades[8] || primary);
    root.style.setProperty('--accent-500', accent);
    root.style.setProperty('--text-color', text);
    root.style.setProperty('--background-color', background);
    document.body.style.color = text;
    document.body.style.backgroundColor = background;
  } catch (err) {
    console.error('applyThemeToRoot error', err);
  }
}

export default { applyThemeToRoot, generateShades };
