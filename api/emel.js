export default async function handler(req, res) {
  // Ambil ID dan Zone dari Query String (misal: ?id=123&zone=456)
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://gopay.co.id/games/mobile-legends"
      },
      body: JSON.stringify({
        code: "MOBILE_LEGENDS",
        data: {
          userId: id,
          zoneId: zone
        }
      })
    });

    const result = await response.json();

    // Jika berhasil dapat data dari Gopay
    if (result.message === "Success" && result.data) {
      return res.status(200).json({
        status: 200,
        username: result.data.username,
        country: result.data.countryOrigin || "unknown", // Menampilkan Country
        id: id,
        zone: zone
      });
    } else {
      // Jika ID/Zone salah atau tidak ditemukan
      return res.status(404).json({ 
        status: 404, 
        message: "User ID atau Zone tidak ditemukan",
        raw: result 
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: "Koneksi ke server Gopay bermasalah", 
      error: error.message 
    });
  }
}
// update v2
