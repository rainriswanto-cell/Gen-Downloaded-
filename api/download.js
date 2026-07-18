// Node.js Serverless Function untuk Vercel
export default async function handler(req, res) {
    // Mengizinkan akses dari browser (Bypass CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Mengambil URL bisa dari body POST atau query GET (biar lebih fleksibel)
    let url = req.query.url;
    if (req.body && req.body.url) {
        url = req.body.url;
    } else if (typeof req.body === 'string') {
        try {
            const parsed = JSON.parse(req.body);
            url = parsed.url;
        } catch (e) {}
    }

    if (!url) {
        return res.status(400).json({ error: 'Link tidak boleh kosong' });
    }

    try {
        // Menggunakan API publik eksternal diproses di sisi SERVER
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.code === 0 && result.data) {
            // Cek apakah link play sudah lengkap atau perlu ditambah domain
            let finalVideoUrl = result.data.play;
            if (finalVideoUrl && !finalVideoUrl.startsWith('http')) {
                finalVideoUrl = "https://www.tikwm.com" + finalVideoUrl;
            }

            return res.status(200).json({ 
                success: true, 
                videoUrl: finalVideoUrl 
            });
        }
        return res.status(400).json({ error: 'Gagal mengekstrak video. Pastikan link TikTok valid.' });
    } catch (error) {
        return res.status(500).json({ error: 'Server backend error.' });
    }
}
