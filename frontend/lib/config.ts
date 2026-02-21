/**
 * AlignIQ — centralised runtime config
 * All API calls go through this single source of truth.
 *
 * Set NEXT_PUBLIC_API_URL in:
 *   • Local dev  → frontend/.env.local
 *   • Production → Vercel dashboard → Environment Variables
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || // strip trailing slash
  "http://localhost:5000";
