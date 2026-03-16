export default async function handler(req, res) {
  // --- BAGIAN CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Mengizinkan semua domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle request OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // -------------------

  const { id, zone } = req.query;

  if (!id || !zone) {
    return res.status(400).json({ 
      status: 400, 
      message: "Parameter 'id' dan 'zone' wajib diisi!" 
    });
  }

  try {
    const response = await fetch("https://gopay.co.id/games/v1/order/user-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://gopay.co.id/games/mobile-legends"
      },
      body: JSON.stringify({
        code: "MOBILE_LEGENDS",
        data: { userId: id, zoneId: zone }
      })
    });

    const result = await response.json();

    if (result.message === "Success" && result.data) {
      return res.status(200).json({
        status: 200,
        username: result.data.username,
        country: result.data.countryOrigin || "id",
        id: id,
        zone: zone
      });
    } else {
      return res.status(404).json({ 
        status: 404, 
        message: "User ID atau Zone tidak ditemukan",
        id: id,
        zone: zone
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
}
