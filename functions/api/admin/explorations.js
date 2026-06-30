export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { title, category, description, image } = data;

    if (!title || !image) {
      return new Response(JSON.stringify({ error: "Title dan Image wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const info = await env.hamzahdesign_db.prepare(`
      INSERT INTO explorations (title, category, description, image)
      VALUES (?, ?, ?, ?)
    `).bind(title, category || "", description || "", image).run();

    return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), {
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
    const { id, title, category, description, image } = data;

    if (!id || !title || !image) {
      return new Response(JSON.stringify({ error: "ID, Title, dan Image wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.hamzahdesign_db.prepare(`
      UPDATE explorations
      SET title = ?, category = ?, description = ?, image = ?
      WHERE id = ?
    `).bind(title, category || "", description || "", image, id).run();

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

    await env.hamzahdesign_db.prepare("DELETE FROM explorations WHERE id = ?").bind(id).run();

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
