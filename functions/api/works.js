export async function onRequest(context) {
  const { env } = context;

  try {
    // Mengambil data dari D1 Database menggunakan binding "hamzahdesign_db"
    const { results } = await env.hamzahdesign_db.prepare(
      "SELECT * FROM case_studies ORDER BY created_at DESC"
    ).all();

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
