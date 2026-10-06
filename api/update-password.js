import { createClient } from '@libsql/client';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ success: false });

    const { newPassword } = req.body;
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        // SQL ini akan memasukkan password baru, atau memperbarui jika sudah ada
        await client.execute({
            sql: "INSERT INTO settings (key, value) VALUES ('admin_password', ?) ON CONFLICT(key) DO UPDATE SET value = ?",
            args: [newPassword, newPassword]
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
