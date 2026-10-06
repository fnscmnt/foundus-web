import { createClient } from '@libsql/client';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ success: false });

    const { password } = req.body;
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        const result = await client.execute("SELECT value FROM settings WHERE key = 'admin_password'");
        
        // Jika belum ada password di database, gunakan 'admin123' sebagai default
        let currentPassword = 'admin123'; 
        if (result.rows.length > 0) {
            currentPassword = result.rows[0].value;
        }

        if (password === currentPassword) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Password salah' });
        }
    } catch (error) {
        // Fallback aman jika tabel settings belum siap
        if (password === 'admin123') return res.status(200).json({ success: true });
        res.status(500).json({ success: false, error: error.message });
    }
}
