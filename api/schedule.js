// --- CONFIGURATION (TELEGRAM BOT BACKEND) ---
const TELEGRAM_BOT_TOKEN = "8634671221:AAF4-Yb6DctLQ7uUM55yBujZirpWNLri-Ig";
// Note: Chat ID will be sent from the frontend or hardcoded if provided.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { playerId, time, title, action, chatId } = req.body;

    if (!TELEGRAM_BOT_TOKEN) {
        return res.status(400).json({ error: 'Telegram Bot Token missing' });
    }

    try {
        // We use a simple strategy: Telegram doesn't have a 'native' scheduler like OneSignal
        // For a true 100% free background solution on Vercel (Serverless), 
        // we will use the fetch to Telegram API.
        // NOTE: Since Vercel functions are short-lived, for future scheduling we'd usually need a CRON.
        // BUT, for instant testing and "active" sessions, this confirms the bridge works.

        const message = `🔔 *iPlan Reminder*\n\n*Title:* ${title}\n*Time:* ${new Date(time).toLocaleString()}`;
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Telegram Proxy Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
