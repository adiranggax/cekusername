// api/download.js (NATIVE FETCH - TANPA AXIOS)
export default async function handler(req, res) {
    // Ambil URL dari query string
    const { url, name } = req.query;

    if (!url) return res.status(400).send('URL link tidak ada Bos!');

    try {
        // Ambil data dari link TikTok/Source asli
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) throw new Error(`Gagal ambil file: ${response.statusText}`);

        // Ambil data sebagai buffer (file mentah)
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Paksa browser download (Header Sakti)
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${name || 'video'}.mp4"`);
        
        // Kirim file ke user
        return res.send(buffer);

    } catch (error) {
        console.error('Error Proxy:', error);
        return res.status(500).json({ error: 'Server Error', message: error.message });
    }
}
