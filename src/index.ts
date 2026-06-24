import { generatePrompt } from './prompt.js';
import { fetchImage } from './image.js';
import { sendEmail } from './email.js';
import { sendTelegram } from './telegram.js';

function isSixAmCentral(): boolean {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      hour12: false,
    }).format(new Date())
  );
  return hour === 6;
}

async function main() {
  if (process.env.FORCE_RUN !== 'true' && !isSixAmCentral()) {
    console.log('Not 6 AM Central — skipping this run.');
    return;
  }

  const prompt = generatePrompt();
  console.log(`Prompt: ${prompt.text}`);

  const image = await fetchImage(prompt.keyword);
  console.log(`Image by ${image.photographerName}`);

  await Promise.all([sendEmail(prompt, image), sendTelegram(prompt, image)]);
  console.log('Delivered.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
