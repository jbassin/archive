import { urllize } from '../src/document';
import { DocumentHierarchy } from '../src/markdown';

function color(idx: number) {
  return ['#CA9703', '#D5AD36', '#4488BF', '#265999'][idx % 4];
}

export default function Tree({
  tree,
  level,
  selected,
}: {
  tree: DocumentHierarchy;
  level?: number;
  selected: string;
}) {
  const curLevel = level ?? 0;

  if (tree.name === 'root') {
    return (
      <div>
        {tree.children.map((tree) => (
          <Tree
            key={tree.name}
            tree={tree}
            level={curLevel}
            selected={selected}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="border-l pl-1" style={{ borderColor: color(curLevel) }}>
      <span>
        {tree.kind === 'branch' ? (
          <span className="small-caps font-semibold font-roboto">
            {tree.name}
          </span>
        ) : (
          <a
            className={[
              'small-caps font-roboto',
              selected === tree.name
                ? 'text-background-400 bg-crimson-500 rounded px-0.5'
                : 'text-crimson-500',
            ].join(' ')}
            href={`/${urllize(tree.kind)}/${urllize(tree.name)}`}
          >
            {tree.name}
          </a>
        )}
      </span>
      <br />
      {tree.children.map((tree) => (
        <Tree
          key={tree.name}
          tree={tree}
          level={curLevel + 1}
          selected={selected}
        />
      ))}
    </div>
  );
}
