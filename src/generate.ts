import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', 'data');
const pendingPath = join(dataDir, 'pending.json');

interface Phrase { fr: string; en: string; drill: string; focus: string; }
interface Vocab  { mot: string; genre: string; en: string; exemple: string; }
interface Sagesse { fr: string; en: string; }
interface Bank { phrases: Phrase[]; vocab: Vocab[]; sagesse: Sagesse[]; }

function load(path: string): Bank {
  return JSON.parse(readFileSync(path, 'utf-8')) as Bank;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY in .env');

  const client = new Anthropic({ apiKey });

  const system = `You are an expert French language teacher creating content for an A2-going-on-B1 English speaker.

The learner has three specific weak spots:
1. Passé composé — they write "j'ai faire" instead of "j'ai fait". Drill irregular past participles in everyday contexts.
2. Modal + infinitive — they write "je dois écrit" instead of "je dois écrire". The verb after a modal (devoir, vouloir, pouvoir, aller) always stays infinitive.
3. Partitive "de" after a quantity — they forget the article drops: "un morceau DE gâteau" not "un morceau DU gâteau". Quantities include: un verre de, une tasse de, beaucoup de, assez de, trop de, un morceau de.

Keep accents correct. Write natural, everyday French — not textbook stiff. Contexts: art, daily life, food, nature.`;

  const prompt = `Generate new French learning entries. Return ONLY a JSON object — no prose, no code fences.

Shape:
{
  "phrases": [
    { "fr": "...", "en": "...", "drill": "Fill-in-the-blank prompt with ___ for the gap", "focus": "One-line grammar note under 100 chars" }
  ],
  "vocab": [
    { "mot": "...", "genre": "m | f | v | adj", "en": "...", "exemple": "French sentence (English translation in parentheses)" }
  ],
  "sagesse": [
    { "fr": "...", "en": "..." }
  ]
}

Generate:
- 3 phrases — one targeting each weak spot, in that order
- 3 vocab entries — useful words for an artist or creative person at A2–B1 level
- 2 sagesse entries — French proverbs or wise sayings (not "Vouloir c'est pouvoir" or "Petit à petit")`;

  console.log('Calling Claude…');
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  let generated: Bank;
  try {
    generated = JSON.parse(cleaned);
  } catch {
    console.error('Could not parse Claude response:\n', raw);
    process.exit(1);
  }

  const pending = load(pendingPath);
  pending.phrases.push(...generated.phrases);
  pending.vocab.push(...generated.vocab);
  pending.sagesse.push(...generated.sagesse);

  writeFileSync(pendingPath, JSON.stringify(pending, null, 2), 'utf-8');

  console.log(`Added to data/pending.json:`);
  console.log(`  ${generated.phrases.length} phrases`);
  console.log(`  ${generated.vocab.length} vocab`);
  console.log(`  ${generated.sagesse.length} sagesse`);
  console.log(`\nRun: npx tsx src/approve.ts`);
}

main().catch((err) => { console.error(err); process.exit(1); });
