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
      content
    } = data;

    if (!slug || !title) {
      return new Response(JSON.stringify({ error: "Slug dan Title wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const info = await env.hamzahdesign_db.prepare(`
      INSERT INTO case_studies (slug, category, reading_time, title, desc, hero_image, logo, live_url, company, design_stack, industry, year, sections, content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      content || ""
    ).run();

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
      content
    } = data;

    if (!id || !slug || !title) {
      return new Response(JSON.stringify({ error: "ID, Slug, dan Title wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.hamzahdesign_db.prepare(`
      UPDATE case_studies
      SET slug = ?, category = ?, reading_time = ?, title = ?, desc = ?, hero_image = ?, logo = ?, live_url = ?, company = ?, design_stack = ?, industry = ?, year = ?, sections = ?, content = ?
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
      id
    ).run();

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

    await env.hamzahdesign_db.prepare("DELETE FROM case_studies WHERE id = ?").bind(id).run();

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
