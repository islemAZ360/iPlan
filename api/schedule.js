// --- CONFIGURATION (TELEGRAM BOT BACKEND) ---
const TELEGRAM_BOT_TOKEN = "8634671221:AAF4-Yb6DctLQ7uUM55yBujZirpWNLri-Ig";
// Note: Chat ID will be sent from the frontend or hardcoded if provided.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body;

    // --- CASE 1: Incoming from Telegram (Webhook) ---
    if (body && body.message) {
        try {
            const chatId = body.message.chat.id;
            const text = body.message.text || "";

            console.log("Telegram Webhook received for ChatID:", chatId);

            let reply = "";
            if (text.startsWith('/start')) {
                reply = `مرحباً بك في iPlan! 🚀\n\nمعرفك هو: \`${chatId}\`\n\nقم بنسخه ووضعه في إعدادات الموقع لتفعيل التنبيهات.`;
            } else {
                reply = `معرفك الخاص في iPlan هو: \`${chatId}\``;
            }

            // Fire and forget send message to Telegram or await for log
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: reply,
                    parse_mode: 'Markdown'
                })
            });

            return res.status(200).json({ ok: true });
        } catch (webhookError) {
            console.error("Webhook Logic Error:", webhookError);
            // Always return 200 to Telegram to stop retries
            return res.status(200).json({ error: "Logged" });
        }
    }

    // --- CASE 2: Incoming from Frontend ---
    const { time, title, chatId } = body || {};

    console.log("Incoming Frontend Request:", { chatId, title });

    if (!TELEGRAM_BOT_TOKEN) {
        return res.status(500).json({ error: 'Backend Token missing' });
    }

    if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
    }

    try {
        const reminderTitle = title || "تنبيه من iPlan";
        const reminderTime = time ? new Date(time).toLocaleString('ar-EG') : "الآن";

        const message = `🔔 *تنبيه iPlan*\n\n📌 *الموضوع:* ${reminderTitle}\n⏰ *الوقت:* ${reminderTime}`;
        
        console.log("Sending to Telegram:", { chatId, message });

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
