export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    if (id) {
      const exp = await env.hamzahdesign_db.prepare(
        "SELECT * FROM explorations WHERE id = ?"
      ).bind(id).first();

      if (!exp) {
        return new Response(JSON.stringify({ error: "Exploration not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(exp), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { results } = await env.hamzahdesign_db.prepare(
      "SELECT * FROM explorations ORDER BY created_at DESC"
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

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { title, category, description, image, aspect_ratio, keywords, is_highlighted } = data;

    if (!title || !image) {
      return new Response(JSON.stringify({ error: "Title dan Image wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const info = await env.hamzahdesign_db.prepare(`
      INSERT INTO explorations (title, category, description, image, aspect_ratio, keywords, is_highlighted)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(title, category || "", description || "", image, aspect_ratio || "1:1", keywords || "", is_highlighted ? 1 : 0).run();

    const newId = info.meta.last_row_id;

    // Log activity
    await env.hamzahdesign_db.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
      VALUES ('create', 'exploration', ?, ?, ?)
    `).bind(newId, title, null).run();

    return new Response(JSON.stringify({ success: true, id: newId }), {
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
    const { id, title, category, description, image, aspect_ratio, keywords, is_highlighted } = data;

    if (!id || !title || !image) {
      return new Response(JSON.stringify({ error: "ID, Title, dan Image wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.hamzahdesign_db.prepare(`
      UPDATE explorations
      SET title = ?, category = ?, description = ?, image = ?, aspect_ratio = ?, keywords = ?, is_highlighted = ?
      WHERE id = ?
    `).bind(title, category || "", description || "", image, aspect_ratio || "1:1", keywords || "", is_highlighted ? 1 : 0, id).run();

    // Log activity
    await env.hamzahdesign_db.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
      VALUES ('update', 'exploration', ?, ?, ?)
    `).bind(id, title, null).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPatch(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { id, is_highlighted, title } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If trying to highlight, check max limit (4)
    if (is_highlighted) {
      const { count } = await env.hamzahdesign_db.prepare(
        "SELECT COUNT(*) as count FROM explorations WHERE is_highlighted = 1 AND id != ?"
      ).bind(id).first();

      if (count >= 4) {
        return new Response(JSON.stringify({
          error: "highlight_limit_reached",
          message: "Maximum 4 highlighted explorations allowed.",
          current_count: count
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    await env.hamzahdesign_db.prepare(
      "UPDATE explorations SET is_highlighted = ? WHERE id = ?"
    ).bind(is_highlighted ? 1 : 0, id).run();

    const action = is_highlighted ? 'highlight' : 'unhighlight';

    // Log activity
    await env.hamzahdesign_db.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
      VALUES (?, 'exploration', ?, ?, ?)
    `).bind(action, id, title || `Exploration #${id}`, JSON.stringify({ is_highlighted })).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get title before deleting for activity log
    const exp = await env.hamzahdesign_db.prepare(
      "SELECT title FROM explorations WHERE id = ?"
    ).bind(id).first();

    await env.hamzahdesign_db.prepare("DELETE FROM explorations WHERE id = ?").bind(id).run();

    // Log activity
    if (exp) {
      await env.hamzahdesign_db.prepare(`
        INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
        VALUES ('delete', 'exploration', ?, ?, ?)
      `).bind(parseInt(id), exp.title, null).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}