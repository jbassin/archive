import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { DocumentHierarchy, getData, getTree } from '../../src/markdown';
import { Document, urllize } from '../../src/document';
import { filter, head, pipe, reduce } from 'ramda';
import produce from 'immer';
import { FinalizedDocument, renderDoc } from '../../src/doc_store';
import { Interweave, Node } from 'interweave';
import { polyfill } from 'interweave-ssr';
import Tree from '../../components/tree';

polyfill();

export const getStaticPaths: GetStaticPaths = async () => {
  const documents = await getData();

  return reduce(
    produce((draft, doc) => {
      draft.paths.push({
        params: {
          kind: urllize(doc.kind),
          doc: urllize(doc.name),
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
    filter((x: Document) => urllize(x.name) === params?.doc),
    head
  )(documents);

  const tree = await getTree();

  return {
    props: { document, tree },
  };
};

function transform(node: HTMLElement, children: Node[]): React.ReactNode {
  if (node.tagName === 'h2') {
    return <h1 className="text-red-500">{children}</h1>;
  }

  if (node.tagName === 'h3') {
    return <h1 className="text-8xl font-changa text-blue-500">{children}</h1>;
  }
}

const Doc: NextPage<{
  document: FinalizedDocument;
  tree: DocumentHierarchy;
}> = ({ document, tree }) => {
  return (
    <div className="container mx-auto mt-6">
      <div className="mt-6">
        <h1 className="text-2xl text-crimson-500 font-eczar">archive.</h1>
      </div>
      <div className="mt-4 flex flex-row">
        <div className="basis-1/4">
          <Tree tree={tree} />
        </div>
        <div className="basis-3/4">
          <h2>{document.name}</h2>
          <h3>{document.kind}</h3>
          <h4>{document.path}</h4>
          <Interweave content={renderDoc(document)} transform={transform} />
          {document.linked.map(({ name }) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doc;
