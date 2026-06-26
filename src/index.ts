import { generatePrompt } from './prompt.js';
import { fetchImage } from './image.js';
import { sendEmail } from './email.js';
import { sendTelegram } from './telegram.js';
import { pickFrench } from './french.js';
async function main() {
  const prompt = generatePrompt();
  console.log(`Prompt: ${prompt.text}`);
  const image = await fetchImage(prompt.keyword);
  console.log(`Image by ${image.photographerName}`);
  const french = pickFrench();
  console.log(`French: ${french.fr}`);
  await Promise.all([sendEmail(prompt, image, french), sendTelegram(prompt, image, french)]);
  console.log('Delivered.');
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
