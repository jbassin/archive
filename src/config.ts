import produce from 'immer';
import { pipe, reduce, split } from 'ramda';

export type Config = {
  refs: string[];
  ipa: string | null;
  img: string | null;
};

function recordToConfig(record: Record<string, string>): Config {
  const refs = record['refs']?.split('|').map((x) => x.trim()) ?? [];
  const ipa = record['ipa']?.trim() ?? null;
  const img = record['img']?.trim() ?? null;
  return { refs, ipa, img };
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
