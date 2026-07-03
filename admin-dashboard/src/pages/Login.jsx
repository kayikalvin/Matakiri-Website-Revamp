import React, { useState, useEffect, useCallback } from 'react';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

// ---------- Live coordinate readout ----------
// A small, thematic motion detail: the field-survey coordinates drift
// slightly, like a GPS unit holding a fix. Not decorative noise —
// it's the same instrument a field team would actually carry.
const useDriftingCoords = (baseLat, baseLng) => {
  const [coords, setCoords] = useState({ lat: baseLat, lng: baseLng });

  useEffect(() => {
    const id = setInterval(() => {
      setCoords({
        lat: baseLat + (Math.random() - 0.5) * 0.0006,
        lng: baseLng + (Math.random() - 0.5) * 0.0006,
      });
    }, 2200);
    return () => clearInterval(id);
  }, [baseLat, baseLng]);

  return coords;
};

// ---------- Terrain panel (signature element) ----------
// Contour lines standing in for the project sites this platform tracks —
// each ring is a real elevation band, not an abstract blob.
const TerrainPanel = () => {
  const coords = useDriftingCoords(-1.2921, 36.8219); // Nairobi reference fix

  return (
    <div className="relative hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between overflow-hidden bg-soil-900 px-10 py-10 xl:px-14 xl:py-12">
      {/* Contour field */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        {[
          'M -40 120 C 120 60, 260 180, 420 90 S 700 40, 780 140',
          'M -60 220 C 100 150, 250 280, 400 190 S 680 150, 800 260',
          'M -60 330 C 90 260, 260 390, 410 300 S 660 250, 820 370',
          'M -60 460 C 110 380, 280 500, 430 410 S 670 370, 830 490',
          'M -60 600 C 100 520, 270 640, 420 550 S 690 500, 840 620',
          'M -60 730 C 120 660, 300 780, 450 690 S 700 640, 850 750',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#E4DCC8"
            strokeWidth="1"
            strokeOpacity={0.5 - i * 0.05}
          />
        ))}

        {/* Traced route: the highlighted path a field visit follows */}
        <path
          id="route"
          d="M 40 720 C 180 640, 220 460, 340 400 S 480 220, 560 120"
          stroke="#B5522E"
          strokeWidth="1.75"
          strokeDasharray="6 7"
          className="animate-route-trace"
        />
        <circle r="4.5" fill="#E8B94A">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            rotate="auto"
            path="M 40 720 C 180 640, 220 460, 340 400 S 480 220, 560 120"
          />
        </circle>

        {/* Site markers */}
        <circle cx="40" cy="720" r="3" fill="#F7F3EA" fillOpacity="0.8" />
        <circle cx="560" cy="120" r="3" fill="#F7F3EA" fillOpacity="0.8" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-soil-900 via-soil-900/10 to-soil-900/40" />

      {/* Top: wordmark */}
      <div className="relative">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize">
          Matakiri Tumaini
        </span>
        <p className="mt-2 max-w-[26ch] font-display text-[1.7rem] xl:text-3xl font-medium leading-[1.15] text-parchment-50">
          Every project starts with someone walking the ground.
        </p>
      </div>

      {/* Bottom: live-instrument readout */}
      <div className="relative flex items-end justify-between">
        <div className="font-mono text-[11px] leading-relaxed text-parchment-100/60">
          <div className="text-parchment-100/80">FIELD UNIT — NAIROBI SECTOR</div>
          <div>LAT&nbsp; {coords.lat.toFixed(4)}° S</div>
          <div>LNG&nbsp; {coords.lng.toFixed(4)}° E</div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-acacia-500">
          <span className="h-1.5 w-1.5 rounded-full bg-acacia-500 animate-pulse" />
          fix acquired
        </div>
      </div>
    </div>
  );
};

// ---------- Login form ----------
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      if (!email || !password) {
        setError('Enter your email and password to continue.');
        return;
      }

      setSubmitting(true);
      try {
        // Replace with real auth call, e.g. await authAPI.login({ email, password, remember })
        await new Promise((resolve) => setTimeout(resolve, 900));
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not sign in. Check your details and try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [email, password]
  );

  return (
    <div className="min-h-screen w-full flex bg-parchment-50">
      <TerrainPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          {/* Mobile-only wordmark */}
          <div className="mb-8 lg:hidden">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
              Matakiri Tumaini
            </span>
          </div>

          <div className="mb-8">
            <span className="hidden lg:inline text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
              Admin &amp; field access
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-ink-800 mt-2">
              Welcome back
            </h1>
            <p className="text-ink-500 text-sm mt-1.5">
              Sign in to reach your projects, partners, and field log.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 border border-laterite-500/30 bg-laterite-500/5 px-3.5 py-3 text-sm text-laterite-600"
              >
                <ExclamationCircleIcon className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 mb-2">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-500/50" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@matakiritumaini.org"
                  className="w-full border border-border bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-500/40 outline-none transition-colors focus:border-laterite-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">
                  Password
                </label>
                <a href="#forgot-password" className="text-xs text-laterite-500 hover:text-laterite-600 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-500/50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-border bg-white pl-10 pr-10 py-2.5 text-sm text-ink-800 placeholder:text-ink-500/40 outline-none transition-colors focus:border-laterite-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500/50 hover:text-ink-500 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="h-4.5 w-4.5" /> : <EyeIcon className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-ink-500 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-laterite-500 border-border"
              />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="group w-full inline-flex items-center justify-center gap-2 bg-soil-900 px-4 py-3 text-sm font-medium text-parchment-50 transition-colors hover:bg-ink-800 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-parchment-50/30 border-t-parchment-50 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-ink-500">
            New to the platform?{' '}
            <a href="#request-access" className="text-laterite-500 hover:text-laterite-600 transition-colors">
              Request field access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

/*
  Add to your global stylesheet (e.g. animations.css):

  @keyframes route-trace {
    from { stroke-dashoffset: 240; }
    to   { stroke-dashoffset: 0; }
  }
  .animate-route-trace {
    stroke-dashoffset: 240;
    animation: route-trace 5s ease-in-out infinite alternate;
  }
*/