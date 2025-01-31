import { createClient } from '@libsql/client';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Alle Geräte abrufen
        const result = await db.execute('SELECT * FROM devices');
        res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
        // Neues Gerät hinzufügen
        const { name, type, power, room, category, image } = req.body;
        await db.execute(
            'INSERT INTO devices (name, type, power, room, category, image) VALUES (?, ?, ?, ?, ?, ?)',
            [name, type, power, room, category, image]
        );
        res.status(201).json({ message: 'Gerät hinzugefügt' });
    }

    if (req.method === 'DELETE') {
        // Gerät löschen
        const { id } = req.body;
        await db.execute('DELETE FROM devices WHERE id = ?', [id]);
        res.status(200).json({ message: 'Gerät gelöscht' });
    }

    if (req.method === 'PUT') {
        // Gerät aktualisieren
        const { id, name, type, power, room, category, image } = req.body;
        await db.execute(
            'UPDATE devices SET name=?, type=?, power=?, room=?, category=?, image=? WHERE id=?',
            [name, type, power, room, category, image, id]
        );
        res.status(200).json({ message: 'Gerät aktualisiert' });
    }
}
