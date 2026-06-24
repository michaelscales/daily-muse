import { config } from './config.js';
import type { DailyPrompt } from './prompt.js';
import type { ReferenceImage } from './image.js';

export async function sendTelegram(prompt: DailyPrompt, image: ReferenceImage): Promise<void> {
  const caption =
    `🎨 Today's prompt\n\n${prompt.text}\n\n` +
    `Reference photo by ${image.photographerName} on Unsplash.`;

  const res = await fetch(
    `https://api.telegram.org/bot${config.telegramBotToken}/sendPhoto`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        photo: image.url,
        caption,
      }),
    }
  );
  if (!res.ok) throw new Error(`Telegram failed: ${res.status} ${await res.text()}`);
}
