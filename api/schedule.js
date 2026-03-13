export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { appId, restKey, playerId, time, title, action } = req.body;

    if (!appId || !restKey) {
        return res.status(400).json({ error: 'Missing configuration' });
    }

    try {
        if (action === 'cancel') {
            const { notificationId } = req.body;
            const response = await fetch(`https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${appId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${restKey}` }
            });
            return res.status(200).json({ success: true });
        }

        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${restKey}`
            },
            body: JSON.stringify({
                app_id: appId,
                contents: { en: title, ar: title },
                include_subscription_ids: [playerId],
                send_after: new Date(time).toUTCString(),
                data: { url: '/#/notes' }
            })
        });
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
