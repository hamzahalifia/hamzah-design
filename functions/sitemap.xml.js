export async function onRequest(context) {
  const { env } = context;
  const BASE_URL = 'https://hamzah.design';

  try {
    // Fetch all published case studies and explorations
    const [worksResult, explorationsResult] = await Promise.all([
      env.hamzahdesign_db.prepare(
        "SELECT slug, created_at FROM case_studies WHERE status = 'published' ORDER BY created_at DESC"
      ).all(),
      env.hamzahdesign_db.prepare(
        "SELECT id, created_at FROM explorations ORDER BY created_at DESC"
      ).all()
    ]);

    const works = worksResult.results || [];
    const explorations = explorationsResult.results || [];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/work</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/exploration</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
${works.map(w => `  <url>
    <loc>${BASE_URL}/work/${w.slug}</loc>
    <lastmod>${w.created_at ? w.created_at.split('T')[0] : ''}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${explorations.map(e => `  <url>
    <loc>${BASE_URL}/exploration?id=${e.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}