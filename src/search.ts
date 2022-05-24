/* eslint-disable @typescript-eslint/no-unused-vars */
import { getData } from './markdown';
import lunr, { Index } from 'lunr';
import { FinalizedDocument } from './doc_store';
import produce from 'immer';
import { concat, join, map, pipe, prop } from 'ramda';
import { Section } from './document';

export async function buildIndex(): Promise<Index> {
  const documents = await getData();

  const index = lunr(function () {
    this.ref('id');
    this.field('name', {
      boost: 10,
      extractor: (_doc: object) => {
        const doc = _doc as FinalizedDocument;
        return !!doc.config.dsp ? doc.config.dsp : doc.name;
      },
    });
    this.field('text', {
      extractor: (doc: object) => {
        return pipe(
          prop('text') as (_: FinalizedDocument) => Section[],
          map((section: Section) => {
            switch (section.columns) {
              case 1: {
                return section.section;
              }
              case 2: {
                return `${section.lhs} ${section.rhs}`;
              }
            }
          }),
          join(' ')
        )(doc as FinalizedDocument);
      },
    });

    for (const document of documents) {
      this.add(document);
    }
  });

  return index;
}
