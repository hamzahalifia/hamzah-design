export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    if (id) {
      // Get single work by ID
      const work = await env.hamzahdesign_db.prepare(
        "SELECT * FROM case_studies WHERE id = ?"
      ).bind(id).first();

      if (!work) {
        return new Response(JSON.stringify({ error: "Case study not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(work), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return all works
    const { results } = await env.hamzahdesign_db.prepare(
      "SELECT * FROM case_studies ORDER BY created_at DESC"
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
    const {
      slug,
      category,
      readingTime,
      title,
      desc,
      heroImage,
      logo,
      liveUrl,
      company,
      designStack,
      industry,
      year,
      sections,
      content,
      is_highlighted,
      status,
      scheduled_at,
      contributors,
    } = data;

    if (!slug || !title) {
      return new Response(JSON.stringify({ error: "Slug dan Title wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const info = await env.hamzahdesign_db.prepare(`
      INSERT INTO case_studies (slug, category, reading_time, title, desc, hero_image, logo, live_url, company, design_stack, industry, year, sections, content, is_highlighted, status, scheduled_at, contributors)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      slug,
      category || "",
      readingTime || "",
      title,
      desc || "",
      heroImage || "",
      logo || null,
      liveUrl || null,
      company || "",
      designStack ? JSON.stringify(designStack) : "[]",
      industry ? JSON.stringify(industry) : "[]",
      year || "",
      sections ? JSON.stringify(sections) : "[]",
      content || "",
      is_highlighted ? 1 : 0,
      status || 'draft',
      scheduled_at || null,
      contributors ? JSON.stringify(contributors) : '[]'
    ).run();

    const newId = info.meta.last_row_id;

    // Log activity
    await env.hamzahdesign_db.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
      VALUES ('create', 'case_study', ?, ?, ?)
    `).bind(newId, title, JSON.stringify({ slug })).run();

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
    const {
      id,
      slug,
      category,
      readingTime,
      title,
      desc,
      heroImage,
      logo,
      liveUrl,
      company,
      designStack,
      industry,
      year,
      sections,
      content,
      is_highlighted,
      status,
      scheduled_at,
      contributors,
    } = data;

    if (!id || !slug || !title) {
      return new Response(JSON.stringify({ error: "ID, Slug, dan Title wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.hamzahdesign_db.prepare(`
      UPDATE case_studies
      SET slug = ?, category = ?, reading_time = ?, title = ?, desc = ?, hero_image = ?, logo = ?, live_url = ?, company = ?, design_stack = ?, industry = ?, year = ?, sections = ?, content = ?, is_highlighted = ?, status = ?, scheduled_at = ?, contributors = ?
      WHERE id = ?
    `).bind(
      slug,
      category || "",
      readingTime || "",
      title,
      desc || "",
      heroImage || "",
      logo || null,
      liveUrl || null,
      company || "",
      designStack ? JSON.stringify(designStack) : "[]",
      industry ? JSON.stringify(industry) : "[]",
      year || "",
      sections ? JSON.stringify(sections) : "[]",
      content || "",
      is_highlighted ? 1 : 0,
      status || 'draft',
      scheduled_at || null,
      contributors ? JSON.stringify(contributors) : '[]',
      id
    ).run();

    // Log activity
    await env.hamzahdesign_db.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
      VALUES ('update', 'case_study', ?, ?, ?)
    `).bind(id, title, JSON.stringify({ slug })).run();

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

    // If trying to highlight, check max limit (3)
    if (is_highlighted) {
      const { count } = await env.hamzahdesign_db.prepare(
        "SELECT COUNT(*) as count FROM case_studies WHERE is_highlighted = 1 AND id != ?"
      ).bind(id).first();

      if (count >= 3) {
        return new Response(JSON.stringify({
          error: "highlight_limit_reached",
          message: "Maximum 3 highlighted case studies allowed.",
          current_count: count
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    await env.hamzahdesign_db.prepare(
      "UPDATE case_studies SET is_highlighted = ? WHERE id = ?"
    ).bind(is_highlighted ? 1 : 0, id).run();

    const action = is_highlighted ? 'highlight' : 'unhighlight';

    // Log activity
    await env.hamzahdesign_db.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
      VALUES (?, 'case_study', ?, ?, ?)
    `).bind(action, id, title || `Work #${id}`, JSON.stringify({ is_highlighted })).run();

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
    const work = await env.hamzahdesign_db.prepare(
      "SELECT title FROM case_studies WHERE id = ?"
    ).bind(id).first();

    await env.hamzahdesign_db.prepare("DELETE FROM case_studies WHERE id = ?").bind(id).run();

    // Log activity
    if (work) {
      await env.hamzahdesign_db.prepare(`
        INSERT INTO activity_log (action, entity_type, entity_id, entity_title, details)
        VALUES ('delete', 'case_study', ?, ?, ?)
      `).bind(parseInt(id), work.title, null).run();
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