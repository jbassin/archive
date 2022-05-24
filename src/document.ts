import {
  append,
  drop,
  dropLast,
  dropWhile,
  head,
  join,
  last,
  pipe,
  replace,
  split,
  tail,
  toUpper,
} from 'ramda';
import { Config, parseConfig } from './config';

export type Section =
  | { columns: 1; section: string }
  | { columns: 2; lhs: string; rhs: string };

export type Document = {
  config: Config;
  text: Section[];
  kind: string;
  name: string;
  path: string[];
};

export function urllize(str: string): string {
  return encodeURIComponent(
    str
      .replaceAll(' ', '-')
      .replaceAll('&', 'and')
      .replaceAll('®', '')
      .toLocaleLowerCase()
  );
}

function parseFilepath(filepath: string) {
  const path = pipe(
    split('/'),
    dropWhile((s) => s !== 'data'),
    drop(1)
  )(filepath);

  const kind = pipe(head, replace(/\.md$/, ''))(path) as string;
  const name = pipe(
    last,
    split('.'),
    dropLast(1) as (_: string[]) => string[],
    join('.'),
    replace(/\s./g, toUpper),
    replace(/-/g, ' '),
    replace(/(?<!^)And/g, 'and'),
    replace(/(?<!^)Of/g, 'of'),
    replace(/(?<!^)The/g, 'the')
  )(path);

  return {
    kind,
    name,
    path: [
      ...pipe(dropLast(1) as (_: string[]) => string[], append(name))(path),
    ],
  };
}

function parseColumns(doc: string): Section[] {
  return doc.split('+++').map((section) => {
    const split = section.split('///');

    if (split.length === 1) {
      return { columns: 1, section: section.trim() };
    }
    return { columns: 2, lhs: split[0].trim(), rhs: split[1].trim() };
  });
}

export function parseDocument(filepath: string, document: string): Document {
  const { kind, name, path } = parseFilepath(filepath);

  if (document.startsWith('---')) {
    const [rawConfig, ...rawText] = pipe(
      split('\n'),
      tail,
      join('\n'),
      split('---')
    )(document);

    return {
      config: parseConfig(rawConfig),
      text: parseColumns(rawText.join('\n').trim()),
      kind,
      name,
      path,
    };
  }

  return {
    config: parseConfig(''),
    text: parseColumns(document.trim()),
    kind,
    name,
    path,
  };
}
