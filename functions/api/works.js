export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const highlighted = url.searchParams.get('highlighted');

  try {
    // Mengambil data dari D1 Database menggunakan binding "hamzahdesign_db"
    let query = "SELECT * FROM case_studies WHERE status = 'published'";
    if (highlighted === 'true') {
      query += " AND is_highlighted = 1";
    }
    query += " ORDER BY created_at DESC";
    const { results } = await env.hamzahdesign_db.prepare(query).all();

    // Melakukan parsing pada kolom JSON string dan memetakan ke camelCase
    const parsedResults = results.map(item => ({
      id: item.id,
      slug: item.slug,
      category: item.category,
      readingTime: item.reading_time,
      title: item.title,
      desc: item.desc,
      heroImage: item.hero_image,
      logo: item.logo,
      liveUrl: item.live_url,
      company: item.company,
      year: item.year,
      designStack: item.design_stack ? JSON.parse(item.design_stack) : [],
      industry: item.industry ? JSON.parse(item.industry) : [],
      sections: item.sections ? JSON.parse(item.sections) : [],
      content: item.content
    }));

    return new Response(JSON.stringify(parsedResults), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
