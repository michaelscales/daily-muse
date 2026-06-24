import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

interface Subject { label: string; keyword: string; }
interface Themes {
  subjects: Subject[];
  treatments: string[];
  lighting: string[];
  composition: string[];
}

export interface DailyPrompt { text: string; keyword: string; }

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function generatePrompt(): DailyPrompt {
  const themes = JSON.parse(
    readFileSync(join(here, '..', 'data', 'themes.json'), 'utf-8')
  ) as Themes;

  const subject = pick(themes.subjects);
  const text =
    `${subject.label}, ${pick(themes.treatments)}, ` +
    `${pick(themes.lighting)}, ${pick(themes.composition)}.`;

  return { text, keyword: subject.keyword };
}
