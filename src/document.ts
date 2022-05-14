import { join, pipe, split, tail } from 'ramda';
import { Config, parseConfig } from './config';

export type Document = {
  config: Config;
  text: string;
};

export function urllize(str: string): string {
  return encodeURIComponent(str.replaceAll(' ', '-').toLocaleLowerCase());
}

export function parseDocument(document: string): Document {
  const [rawConfig, ...rawText] = pipe(
    split('\n'),
    tail,
    join('\n'),
    split('---')
  )(document);

  return {
    config: parseConfig(rawConfig),
    text: rawText.join('\n').trim(),
  };
}
