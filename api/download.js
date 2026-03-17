// api/download.js (ULTRA SMART PROXY + STEALTH HEADERS)
export default async function handler(req, res) {
    const { url, name } = req.query;

    if (!url) return res.status(400).send('URL missing');

    try {
        // --- STEALTH MODE: Menyamar jadi Browser ---
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
                'Referer': 'https://videy.co/',
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.9,en;q=0.8'
            }
        });

        if (!response.ok) throw new Error(`Gagal fetch: ${response.statusText} (${response.status})`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // --- DETEKSI FORMAT SAKTI ---
        let contentType = response.headers.get('content-type') || '';
        let extension = 'mp4'; 

        if (contentType.includes('audio') || contentType.includes('mpeg')) {
            extension = 'mp3';
            contentType = 'audio/mpeg';
        } else if (contentType.includes('image')) {
            extension = 'jpg';
        } else if (contentType.includes('video')) {
            extension = 'mp4';
        }

        // Force MP3 Logic
        if (url.toLowerCase().includes('format=mp3') || (name && name.toLowerCase().includes('audio'))) {
            extension = 'mp3';
            contentType = 'audio/mpeg';
        }

        // Set Header dinamis
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${name || 'download'}.${extension}"`);
        
        return res.send(buffer);

    } catch (error) {
        // Kasih status 500 kalau diblokir
        return res.status(500).json({ error: error.message });
    }
}
