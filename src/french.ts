import { readFileSync } from 'fs';

export interface FrenchPhrase {
  fr: string;
  en: string;
  drill: string;
  focus: string;
}

export function pickFrench(): FrenchPhrase {
  const raw = readFileSync('data/french.json', 'utf-8');
  const data = JSON.parse(raw);
  const phrases: FrenchPhrase[] = data.phrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
