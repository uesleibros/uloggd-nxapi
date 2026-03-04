import { CoralApiInterface } from 'nxapi';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sessionToken } = req.body;

    if (!sessionToken) {
        return res.status(400).json({ error: 'sessionToken required' });
    }

    try {
        const nso = CoralApiInterface.createWithSessionToken(sessionToken);
        const history = await nso.getPlayHistory();

        const games = history.playHistories.map(g => ({
            name: g.name,
            imageUri: g.imageUri,
            totalPlayTime: g.totalPlayTime,
            firstPlayed: g.firstPlayedAt
        }));

        res.json({
            success: true,
            data: games
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
