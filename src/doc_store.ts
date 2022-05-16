import produce from 'immer';
import { chain, find, map, pipe } from 'ramda';
import { Config } from './config';
import { Document, Section, urllize } from './document';

import md from 'markdown-it';
import mdcontainer from '@gerhobbelt/markdown-it-container';
import mdtable from 'markdown-it-multimd-table';

export type FinalizedDocument = {
  config: Config;
  text: Section[];
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

        const replacer = (match: string) => {
          linkedDocs = produce(linkedDocs, (draft) => {
            draft.push({ name: linkedDoc.name, kind: linkedDoc.kind });
          });
          return `[${match}](/${urllize(linkedDoc.kind)}/${urllize(
            linkedDoc.name
          )})`;
        };

        for (let idx = 0; idx < document.text.length; idx++) {
          const section = document.text[idx];
          switch (section.columns) {
            case 1: {
              section.section = section.section.replace(re, replacer);
              break;
            }
            case 2: {
              section.lhs = section.lhs.replace(re, replacer);
              section.rhs = section.rhs.replace(re, replacer);
              break;
            }
          }
        }
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

export function renderDoc(document: FinalizedDocument): Section[] {
  return produce(document.text, (draft) => {
    for (const section of draft) {
      switch (section.columns) {
        case 1: {
          section.section = markdown.render(section.section);
          break;
        }
        case 2: {
          section.lhs = markdown.render(section.lhs);
          section.rhs = markdown.render(section.rhs);
        }
      }
    }
  });
}
