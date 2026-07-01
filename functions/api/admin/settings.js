export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  try {
    if (type === 'activity_log') {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const offset = (page - 1) * limit;

      const { results } = await env.hamzahdesign_db.prepare(
        "SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ? OFFSET ?"
      ).bind(limit, offset).all();

      const { count } = await env.hamzahdesign_db.prepare(
        "SELECT COUNT(*) as count FROM activity_log"
      ).first();

      return new Response(JSON.stringify({
        data: results,
        total: count,
        page,
        limit
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return all settings (except password for security)
    const { results } = await env.hamzahdesign_db.prepare(
      "SELECT key, value, updated_at FROM admin_settings WHERE key != 'admin_password'"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { action } = data;

    if (action === 'change_password') {
      const { currentPassword, newPassword } = data;

      if (!currentPassword || !newPassword) {
        return new Response(JSON.stringify({ error: "Current and new password are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (newPassword.length < 6) {
        return new Response(JSON.stringify({ error: "New password must be at least 6 characters" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verify current password
      const current = await env.hamzahdesign_db.prepare(
        "SELECT value FROM admin_settings WHERE key = 'admin_password'"
      ).first();

      let currentStored = current ? current.value : 'orangkayanibos999';

      if (currentPassword !== currentStored) {
        return new Response(JSON.stringify({ error: "Current password is incorrect" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Update password
      await env.hamzahdesign_db.prepare(
        "INSERT OR REPLACE INTO admin_settings (key, value, updated_at) VALUES ('admin_password', ?, CURRENT_TIMESTAMP)"
      ).bind(newPassword).run();

      // Log activity
      try {
        await env.hamzahdesign_db.prepare(`
          INSERT INTO activity_log (action, entity_type, entity_title, details)
          VALUES ('password_change', 'setting', 'Admin Password', '{}')
        `).run();
      } catch (e) {
        // Activity log table might not exist yet
      }

      return new Response(JSON.stringify({ success: true, message: "Password updated successfully" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}