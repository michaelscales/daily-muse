import { config } from './config.js';
import type { DailyPrompt } from './prompt.js';
import type { ReferenceImage } from './image.js';
import type { FrenchDaily } from './french.js';
export async function sendTelegram(prompt: DailyPrompt, image: ReferenceImage, french: FrenchDaily): Promise<void> {
  const caption =
    `🎨 Today's prompt\n\n${prompt.text}\n\n` +
    `Reference photo by ${image.photographerName} on Unsplash.\n\n` +
    `🇫🇷 French du jour\n\n${french.drill}\n→ ${french.fr}\n\n${french.en}\n${french.focus}\n\n` +
    `📖 Vocab\n\n${french.vocab.mot} (${french.vocab.genre}) — ${french.vocab.en}\n${french.vocab.exemple}\n\n` +
    `💬 Sagesse\n\n${french.sagesse.fr}\n${french.sagesse.en}`;
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
