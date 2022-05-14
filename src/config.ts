import produce from 'immer';
import { pipe, reduce, split } from 'ramda';

export type ConfigKind = 'ancestry' | 'divinity';

export type Config = {
  name: string;
  kind: ConfigKind;
  refs: string[];
  ipa: string | null;
};

function recordToConfig(record: Record<string, string>): Config {
  const name = record['name']?.trim() ?? 'ERR';
  const kind = (record['kind']?.trim() as ConfigKind) ?? 'ERR';
  const refs = record['refs']?.split('|').map((x) => x.trim()) ?? [];
  const ipa = record['ipa']?.trim() ?? null;
  return { name, kind, refs, ipa };
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
