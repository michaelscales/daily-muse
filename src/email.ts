import { Resend } from 'resend';
import { config } from './config.js';
import type { DailyPrompt } from './prompt.js';
import type { ReferenceImage } from './image.js';

const resend = new Resend(config.resendApiKey);

export async function sendEmail(prompt: DailyPrompt, image: ReferenceImage): Promise<void> {
  const html = `
    <div style="max-width:560px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a;">
      <p style="font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#888;">
        Your daily prompt
      </p>
      <p style="font-size:20px;line-height:1.5;">${prompt.text}</p>
      <img src="${image.url}" alt="reference photo"
           style="width:100%;border-radius:8px;margin:16px 0;" />
      <p style="font-size:12px;color:#888;">
        Photo by <a href="${image.photographerUrl}">${image.photographerName}</a>
        on <a href="https://unsplash.com/?utm_source=daily_muse&utm_medium=referral">Unsplash</a>.
      </p>
    </div>`;

  const { error } = await resend.emails.send({
    from: config.fromEmail,
    to: config.toEmail,
    subject: `Today's prompt: ${prompt.keyword}`,
    html,
  });
  if (error) throw new Error(`Resend failed: ${JSON.stringify(error)}`);
}
