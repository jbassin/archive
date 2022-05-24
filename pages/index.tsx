import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { map, pipe, sort } from 'ramda';
import Search from '../components/search';
import { urllize } from '../src/document';
import { FinalizedDocument } from '../src/doc_store';
import { getData } from '../src/markdown';

export const getStaticProps: GetStaticProps = async () => {
  const documents = await getData();
  return {
    props: { documents },
  };
};

const Index: NextPage<{
  documents: FinalizedDocument[];
}> = ({ documents }) => {
  return (
    <>
      <Head>
        <title>The Archive</title>
      </Head>
      <div className="container mx-auto mt-6 px-3">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row items-center mt-6 mb-1">
            <h1 className="text-2xl text-crimson-500 font-eczar">
              archive.
              <span className="text-lg text-slate-500 font-tauri pl-2">
                the world at your fingertips
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
        <div className="mt-4 flex flex-col">
          <div className="font-gelasio mb-4">
            A collection of knowledge on Althane and otherwise. To start looking
            at logs of the campaign, you should begin by{' '}
            <Link href="/log/starting-with-a-heist">
              <a className="underline text-crimson-500">
                starting with a heist
              </a>
            </Link>
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
