export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

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

    // Get credentials from DB (fallback to hardcoded)
    let adminUsername = 'hamzah';
    let adminPassword = 'orangkayanibos999';

    try {
      const dbUsername = await env.hamzahdesign_db.prepare(
        "SELECT value FROM admin_settings WHERE key = 'admin_username'"
      ).first();
      const dbPassword = await env.hamzahdesign_db.prepare(
        "SELECT value FROM admin_settings WHERE key = 'admin_password'"
      ).first();

      if (dbUsername) adminUsername = dbUsername.value;
      if (dbPassword) adminPassword = dbPassword.value;
    } catch (e) {
      // Table might not exist yet, use hardcoded defaults
    }

    if (username === adminUsername && password === adminPassword) {
      const token = btoa(`admin-session-${username}-${Date.now()}`);

      // Log login activity
      try {
        await env.hamzahdesign_db.prepare(`
          INSERT INTO activity_log (action, entity_type, entity_title, details)
          VALUES ('login', 'auth', ?, '{}')
        `).bind(username).run();
      } catch (e) {
        // Activity log table might not exist yet
      }

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