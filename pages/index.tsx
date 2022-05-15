import type { GetStaticProps, NextPage } from 'next';
import { getData } from '../src/markdown';
import { Document, urllize } from '../src/document';

export const getStaticProps: GetStaticProps = async () => {
  const documents = await getData();
  return {
    props: { documents },
  };
};

const Index: NextPage<{ documents: Document[] }> = ({ documents }) => {
  return (
    <div>
      <ul>
        {documents.map((doc) => (
          <li key={doc.name}>
            <a href={`/${urllize(doc.kind)}/${urllize(doc.name)}`}>
              {doc.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
