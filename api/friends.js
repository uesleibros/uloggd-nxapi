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
        const friendList = await nso.getFriendList();

        const friends = friendList.friends.map(f => ({
            name: f.name,
            status: f.presence?.state || 'OFFLINE',
            avatar: f.imageUri,
            nsaId: f.nsaId
        }));

        res.json({
            success: true,
            data: friends
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
