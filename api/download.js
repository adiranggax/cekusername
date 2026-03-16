// api/download.js (Versi Stream - Stabil Laptop & HP)
import axios from 'axios';

export default async function handler(req, res) {
    const { url, name } = req.query;

    if (!url) return res.status(400).send('URL missing');

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream', // Kita pakai mode stream biar gak makan RAM server
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        // Set Header biar browser tahu ini file yang HARUS didownload
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${name || 'video'}.mp4"`);

        // Pipa datanya langsung ke user
        response.data.pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('Proxy Error');
    }
}
