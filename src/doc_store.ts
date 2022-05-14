import produce from 'immer';
import { chain, find, map, pipe } from 'ramda';
import { Config, ConfigKind } from './config';
import { Document, urllize } from './document';

import md from 'markdown-it';
import mdcontainer from '@gerhobbelt/markdown-it-container';
import mdtable from 'markdown-it-multimd-table';

export type FinalizedDocument = {
  config: Config;
  text: string;
  linked: { kind: ConfigKind; name: string }[];
};

export function linkDocuments(documents: Document[]): FinalizedDocument[] {
  const replacers = pipe(
    chain(
      (document: Document) =>
        [
          [document.config.name, document],
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
      let linkedDocs: { kind: ConfigKind; name: string }[] = [];

      replacers: for (const [re, linkedDoc] of replacers) {
        if (
          find((x) => x.name === linkedDoc.config.name, linkedDocs) !==
            undefined ||
          linkedDoc.config.name === document.config.name
        )
          continue replacers;

        document.text = document.text.replace(re, (match) => {
          linkedDocs = produce(linkedDocs, (draft) => {
            draft.push({ ...linkedDoc.config });
          });
          return `[${match}](/${urllize(linkedDoc.config.kind)}/${urllize(
            linkedDoc.config.name
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
})
  .use(mdcontainer)
  .use(mdtable);

export function renderDoc(document: FinalizedDocument): string {
  return markdown.render(document.text);
}
