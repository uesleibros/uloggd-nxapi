process.env.NXAPI_DATA_PATH = '/tmp';
process.env.XDG_DATA_HOME = '/tmp';
process.env.XDG_CACHE_HOME = '/tmp';
process.env.XDG_STATE_HOME = '/tmp';
process.env.HOME = '/tmp';

import { addUserAgent } from 'nxapi';
import CoralApi from 'nxapi/coral';

addUserAgent('uloggd-nxapi/1.0.0 (+https://github.com/uesleibros/uloggd-nxapi)');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sessionToken } = req.body;

    if (!sessionToken) {
        return res.status(400).json({ error: 'sessionToken required' });
    }

    try {
        const { nso } = await CoralApi.createWithSessionToken(sessionToken);
        const user = await nso.getCurrentUser();

        res.json({
            success: true,
            data: {
                name: user.name,
                friendCode: user.links.friendCode.id,
                avatar: user.imageUri,
                nsaId: user.nsaId
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
