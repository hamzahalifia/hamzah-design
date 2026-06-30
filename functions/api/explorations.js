export async function onRequest(context) {
  const { env } = context;

  try {
    // Mengambil data dari D1 Database menggunakan binding "hamzahdesign_db"
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
