import { createClient } from '@libsql/client';

export default async function handler(req, res) {
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        const result = await client.execute("SELECT value FROM settings WHERE key = 'about_text'");
        const text = result.rows.length > 0 ? result.rows[0].value : "Teks belum diatur di database.";
        res.status(200).json({ success: true, data: text });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
