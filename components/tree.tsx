import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { urllize } from '../src/document';
import { useLocalStorage } from '../src/local_storage';
import { DocumentHierarchy } from '../src/markdown';

function color(idx: number) {
  return ['#CA9703', '#D5AD36', '#4488BF', '#265999'][idx % 4];
}

function inSelection(tree: DocumentHierarchy, kind: string, name: string) {
  if (tree.name === name && tree.kind === kind) return true;

  for (const child of tree.children) {
    if (inSelection(child, kind, name)) return true;
  }

  return false;
}

export default function Tree({
  tree,
  level,
  kind,
  selected,
}: {
  tree: DocumentHierarchy;
  level?: number;
  kind: string;
  selected: string;
}) {
  const pathInSelection = inSelection(tree, kind, selected);
  const curLevel = level ?? 0;
  const [localToggled, setToggled] = useLocalStorage(
    `tree/${tree.kind}/${tree.name}`,
    false
  );
  const toggled = pathInSelection || localToggled;

  if (tree.name === 'root') {
    return (
      <div className="select-none">
        {tree.children.map((tree) => (
          <Tree
            key={tree.name}
            tree={tree}
            level={curLevel}
            kind={kind}
            selected={selected}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="border-l pl-1 select-none"
      style={{ borderColor: color(curLevel) }}
    >
      {tree.children.length > 0 && !pathInSelection ? (
        <FontAwesomeIcon
          className="mr-1 w-[12px] cursor-pointer"
          onClick={() => setToggled(!toggled)}
          icon={toggled ? faAngleDown : faAngleRight}
        />
      ) : (
        <></>
      )}
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
      {toggled ? (
        tree.children.map((tree) => (
          <Tree
            key={tree.name}
            tree={tree}
            level={curLevel + 1}
            kind={kind}
            selected={selected}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
