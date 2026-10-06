import { createClient } from '@libsql/client';

export default async function handler(req, res) {
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        const result = await client.execute("SELECT value FROM settings WHERE key = 'site_master_data'");
        const data = result.rows.length > 0 ? result.rows[0].value : null;
        
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
