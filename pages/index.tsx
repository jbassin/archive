import crypto from 'crypto';
import Graph, { UndirectedGraph } from 'graphology';
import { random } from 'graphology-layout';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import noverlap from 'graphology-layout-noverlap';
import { Attributes, SerializedGraph } from 'graphology-types';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MutableRefObject, useEffect, useRef } from 'react';
import Sigma from 'sigma';
import Header from '../components/header';
import { urllize } from '../src/document';
import { getData } from '../src/markdown';
import { getTheme } from '../src/theme';

class HashablePair {
  readonly first: string;
  readonly second: string;

  constructor(first: string, second: string) {
    this.first = first;
    this.second = second;
  }

  hash() {
    const hash = (i: string) =>
      parseInt(
        crypto
          .createHash('shake256', { outputLength: 8 })
          .update(i)
          .digest('hex'),
        16
      );
    const lhs = hash(this.first);
    const rhs = hash(this.second);
    return lhs + rhs;
  }
}

class PairSet {
  private set: { [hash: number]: HashablePair };

  constructor() {
    this.set = {};
  }

  add(pair: HashablePair) {
    this.set[pair.hash()] = pair;
  }

  to_list(): [string, string][] {
    return Object.values(this.set).map((pair: HashablePair) => [
      pair.first,
      pair.second,
    ]);
  }
}

type Node = {
  id: string;
  links: {
    kind: string;
    name: string;
  }[];
  color: string;
  kind: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
};

function color(kind: string) {
  switch (kind.toLocaleLowerCase()) {
    case 'ancestry':
      return '#9e0142';
    case 'creature':
      return '#d53e4f';
    case 'divinity':
      return '#f46d43';
    case 'location':
      return '#fdae61';
    case 'material':
      return '#fee08b';
    case 'natural phenomena':
      return '#e6f598';
    case 'organization':
      return '#abdda4';
    case 'people':
      return '#66c2a5';
    case 'realm':
      return '#3288bd';
    case 'technology':
      return '#5e4fa2';
    default:
      return '#999';
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const documents = await getData();

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const set = new PairSet();
  for (const document of documents) {
    nodes.push({
      id: document.name,
      links: document.linked,
      color: color(document.kind),
      kind: document.kind,
    });
    for (const path of document.linked) {
      set.add(new HashablePair(document.name, path.name));
    }

    // set.add(new HashablePair(document.name, document.))
  }

  for (const [first, second] of set.to_list()) {
    edges.push({
      id: `${first}->${second}`,
      source: first,
      target: second,
    });
  }

  const graph = new Graph({ type: 'undirected' });

  for (const node of nodes) {
    graph.addNode(node.id, {
      label: node.id,
      size: 3 + node.links.length,
      color: node.color,
      originalColor: node.color,
      docKind: node.kind,
    });
  }

  for (const edge of edges) {
    graph.addEdge(edge.source, edge.target);
  }

  random.assign(graph);

  const settings = forceAtlas2.inferSettings(graph);
  forceAtlas2.assign(graph, { iterations: 100, settings });

  noverlap.assign(graph, 100);

  const serGraph = graph.export();

  return {
    props: { serGraph },
  };
};

const Index: NextPage<{
  serGraph: SerializedGraph<Attributes, Attributes, Attributes>;
}> = ({ serGraph }) => {
  const router = useRouter();
  const theme = getTheme(null);
  const ref: MutableRefObject<Graph<
    Attributes,
    Attributes,
    Attributes
  > | null> = useRef(null);

  useEffect(() => {
    if (ref.current !== null) return;

    const container = document.getElementById('graph');
    if (!container) return;

    ref.current = UndirectedGraph.from(serGraph);
    const renderer = new Sigma(ref.current, container);

    renderer.on('enterNode', ({ node }) => {
      if (!ref.current) return;

      ref.current.forEachNode((n) => {
        if (!ref.current) return;

        ref.current.setNodeAttribute(n, 'color', '#999');
      });

      ref.current.forEachNeighbor(node, (n) => {
        if (!ref.current) return;

        ref.current.setNodeAttribute(
          n,
          'color',
          ref.current.getNodeAttribute(n, 'originalColor')
        );
      });

      ref.current.setNodeAttribute(
        node,
        'color',
        ref.current.getNodeAttribute(node, 'originalColor')
      );
    });

    renderer.on('leaveNode', ({}) => {
      if (!ref.current) return;

      ref.current.forEachNode((n) => {
        if (!ref.current) return;

        ref.current.setNodeAttribute(
          n,
          'color',
          ref.current.getNodeAttribute(n, 'originalColor')
        );
      });
    });

    renderer.on('clickNode', ({ node }) => {
      if (!ref.current) return;

      const attr = (a: string) => {
        if (!ref.current) return;

        return ref.current.getNodeAttribute(node, a);
      };

      router.push(`/${urllize(attr('docKind'))}/${urllize(attr('label'))}`);
    });
  }, [serGraph, router]);

  return (
    <>
      <Head>
        <title>The Archive</title>
      </Head>
      <div className="container mx-auto mt-6 px-3">
        <Header theme={theme} />
        <div className="mt-4">
          <div id="graph" style={{ height: '78vh' }} />
        </div>
      </div>
    </>
  );
};

export default Index;
