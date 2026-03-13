// --- CONFIGURATION (HARDCODED BACKEND) ---
const ONESIGNAL_APP_ID = "beb3002b-8f12-4951-ae51-719fe24ff9b5";
const ONESIGNAL_REST_KEY = "28558998-0953-43b8-96c5-d770b233b2d8"; // Legacy Key extracted from dashboard

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { playerId, time, title, action } = req.body;

    if (!ONESIGNAL_APP_ID || ONESIGNAL_REST_KEY.includes("ضـع")) {
        return res.status(400).json({ error: 'Backend configuration missing' });
    }

    try {
        if (action === 'cancel') {
            const { notificationId } = req.body;
            const response = await fetch(`https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${ONESIGNAL_REST_KEY}` }
            });
            return res.status(200).json({ success: true });
        }

        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${ONESIGNAL_REST_KEY}`
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
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
