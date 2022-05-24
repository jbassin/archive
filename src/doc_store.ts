import produce from 'immer';
import {
  chain,
  concat,
  find,
  map,
  pipe,
  prop,
  replace,
  sortBy,
  uniqBy,
} from 'ramda';
import { Config } from './config';
import { Document, Section, urllize } from './document';

import md from 'markdown-it';
import { WritableDraft } from 'immer/dist/internal';

export type FinalizedDocument = {
  id: string;
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
          ...(!!document.config.dsp ? [[document.config.dsp, document]] : []),
          ...map((x: string) => [x, document], document.config.refs),
        ] as [string, Document][]
    ),
    map(
      ([str, document]) =>
        [
          new RegExp(`(?<!%\\()(?<!%)(?<=\\b)${str}(?:'?e?s)?(?=\\b)`, 'i'),
          document,
        ] as [RegExp, Document]
    )
  )(documents);

  const inter = produce(documents as FinalizedDocument[], (documentDraft) => {
    for (const document of documentDraft) {
      document.id = `${document.kind}/${document.name}`;
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

      const replacer = pipe(
        replace(/%(\w+)/g, '$1'),
        replace(/%\((\w+)\)/g, '$1')
      );

      for (let idx = 0; idx < document.text.length; idx++) {
        const section = document.text[idx];
        switch (section.columns) {
          case 1: {
            section.section = replacer(section.section);
            break;
          }
          case 2: {
            section.lhs = replacer(section.lhs);
            section.rhs = replacer(section.rhs);
            break;
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
  // eslint-disable-next-line @typescript-eslint/no-var-requires
}).use(require('markdown-it-deflist'));

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
