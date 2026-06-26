import { readFileSync } from 'fs';

export interface FrenchPhrase {
  fr: string;
  en: string;
  drill: string;
  focus: string;
}

export interface FrenchVocab {
  mot: string;
  genre: string;
  en: string;
  exemple: string;
}

export interface FrenchSagesse {
  fr: string;
  en: string;
}

export interface FrenchDaily extends FrenchPhrase {
  vocab: FrenchVocab;
  sagesse: FrenchSagesse;
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function pickFrench(): FrenchDaily {
  const data = JSON.parse(readFileSync('data/french.json', 'utf-8'));
  return {
    ...pick<FrenchPhrase>(data.phrases),
    vocab:   pick<FrenchVocab>(data.vocab),
    sagesse: pick<FrenchSagesse>(data.sagesse),
  };
}
