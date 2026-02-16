// lib/telegram.ts

export async function sendTelegramMessageWithButtons(
  text: string,
  itemId: number,
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы");
    return;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Интересно 👍",
                  callback_data: `interest:${itemId}`,
                },
                {
                  text: "Не интересно 👎",
                  callback_data: `no_interest:${itemId}`,
                },
              ],
            ],
          },
        }),
      },
    );

    if (!res.ok) {
      console.error(
        "Ошибка отправки в Telegram",
        res.status,
        await res.text(),
      );
    }
  } catch (e) {
    console.error("Телеграм недоступен", e);
  }
}
