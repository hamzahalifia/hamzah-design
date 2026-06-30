export async function onRequestPost(context) {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Block production access to the authentication API
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.local');
  if (!isDev) {
    return new Response(JSON.stringify({ success: false, error: "Forbidden: Admin authentication is only allowed in local development." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { username, password } = await request.json();
    
    // Validate credentials: username: "hamzah", password: "orangkayanibos999"
    if (username === "hamzah" && password === "orangkayanibos999") {
      const token = btoa(`admin-session-hamzah-orangkayanibos999`);
      return new Response(JSON.stringify({ success: true, token }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Invalid username or password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
