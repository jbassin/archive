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

export type Document = {
  config: Config;
  text: string;
  kind: string;
  name: string;
  path: string[];
};

export function urllize(str: string): string {
  return encodeURIComponent(str.replaceAll(' ', '-').toLocaleLowerCase());
}

function parseFilepath(filepath: string) {
  const path = pipe(
    split('/'),
    dropWhile((s) => s !== 'data'),
    drop(1)
  )(filepath);

  const kind = head(path) as string;
  const name = pipe(
    last,
    split('.'),
    dropLast(1) as (_: string[]) => string[],
    join('.'),
    replace(/\b./g, toUpper),
    replace(/-/g, ' ')
  )(path);

  return {
    kind,
    name,
    path: [
      ...pipe(dropLast(1) as (_: string[]) => string[], append(name))(path),
    ],
  };
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
      text: rawText.join('\n').trim(),
      kind,
      name,
      path,
    };
  }

  return {
    config: parseConfig(''),
    text: document.trim(),
    kind,
    name,
    path,
  };
}
