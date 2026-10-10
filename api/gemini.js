export default async function handler(req, res) {
    // 1. Cuma nerima jalur POST dari web lu
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    // 2. Ngambil Kunci Rahasia dari Lemari Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API Key tidak ditemukan di Vercel.' });
    }

    // 3. Info gambar & prompt dari web lu
    const payload = req.body;
    
    // 4. URL Mesin Gemini (Pake versi paling stabil 1.5-flash)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        // 5. Ngetok pintu server Google
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        // Kalo Google nolak (error), laporin ke web lu
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        
        // Kalo sukses, kirim datanya
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
