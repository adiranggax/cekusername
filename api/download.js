// api/download.js (SMART PROXY: VIDEO & PHOTO OK)
export default async function handler(req, res) {
    const { url, name } = req.query;

    if (!url) return res.status(400).send('URL missing');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Gagal fetch: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // --- LOGIKA PINTAR DETEKSI TYPE ---
        // Cek apakah ini gambar atau video berdasarkan extension atau content-type asli
        const contentType = response.headers.get('content-type') || 'video/mp4';
        const extension = contentType.includes('image') ? 'jpg' : 'mp4';

        // Set Header dinamis
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${name || 'download'}.${extension}"`);
        
        return res.send(buffer);

    } catch (error) {
        return res.status(500).send('Error: ' + error.message);
    }
}
