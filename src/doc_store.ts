import produce from 'immer';
import { chain, concat, find, map, pipe, prop, sortBy, uniqBy } from 'ramda';
import { Config } from './config';
import { Document, Section, urllize } from './document';

import md from 'markdown-it';
import mdcontainer from '@gerhobbelt/markdown-it-container';
import mdtable from 'markdown-it-multimd-table';
import { WritableDraft } from 'immer/dist/internal';

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

  const inter = produce(documents as FinalizedDocument[], (documentDraft) => {
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

  const append = (
    rec: WritableDraft<
      Record<
        string,
        {
          kind: string;
          name: string;
        }[]
      >
    >,
    key: string,
    item: {
      kind: string;
      name: string;
    }
  ) => {
    if (rec[key]) {
      rec[key].push(item);
    } else {
      rec[key] = [item];
    }
  };

  const backrefrences = produce(
    {} as Record<
      string,
      {
        kind: string;
        name: string;
      }[]
    >,
    (draft) => {
      for (const document of inter) {
        for (const link of document.linked) {
          append(draft, link.name, {
            name: document.name,
            kind: document.kind,
          });
        }
      }
    }
  );

  return produce(inter, (draft) => {
    for (const document of draft) {
      document.linked = pipe(
        concat(document.linked),
        sortBy(prop('name')),
        uniqBy(prop('name'))
      )(backrefrences[document.name] ?? []);
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
