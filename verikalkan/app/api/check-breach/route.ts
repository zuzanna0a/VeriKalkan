export async function POST(req: any) {
  try {
    const { email } = await req.json();

    const url = `https://leakcheck.io/api/public?check=${encodeURIComponent(email)}&key=${process.env.LEAKCHECK_API_KEY}`;

    const res = await fetch(url);
    console.log('Status:', res.status);
    const raw = await res.text();
    console.log('Raw response:', raw);

    const data = JSON.parse(raw);

    if (!data.success) {
      return Response.json({ found: 0, sources: [] });
    }

    return Response.json({
      found: data.found,
      sources: data.sources ?? [],
    });

  } catch (err: any) {
    console.error('HATA:', err.message);
    return Response.json({ found: 0, sources: [] });
  }
}
