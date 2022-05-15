import { urllize } from '../src/document';
import { DocumentHierarchy } from '../src/markdown';

export default function Tree({
  tree,
  level,
}: {
  tree: DocumentHierarchy;
  level?: number;
}) {
  const curLevel = level ?? 0;

  if (tree.name === 'root') {
    return (
      <>
        {tree.children.map((tree) => (
          <Tree key={tree.name} tree={tree} level={curLevel} />
        ))}
      </>
    );
  }

  return (
    <>
      <span>
        {'_'.repeat(curLevel)}
        {tree.kind === 'branch' ? (
          tree.name
        ) : (
          <a href={`/${urllize(tree.kind)}/${urllize(tree.name)}`}>
            {tree.name}
          </a>
        )}
      </span>
      <br />
      {tree.children.map((tree) => (
        <Tree key={tree.name} tree={tree} level={curLevel + 1} />
      ))}
    </>
  );
}
