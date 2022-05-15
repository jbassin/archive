import { readdir, readFile, stat } from 'fs/promises';
import * as root from 'app-root-path';
import { parseDocument, Document } from './document';
import { FinalizedDocument, linkDocuments } from './doc_store';
import produce, { current } from 'immer';

async function allFiles(directory: string): Promise<Document[]> {
  let files: Document[] = [];
  const filesInDirectory = await readdir(directory);

  for (const file of filesInDirectory) {
    const filepath = directory + '/' + file;
    const fd = await stat(filepath);
    if (fd.isDirectory()) {
      files = files.concat(await allFiles(filepath));
    } else if (fd.isFile()) {
      const file = await readFile(filepath, { encoding: 'utf8' });
      files.push(parseDocument(filepath, file));
    }
  }

  return files;
}

let data: FinalizedDocument[] = [];
export async function getData() {
  if (data.length === 0) {
    const inter = await allFiles(root + '/data');
    data = linkDocuments(inter);
  }
  return data;
}

type DocumentTree =
  | { kind: 'leaf'; node: { name: string; kind: string } }
  | { kind: 'branch'; name: string; children: DocumentTree[] };

export type DocumentHierarchy = {
  name: string;
  kind: string;
  children: DocumentHierarchy[];
};

function getInternalTree(level: number, nodes: FinalizedDocument[]) {
  const inter = produce(
    { nodes: [], children: {} } as {
      nodes: FinalizedDocument[];
      children: Record<string, FinalizedDocument[]>;
    },
    (draft) => {
      for (const node of nodes) {
        if (level < node.path.length) {
          const step = node.path[level];

          if (current(draft).children[step]) {
            draft.children[step].push(node);
          } else {
            draft.children[step] = [node];
          }
        } else {
          draft.nodes.push(node);
        }
      }
    }
  );

  return produce([] as DocumentTree[], (draft) => {
    for (const node of inter.nodes) {
      draft.push({ kind: 'leaf', node: { name: node.name, kind: node.kind } });
    }

    for (const key in inter.children) {
      const nodes = inter.children[key];
      draft.push({
        kind: 'branch',
        name: key,
        children: getInternalTree(level + 1, nodes),
      });
    }
  });
}

function normalizeTree(tree: DocumentTree) {
  switch (tree.kind) {
    case 'leaf': {
      return { ...tree.node, children: [] };
    }

    case 'branch': {
      return produce(
        { name: tree.name, kind: tree.kind, children: [] } as DocumentHierarchy,
        (draft) => {
          for (const curNode of tree.children) {
            switch (curNode.kind) {
              case 'branch': {
                draft.children.push(normalizeTree(curNode));
                break;
              }

              case 'leaf': {
                draft.name = curNode.node.name;
                draft.kind = curNode.node.kind;
              }
            }
          }
        }
      );
    }
  }
}

let tree: DocumentHierarchy | null = null;
export async function getTree() {
  if (tree === null) {
    const data = await getData();
    tree = normalizeTree({
      kind: 'branch',
      name: 'root',
      children: getInternalTree(0, data),
    });
  }
  return tree;
}
