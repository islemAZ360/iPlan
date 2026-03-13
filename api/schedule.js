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
                reply = `مرحباً بك في iPlan! 🚀\n\nمعرفك هو: \`${chatId}\`\nقم بنسخه ووضعه في إعدادات الموقع.\n\n` +
                        `Welcome to iPlan! 🚀\nYour ID is: \`${chatId}\`\nCopy and paste it in site settings.\n\n` +
                        `Добро пожаловать в iPlan! 🚀\nВаш ID: \`${chatId}\`\nСкопируйте и вставьте в настройки сайта.`;
            } else {
                reply = `معرفك: \`${chatId}\` | Your ID: \`${chatId}\` | Ваш ID: \`${chatId}\``;
            }

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
            return res.status(200).json({ error: "Logged" });
        }
    }

    // --- CASE 2: Incoming from Frontend ---
    const { time, title, chatId, lang, type } = body || {};

    console.log("Incoming Frontend Request:", { chatId, title, lang, type });

    if (!TELEGRAM_BOT_TOKEN) return res.status(500).json({ error: 'Backend Token missing' });
    if (!chatId) return res.status(400).json({ error: 'Chat ID is required' });

    try {
        let reminderTitle = title;
        let timeLabel = "الوقت";
        let subjectLabel = "الموضوع";
        let headerLabel = type === 'confirmation' ? "تم جدولة التنبيه ✅" : "حان الوقت! 🔔";

        // Translation logic
        if (lang === 'en') {
            timeLabel = "Time";
            subjectLabel = "Subject";
            headerLabel = type === 'confirmation' ? "Reminder Scheduled ✅" : "It's Time! 🔔";
        } else if (lang === 'ru') {
            timeLabel = "Время";
            subjectLabel = "Тема";
            headerLabel = type === 'confirmation' ? "Напоминание запланировано ✅" : "Пришло время! 🔔";
        }

        const formattedTime = time ? new Date(time).toLocaleString(lang === 'ar' ? 'ar-EG' : (lang === 'ru' ? 'ru-RU' : 'en-US')) : (lang === 'ar' ? "الآن" : (lang === 'ru' ? "Сейчас" : "Now"));

        const message = `*${headerLabel}*\n\n📌 *${subjectLabel}:* ${reminderTitle}\n⏰ *${timeLabel}:* ${formattedTime}`;
        
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
