import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', 'data');
const pendingPath = join(dataDir, 'pending.json');
const frenchPath  = join(dataDir, 'french.json');

interface Phrase  { fr: string; en: string; drill: string; focus: string; }
interface Vocab   { mot: string; genre: string; en: string; exemple: string; }
interface Sagesse { fr: string; en: string; }
interface Bank    { phrases: Phrase[]; vocab: Vocab[]; sagesse: Sagesse[]; }

function load(path: string): Bank {
  return JSON.parse(readFileSync(path, 'utf-8')) as Bank;
}

function save(path: string, data: Bank) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

function hr() { console.log('─'.repeat(60)); }

async function ask(rl: Awaited<ReturnType<typeof createInterface>>, question: string): Promise<boolean> {
  const answer = await rl.question(question);
  return answer.trim().toLowerCase() === 'y';
}

async function main() {
  const pending = load(pendingPath);
  const total = pending.phrases.length + pending.vocab.length + pending.sagesse.length;

  if (total === 0) {
    console.log('Nothing in pending.json. Run: npx tsx src/generate.ts');
    return;
  }

  console.log(`\n${total} entries to review.\n`);

  const rl = createInterface({ input, output });
  const approved: Bank = { phrases: [], vocab: [], sagesse: [] };

  // --- phrases ---
  if (pending.phrases.length > 0) {
    console.log(`PHRASES (${pending.phrases.length})\n`);
    for (const p of pending.phrases) {
      hr();
      console.log(`  FR:    ${p.fr}`);
      console.log(`  EN:    ${p.en}`);
      console.log(`  DRILL: ${p.drill}`);
      console.log(`  FOCUS: ${p.focus}`);
      console.log();
      if (await ask(rl, '  Approve? (y/n): ')) {
        approved.phrases.push(p);
      }
    }
  }

  // --- vocab ---
  if (pending.vocab.length > 0) {
    console.log(`\nVOCAB (${pending.vocab.length})\n`);
    for (const v of pending.vocab) {
      hr();
      console.log(`  MOT:     ${v.mot} (${v.genre})`);
      console.log(`  EN:      ${v.en}`);
      console.log(`  EXEMPLE: ${v.exemple}`);
      console.log();
      if (await ask(rl, '  Approve? (y/n): ')) {
        approved.vocab.push(v);
      }
    }
  }

  // --- sagesse ---
  if (pending.sagesse.length > 0) {
    console.log(`\nSAGESSE (${pending.sagesse.length})\n`);
    for (const s of pending.sagesse) {
      hr();
      console.log(`  FR: ${s.fr}`);
      console.log(`  EN: ${s.en}`);
      console.log();
      if (await ask(rl, '  Approve? (y/n): ')) {
        approved.sagesse.push(s);
      }
    }
  }

  rl.close();

  // Write approved entries into french.json
  if (approved.phrases.length + approved.vocab.length + approved.sagesse.length > 0) {
    const bank = load(frenchPath);
    bank.phrases.push(...approved.phrases);
    bank.vocab.push(...approved.vocab);
    bank.sagesse.push(...approved.sagesse);
    save(frenchPath, bank);
  }

  // Clear pending
  save(pendingPath, { phrases: [], vocab: [], sagesse: [] });

  hr();
  console.log(`\nApproved: ${approved.phrases.length} phrases, ${approved.vocab.length} vocab, ${approved.sagesse.length} sagesse`);
  console.log(`french.json now has:`);
  const final = load(frenchPath);
  console.log(`  ${final.phrases.length} phrases  ${final.vocab.length} vocab  ${final.sagesse.length} sagesse`);
  console.log();
}

main().catch((err) => { console.error(err); process.exit(1); });
