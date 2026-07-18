// Node.js Serverless Function untuk Vercel
export default async function handler(req, res) {
    // Mengizinkan akses dari browser HP kamu (Bypass CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Link tidak boleh kosong' });

    try {
        // Menggunakan API publik eksternal tapi diproses di sisi SERVER, bukan browser HP
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.code === 0 && result.data) {
            // Kirim link video bersih tanpa watermark ke frontend kita
            return res.status(200).json({ 
                success: true, 
                videoUrl: "https://www.tikwm.com" + result.data.play 
            });
        }
        return res.status(400).json({ error: 'Gagal mengekstrak video.' });
    } catch (error) {
        return res.status(500).json({ error: 'Server backend error.' });
    }
}
