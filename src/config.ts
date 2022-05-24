import produce from 'immer';
import { pipe, reduce, split } from 'ramda';

export class AlthaneDate {
  day: number;
  month: number;
  year: number;
  cycle: number;

  constructor(str: string) {
    const [date, cycle] = str.split('|');
    const [day, month, year] = date.split('.');

    this.day = parseInt(day);
    this.month = parseInt(month);
    this.year = parseInt(year);
    this.cycle = parseInt(cycle);
  }

  compareKey() {
    return (
      this.cycle * 100_000 + this.year * 10_000 + this.month * 1_000 + this.day
    );
  }

  ppMonth() {
    switch (this.month) {
      case 0:
        return 'None';
      case 1:
        return 'Vaati';
      case 2:
        return 'Udasil';
      case 3:
        return 'Samay';
      case 4:
        return 'Sunnok';
      case 5:
        return 'Kybal';
      case 6:
        return 'Kanon';
      case 7:
        return 'Ravic';
      case 8:
        return 'Davar';
      case 9:
        return 'Vikar';
      case 10:
        return 'Shamash';
      case 11:
        return 'Dahn';
      case 12:
        return 'Vazan';
      default:
        throw new Error('BAD DATE PASSED');
    }
  }
}

export type Config = {
  refs: string[];
  ipa: string | null;
  img: string | null;
  dsp: string | null;
  date: string | null;
  news: { author: string; paper: string } | null;
};

function recordToConfig(record: Record<string, string>): Config {
  const refs = record['refs']?.split('|').map((x) => x.trim()) ?? [];
  const ipa = record['ipa']?.trim() ?? null;
  const img = record['img']?.trim() ?? null;
  const dsp = record['dsp']?.trim() ?? null;
  const date = record['date']?.trim() ?? null;
  const news = record['news']?.split('|').map((x) => x.trim()) ?? [];
  return {
    refs,
    ipa,
    img,
    dsp,
    date,
    news: news.length > 0 ? { author: news[0], paper: news[1] } : null,
  };
}

export const parseConfig: (_: string) => Config = pipe(
  split('\n'),
  reduce(
    produce((draft, line) => {
      const [key, ...value] = line.split(':');

      if (key === '') return;
      draft[key] = value.join(':').trim();
    }),
    {} as Record<string, string>
  ),
  recordToConfig
);
