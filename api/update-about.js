import { createClient } from '@libsql/client';

export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { newText } = req.body;

    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        await client.execute({
            sql: "UPDATE settings SET value = ? WHERE key = 'about_text'",
            args: [newText]
        });
        
        res.status(200).json({ success: true, message: 'Data berhasil diperbarui!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
