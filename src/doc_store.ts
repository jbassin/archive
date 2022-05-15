import produce from 'immer';
import { chain, find, map, pipe } from 'ramda';
import { Config } from './config';
import { Document, urllize } from './document';

import md from 'markdown-it';
import mdcontainer from '@gerhobbelt/markdown-it-container';
import mdtable from 'markdown-it-multimd-table';

export type FinalizedDocument = {
  config: Config;
  text: string;
  linked: { kind: string; name: string }[];
  kind: string;
  name: string;
  path: [];
};

export function linkDocuments(documents: Document[]): FinalizedDocument[] {
  const replacers = pipe(
    chain(
      (document: Document) =>
        [
          [document.name, document],
          ...map((x: string) => [x, document], document.config.refs),
        ] as [string, Document][]
    ),
    map(
      ([str, document]) =>
        [new RegExp(str, 'i'), document] as [RegExp, Document]
    )
  )(documents);

  return produce(documents as FinalizedDocument[], (documentDraft) => {
    for (const document of documentDraft) {
      let linkedDocs: { kind: string; name: string }[] = [];

      replacers: for (const [re, linkedDoc] of replacers) {
        if (
          find((x) => x.name === linkedDoc.name, linkedDocs) !== undefined ||
          linkedDoc.name === document.name
        )
          continue replacers;

        document.text = document.text.replace(re, (match) => {
          linkedDocs = produce(linkedDocs, (draft) => {
            draft.push({ name: linkedDoc.name, kind: linkedDoc.kind });
          });
          return `[${match}](/${urllize(linkedDoc.kind)}/${urllize(
            linkedDoc.name
          )})`;
        });
      }

      document.linked = linkedDocs;
    }
  });
}

const markdown = md({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})
  .use(mdcontainer)
  .use(mdtable);

export function renderDoc(document: FinalizedDocument): string {
  return markdown.render(document.text);
}
