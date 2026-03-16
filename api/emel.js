export default async function handler(req, res) {
  // --- KONFIGURASI CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // -----------------------

  const { id, zone } = req.query;

  if (!id || !zone) {
    return res.status(400).json({ 
      status: 400, 
      message: "Mana ID & Zone-nya?" 
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
      // Ambil kode negara & buat huruf kecil (Flagpedia butuh lowercase)
      const countryCode = (result.data.countryOrigin || "id").toLowerCase();
      
      return res.status(200).json({
        status: 200,
        username: result.data.username,
        id: id,
        zone: zone,
        country: countryCode,
        // Link bendera dari Flagpedia (Flagcdn)
        flag: `https://flagcdn.com/w80/${countryCode}.png`
      });
    } else {
      return res.status(404).json({ 
        status: 404, 
        message: "User kagak ketemu!",
        id: id,
        zone: zone
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: "Server Gopay lagi pusing", 
      error: error.message 
    });
  }
}
