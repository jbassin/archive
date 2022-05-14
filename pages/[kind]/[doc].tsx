import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getData } from '../../src/markdown';
import { Document, urllize } from '../../src/document';
import { filter, head, pipe, reduce } from 'ramda';
import produce from 'immer';
import { FinalizedDocument, renderDoc } from '../../src/doc_store';
import { Interweave } from 'interweave';

export const getStaticPaths: GetStaticPaths = async () => {
  const documents = await getData();

  return reduce(
    produce((draft, doc) => {
      draft.paths.push({
        params: {
          kind: urllize(doc.config.kind),
          doc: urllize(doc.config.name),
        },
      });
    }),
    { paths: [], fallback: false },
    documents
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const documents = await getData();
  const document = pipe(
    filter((x: Document) => urllize(x.config.name) === params?.doc),
    head
  )(documents);
  return {
    props: { document },
  };
};

const Doc: NextPage<{ document: FinalizedDocument }> = ({ document }) => {
  return (
    <div>
      <h2>{document.config.name}</h2>
      <Interweave content={renderDoc(document)} />\
      {document.linked.map(({ name }) => (
        <span key={name}>{name}</span>
      ))}
    </div>
  );
};

export default Doc;
