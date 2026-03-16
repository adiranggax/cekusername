// api/download.js (Vercel Serverless Function)
export default async function handler(req, res) {
    const { url, name } = req.query;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // INI KUNCINYA: Memaksa browser menganggap ini file download
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${name || 'video'}.mp4"`);
        
        return res.send(buffer);
    } catch (error) {
        return res.status(500).send('Download failed');
    }
}
