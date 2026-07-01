export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const highlighted = url.searchParams.get('highlighted');

  try {
    // Mengambil data dari D1 Database menggunakan binding "hamzahdesign_db"
    let query = "SELECT * FROM explorations";
    if (highlighted === 'true') {
      query += " WHERE is_highlighted = 1";
    }
    query += " ORDER BY created_at DESC";
    const { results } = await env.hamzahdesign_db.prepare(query).all();

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
