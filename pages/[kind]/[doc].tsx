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
import Head from 'next/head';
import { AlthaneDate } from '../../src/config';
import { getTheme, Theme } from '../../src/theme';
import Path from '../../components/path';
import Header from '../../components/header';
import Flag from '../../components/flag';
import { useState } from 'react';
import { Transition } from '@headlessui/react';

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

function transform(theme: Theme) {
  function transform(node: HTMLElement, children: Node[]): React.ReactNode {
    if (node.tagName === 'h3') {
      return (
        <h1 className={`${theme.text.primary} ${theme.font.subtitle} text-md`}>
          {children}
        </h1>
      );
    }

    if (node.tagName === 'ol') {
      return <ol className="list-decimal list-inside">{children}</ol>;
    }

    if (node.tagName === 'ul') {
      return <ul className="list-disc list-inside">{children}</ul>;
    }

    if (node.tagName === 'p') {
      return <p className={`${theme.font.main} mb-2`}>{children}</p>;
    }

    if (node.tagName === 'a') {
      return (
        <Path
          href={node.getAttribute('href') ?? ''}
          contents={children}
          theme={theme}
        />
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

    if (node.tagName === 'code') {
      return (
        <code className={`${theme.font.alt} text-sm small-caps`}>
          {children}
        </code>
      );
    }
  }

  return transform;
}

function subheading(kind: string) {
  switch (kind.toLocaleLowerCase()) {
    case 'ancestry':
      return 'know your roots';
    case 'creature':
      return 'goes bump in the night';
    case 'divinity':
      return 'knowledge of the gods';
    case 'location':
      return 'worldly insight';
    case 'log':
      return 'a daily chronicle';
    case 'material':
      return 'fundamental building blocks';
    case 'natural phenomena':
      return 'by universal decree';
    case 'organization':
      return 'groups of import';
    case 'people':
      return 'sensing motives';
    case 'realm':
      return 'celestial bodies';
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
  const theme = getTheme(document.config.theme);
  const [toggleFlag, setToggleFlag] = useState(false);

  return (
    <>
      <Head>
        <title>
          The Archive •{' '}
          {!!document.config.dsp ? document.config.dsp : document.name}
        </title>
      </Head>
      <div className="container mx-auto mt-6 px-3">
        <Header theme={theme} subheading={subheading(document.kind)} />
        <div className="mt-4 flex flex-row">
          <div className="hidden md:block md:basis-1/5 lg:basis-1/6">
            <Tree
              tree={tree}
              kind={document.kind}
              selected={
                !!document.config.dsp ? document.config.dsp : document.name
              }
              theme={theme}
            />
          </div>
          <div className="md:basis-4/5 lg:basis-5/6">
            <div className="inline-block flex flex-col">
              <div
                className={`${theme.text.primary} ${theme.font.title} flex flex-row text-xl`}
              >
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
                      <span
                        className={`${theme.font.alt} text-base text-sm self-center`}
                      >
                        {date.day} {date.ppMonth()} {date.year} C{date.cycle}
                      </span>
                    );
                  }
                })()}
              </div>
              {!!document.config.news ? (
                <span
                  className={`${theme.text.soft} ${theme.font.main} text-sm pl-2 mb-3 mt-[-0.3rem]`}
                >
                  reporting by {document.config.news.author}, for the{' '}
                  {document.config.news.paper}
                </span>
              ) : null}
            </div>
            {!!document.config.flag ? (
              <Flag
                flag={document.config.flag}
                theme={theme}
                toggleEvent={setToggleFlag}
              />
            ) : null}
            <Transition
              show={!document.config.flag || toggleFlag || false}
              enter="transform transition ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transform duration-200 transition ease-in"
              leaveFrom="opacity-100 scale-100 "
              leaveTo="opacity-0 scale-95"
            >
              <div className="flex flex-row">
                <div className="lg:basis-5/6">
                  {renderDoc(document).map((section, idx) => {
                    switch (section.columns) {
                      case 1: {
                        return (
                          <Interweave
                            key={idx}
                            content={section.section}
                            transform={transform(theme)}
                          />
                        );
                      }
                      case 2: {
                        return (
                          <div key={idx} className="flex flex-row">
                            <div className="basis-1/2 pr-2">
                              <Interweave
                                content={section.lhs}
                                transform={transform(theme)}
                              />
                            </div>
                            <div className="basis-1/2 pl-2">
                              <Interweave
                                content={section.rhs}
                                transform={transform(theme)}
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
                  <span
                    className={`${theme.font.main} small-caps text-sm mr-1 mt-2`}
                  >
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
                            <span
                              className={`${theme.font.main} small-caps text-sm mr-1`}
                            >
                              {key.toLocaleLowerCase()}
                            </span>
                            {map(
                              (doc) => (
                                <Path
                                  key={doc.name}
                                  href={`/${urllize(doc.kind)}/${urllize(
                                    doc.name
                                  )}`}
                                  contents={doc.name}
                                  theme={theme}
                                  className="small-caps mr-1 text-sm"
                                />
                              ),
                              docs
                            )}
                          </div>
                        );
                      }
                    )
                  )(document.linked)}
                </>
              ) : null}
            </Transition>
          </div>
        </div>
      </div>
      {document.name === 'The First House' ? (
        <div className="absolute top-20 md:top-32 left-0 opacity-25 flex w-full h-full justify-center -z-50">
          <img
            className="absolute"
            src="/eye.webp"
            alt="NOCTIS SEES ALL. NOCTIS SEES YOU"
          />
        </div>
      ) : null}
    </>
  );
};

export default Doc;
