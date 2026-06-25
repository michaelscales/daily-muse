import { generatePrompt } from './prompt.js';
import { fetchImage } from './image.js';
import { sendEmail } from './email.js';
import { sendTelegram } from './telegram.js';

async function main() {
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
