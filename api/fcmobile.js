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

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ 
      status: 400, 
      message: "ID FC Mobile wajib diisi!" 
    });
  }

  try {
    // Request GET sesuai URL FC Mobile yang kamu kasih
    const response = await fetch(`https://gopay.co.id/games/v1/order/prepare/FC_MOBILE?userId=${id}&zoneId=`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://gopay.co.id/games/ea-sports-fc-mobile"
      }
    });

    const result = await response.json();

    if (result.message === "Success" && result.data) {
      // Default flag ke 'id'
      const countryCode = "id";

      return res.status(200).json({
        status: 200,
        username: result.data, // Isinya: "Rushy"
        id: id,
        country: countryCode,
        flag: `https://flagcdn.com/w80/${countryCode}.png`
      });
    } else {
      return res.status(404).json({ 
        status: 404, 
        message: "ID FC Mobile tidak ditemukan",
        id: id
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: "Gagal cek FC Mobile", 
      error: error.message 
    });
  }
}
