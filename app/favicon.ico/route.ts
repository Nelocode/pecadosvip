const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#050505"/>
  <path d="M33 17c2-6 7-9 12-9-1 6-5 10-12 11" fill="none" stroke="#d8ad62" stroke-width="3" stroke-linecap="round"/>
  <path d="M32 22c-7-7-19-2-19 10 0 13 9 24 19 24s19-11 19-24c0-12-12-17-19-10Z" fill="none" stroke="#d8ad62" stroke-width="3" stroke-linejoin="round"/>
  <path d="M32 19v8" stroke="#d8ad62" stroke-width="3" stroke-linecap="round"/>
</svg>`;

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
