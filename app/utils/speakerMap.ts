import type { SpeakerWithYear } from '~~/types';

export interface SpeakerRecord {
  name: string;
  years: string[];
  talks: Array<{
    year: string;
    title: string | undefined;
    url: string;
    coSpeakers: string[];
  }>;
}

export function buildSpeakerMap(allSpeakers: SpeakerWithYear[]): Map<string, SpeakerRecord> {
  const map = new Map<string, SpeakerRecord>();
  for (const s of allSpeakers) {
    for (const n of s.name) {
      if (!map.has(n)) map.set(n, { name: n, years: [], talks: [] });
      const rec = map.get(n)!;
      if (!rec.years.includes(s.year)) rec.years.push(s.year);
      rec.talks.push({
        year: s.year,
        title: s.title,
        url: s.url,
        coSpeakers: s.name.filter((x) => x !== n),
      });
    }
  }
  for (const rec of map.values()) {
    rec.talks.sort((a, b) => a.year.localeCompare(b.year));
    rec.years.sort();
  }
  return map;
}

export function hasJapanese(s: string): boolean {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(s);
}
