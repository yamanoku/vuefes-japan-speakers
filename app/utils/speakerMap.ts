import { compareLexicalJa } from '~/utils/stringCollate';
import type { SpeakerWithYear } from '~~/types';

export interface SpeakerRecord {
  name: string;
  nameRuby?: string;
  nameEn?: string;
  years: string[];
  talks: Array<{
    year: string;
    title: string | undefined;
    url: string;
    format?: SpeakerWithYear['format'];
    coSpeakers: string[];
  }>;
}

export function buildSpeakerMap(allSpeakers: SpeakerWithYear[]): Map<string, SpeakerRecord> {
  const map = new Map<string, SpeakerRecord>();
  for (const s of allSpeakers) {
    for (let idx = 0; idx < s.name.length; idx++) {
      const n = s.name[idx] as string;
      const ruby = s.nameRuby?.[idx];
      const nameEn = s.nameEn?.[idx];
      if (!map.has(n)) map.set(n, { name: n, nameRuby: ruby, nameEn, years: [], talks: [] });
      const rec = map.get(n)!;
      if (!rec.nameRuby && ruby) rec.nameRuby = ruby;
      if (!rec.nameEn && nameEn) rec.nameEn = nameEn;
      if (!rec.years.includes(s.year)) rec.years.push(s.year);
      rec.talks.push({
        year: s.year,
        title: s.title,
        url: s.url,
        format: s.format,
        coSpeakers: s.name.filter((x) => x !== n),
      });
    }
  }
  for (const rec of map.values()) {
    rec.talks.sort((a, b) => compareLexicalJa(a.year, b.year));
    rec.years.sort();
  }
  return map;
}

export function hasJapanese(s: string): boolean {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(s);
}
