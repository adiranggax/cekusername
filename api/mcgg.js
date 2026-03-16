export default async function handler(req, res) {
  // --- KONFIGURASI CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // -----------------------

  const { id, zone } = req.query;

  if (!id || !zone) {
    return res.status(400).json({ 
      status: 400, 
      message: "Parameter 'id' dan 'zone' wajib diisi untuk MCGG!" 
    });
  }

  try {
    // Request GET sesuai URL yang kamu kasih
    const response = await fetch(`https://gopay.co.id/games/v1/order/prepare/MAGIC_CHESS_GO_GO?userId=${id}&zoneId=${zone}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://gopay.co.id/games/magic-chess-go-go"
      }
    });

    const result = await response.json();

    if (result.message === "Success" && result.data) {
      // Kita set default flag ke 'id' karena API ini gak ngasih kode negara
      const countryCode = "id";

      return res.status(200).json({
        status: 200,
        username: result.data, // Isinya: "Renyoka"
        id: id,
        zone: zone,
        country: countryCode,
        flag: `https://flagcdn.com/w80/${countryCode}.png`
      });
    } else {
      return res.status(404).json({ 
        status: 404, 
        message: "Akun MCGG tidak ditemukan",
        id: id,
        zone: zone
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: "Gagal cek MCGG", 
      error: error.message 
    });
  }
}
