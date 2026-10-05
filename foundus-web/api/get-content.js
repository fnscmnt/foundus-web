import { createClient } from '@libsql/client';

export default async function handler(req, res) {
    // Inisialisasi koneksi ke Turso menggunakan Environment Variables
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        // Contoh query mengambil data 'About Us'
        const result = await client.execute("SELECT * FROM konten_halaman WHERE section = 'about_us'");
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}