export async function onRequest(context) {
  const { request, next } = context;

  // Allow OPTIONS requests for CORS preflight
  if (request.method === "OPTIONS") {
    return next();
  }

  const url = new URL(request.url);
  const hostname = url.hostname;

  // Block production access to the admin endpoints
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.local');
  if (!isDev) {
    return new Response(JSON.stringify({ error: "Forbidden: Admin endpoints are only accessible in local development." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const authHeader = request.headers.get("Authorization");
  
  // Accept any Bearer token in dev mode
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return next();
  }

  return new Response(JSON.stringify({ error: "Unauthorized access" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}