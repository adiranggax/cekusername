// api/download.js (ULTRA SMART PROXY)
export default async function handler(req, res) {
    const { url, name } = req.query;

    if (!url) return res.status(400).send('URL missing');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Gagal fetch: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // --- DETEKSI FORMAT SAKTI ---
        let contentType = response.headers.get('content-type') || '';
        let extension = 'mp4'; // Default awal

        // 1. Cek dari Content-Type Header
        if (contentType.includes('audio') || contentType.includes('mpeg')) {
            extension = 'mp3';
            contentType = 'audio/mpeg';
        } else if (contentType.includes('image')) {
            extension = 'jpg';
        } else if (contentType.includes('video')) {
            extension = 'mp4';
        }

        // 2. Cross-check dari URL (Force MP3 jika ada parameter mp3)
        if (url.toLowerCase().includes('format=mp3') || (name && name.toLowerCase().includes('audio'))) {
            extension = 'mp3';
            contentType = 'audio/mpeg';
        }

        // Set Header dinamis supaya HP langsung ngenalin filenya
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${name || 'download'}.${extension}"`);
        
        return res.send(buffer);

    } catch (error) {
        return res.status(500).send('Error: ' + error.message);
    }
}
