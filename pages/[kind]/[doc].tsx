import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { DocumentHierarchy, getData, getTree } from '../../src/markdown';
import { Document, urllize } from '../../src/document';
import {
  filter,
  groupBy,
  head,
  map,
  pipe,
  prop,
  reduce,
  sortBy,
  toPairs,
} from 'ramda';
import produce from 'immer';
import { FinalizedDocument, renderDoc } from '../../src/doc_store';
import { Interweave, Node } from 'interweave';
import { polyfill } from 'interweave-ssr';
import Tree from '../../components/tree';
import Search from '../../components/search';
import Link from 'next/link';
import Head from 'next/head';
import { AlthaneDate } from '../../src/config';

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

function getPath(
  tree: DocumentHierarchy,
  kind: string,
  name: string
): { kind: string; name: string }[] {
  if (urllize(tree.kind) === kind && urllize(tree.name) === name)
    return [{ kind: urllize(tree.kind), name: urllize(tree.name) }];

  for (const child of tree.children) {
    const path = getPath(child, kind, name);
    if (path.length > 0)
      return [{ kind: urllize(tree.kind), name: urllize(tree.name) }, ...path];
  }

  return [];
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const documents = await getData();
  const document = pipe(
    filter((x: Document) => urllize(x.name) === params?.doc),
    head
  )(documents);

  const tree = await getTree();
  const path = getPath(tree, params?.kind as string, params?.doc as string);

  return {
    props: { document, tree, path },
  };
};

function transform(node: HTMLElement, children: Node[]): React.ReactNode {
  if (node.tagName === 'h3') {
    return <h1 className="text-md font-tauri text-crimson-500">{children}</h1>;
  }

  if (node.tagName === 'ol') {
    return <ol className="list-decimal list-inside">{children}</ol>;
  }

  if (node.tagName === 'ul') {
    return <ul className="list-disc list-inside">{children}</ul>;
  }

  if (node.tagName === 'p') {
    return <p className="font-gelasio mb-2">{children}</p>;
  }

  if (node.tagName === 'a') {
    return (
      <Link href={node.getAttribute('href') ?? ''}>
        <a className="font-gelasio text-crimson-500 underline decoration-solid visited:decoration-double">
          {children}
        </a>
      </Link>
    );
  }

  if (node.tagName === 'dl') {
    return <div>{children}</div>;
  }

  if (node.tagName === 'dt') {
    return <span className="font-black small-caps">{children}</span>;
  }

  if (node.tagName === 'dd') {
    return (
      <>
        <span>{children}</span>
        <div className="mb-0.5" />
      </>
    );
  }

  if (node.tagName === 'img') {
    return (
      <img
        src={node.getAttribute('src') ?? ''}
        alt={node.getAttribute('alt') ?? ''}
      />
    );
  }
}

function subheading(kind: string) {
  switch (kind.toLocaleLowerCase()) {
    case 'ancestry':
      return 'know your roots';
    case 'divinity':
      return 'knowledge of the gods';
    case 'material':
      return 'fundamental building blocks';
    case 'natural phenomena':
      return 'by universal decree';
    case 'people':
      return 'sensing motives';
    case 'region':
      return 'worldly insight';
    case 'technology':
      return 'unyielding progress';
    default:
      return 'repository of knowledge';
  }
}

const Doc: NextPage<{
  document: FinalizedDocument;
  tree: DocumentHierarchy;
  path: { kind: string; name: string }[];
}> = ({ document, tree }) => {
  return (
    <>
      <Head>
        <title>
          The Archive •{' '}
          {!!document.config.dsp ? document.config.dsp : document.name}
        </title>
      </Head>
      <div className="container mx-auto mt-6 px-3">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row items-center mt-6 mb-1">
            <h1 className="text-2xl text-crimson-500 font-eczar">
              archive.
              <span className="text-lg text-slate-500 font-tauri pl-2">
                {subheading(document.kind)}
              </span>
            </h1>
            <div className="flex-grow" />
            <Search className="z-10 w-full md:w-2/5" />
          </div>
          <div className="hidden md:block relative h-32 overflow-hidden rounded">
            <img
              src="https://i.imgur.com/OpyUXz1.png"
              alt=""
              className="absolute w-full"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-row">
          <div className="hidden md:block md:basis-1/5 lg:basis-1/6">
            <Tree
              tree={tree}
              kind={document.kind}
              selected={
                !!document.config.dsp ? document.config.dsp : document.name
              }
            />
          </div>
          <div className="md:basis-4/5 lg:basis-5/6">
            <div className="inline-block flex flex-col">
              <div className="flex flex-row font-eczar text-xl text-crimson-500">
                <div className="inline-block mr-2">
                  {!!document.config.dsp ? document.config.dsp : document.name}
                </div>
                {document.config.ipa ? (
                  <span className="text-base small-caps self-center">
                    ({document.config.ipa})
                  </span>
                ) : null}
                {(() => {
                  if (document.config.date) {
                    const date = new AlthaneDate(document.config.date);

                    return (
                      <span className="text-base text-sm font-roboto self-center">
                        {date.day} {date.ppMonth()} {date.year} C{date.cycle}
                      </span>
                    );
                  }
                })()}
              </div>
              {!!document.config.news ? (
                <span className="font-gelasio pl-2 text-gray-800 text-sm mt-[-0.3rem] mb-3">
                  reporting by {document.config.news.author}, for the{' '}
                  {document.config.news.paper}
                </span>
              ) : null}
            </div>
            <div className="flex flex-row">
              <div className="lg:basis-5/6 font-gelasio">
                {renderDoc(document).map((section, idx) => {
                  switch (section.columns) {
                    case 1: {
                      return (
                        <Interweave
                          key={idx}
                          content={section.section}
                          transform={transform}
                        />
                      );
                    }
                    case 2: {
                      return (
                        <div key={idx} className="flex flex-row">
                          <div className="basis-1/2 font-gelasio pr-2">
                            <Interweave
                              content={section.lhs}
                              transform={transform}
                            />
                          </div>
                          <div className="basis-1/2 font-gelasio pl-2">
                            <Interweave
                              content={section.rhs}
                              transform={transform}
                            />
                          </div>
                        </div>
                      );
                    }
                  }
                })}
              </div>
            </div>
            {document.linked.filter(({ name }) => name !== '').length > 0 ? (
              <>
                <span className="font-gelasio mr-1 mt-2 small-caps text-sm">
                  Linked documents:
                </span>
                {pipe(
                  filter<{
                    kind: string;
                    name: string;
                  }>(({ name }) => name !== ''),
                  groupBy(prop('kind')),
                  toPairs,
                  sortBy(
                    ([key]: [string, { kind: string; name: string }[]]) => key
                  ),
                  map(
                    ([key, docs]: [
                      string,
                      Array<{
                        kind: string;
                        name: string;
                      }>
                    ]) => {
                      return (
                        <div className="ml-2" key={key}>
                          <span className="font-gelasio small-caps text-sm mr-1">
                            {key.toLocaleLowerCase()}
                          </span>
                          {map(
                            (doc) => (
                              <a
                                key={doc.name}
                                className="font-gelasio text-crimson-500 underline decoration-solid visited:decoration-double mr-1 small-caps text-sm"
                                href={`/${urllize(doc.kind)}/${urllize(
                                  doc.name
                                )}`}
                              >
                                {doc.name}
                              </a>
                            ),
                            docs
                          )}
                        </div>
                      );
                    }
                  )
                )(document.linked)}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Doc;
