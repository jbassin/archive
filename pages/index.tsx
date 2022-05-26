import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { map, pipe, sort } from 'ramda';
import Header from '../components/header';
import Path from '../components/path';
import { urllize } from '../src/document';
import { FinalizedDocument } from '../src/doc_store';
import { getData } from '../src/markdown';
import { getTheme } from '../src/theme';

export const getStaticProps: GetStaticProps = async () => {
  const documents = await getData();
  return {
    props: { documents },
  };
};

const Index: NextPage<{
  documents: FinalizedDocument[];
}> = ({ documents }) => {
  const theme = getTheme(null);

  return (
    <>
      <Head>
        <title>The Archive</title>
      </Head>
      <div className="container mx-auto mt-6 px-3">
        <Header theme={theme} />
        <div className="mt-4 flex flex-col">
          <div className="font-gelasio mb-4">
            A collection of knowledge on Althane and otherwise. To start looking
            at logs of the campaign, you should begin by{' '}
            <Path
              href="/log/starting-with-a-heist"
              contents="starting with a heist"
              theme={theme}
            />
            . If instead {"you're"} interested in the region where the campaign
            takes place, take a look at{' '}
            <Link href="/location/the-occident">
              <a className="underline text-crimson-500">the Occident</a>
            </Link>
            . If you want a refresher on some important npcs, you can start with{' '}
            <Link href="/people/lady-grave">
              <a className="underline text-crimson-500">Lady Grave</a>
            </Link>
            . Finally, if {"you're"} more interested in a free-form exploration,
            all currently available articles are listed below:
          </div>
          <div>
            {pipe(
              sort<FinalizedDocument>((lhs, rhs) =>
                lhs.name.localeCompare(rhs.name)
              ),
              map((document) => {
                return (
                  <span key={`${document.kind}/${document.name}`}>
                    <Link
                      href={`/${urllize(document.kind)}/${urllize(
                        document.name
                      )}`}
                    >
                      <a className="small-caps font-roboto text-crimson-500">
                        {document.name}
                      </a>
                    </Link>
                    {', '}
                  </span>
                );
              })
            )(documents)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
