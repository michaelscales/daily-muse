import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  unsplashAccessKey: required('UNSPLASH_ACCESS_KEY'),
  resendApiKey: required('RESEND_API_KEY'),
  fromEmail: required('FROM_EMAIL'),
  toEmail: required('TO_EMAIL'),
  telegramBotToken: required('TELEGRAM_BOT_TOKEN'),
  telegramChatId: required('TELEGRAM_CHAT_ID'),
};
