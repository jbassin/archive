import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleRight,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { urllize } from '../src/document';
import { useLocalStorage } from '../src/local_storage';
import { DocumentHierarchy } from '../src/markdown';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { map, pipe, sortBy } from 'ramda';
import { AlthaneDate } from '../src/config';

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
        <FontAwesomeIcon className="mr-1 w-[12px]" icon={faMinus} />
      )}
      <span>
        {tree.kind === 'branch' ? (
          <span className="small-caps font-semibold font-roboto">
            {tree.name}
          </span>
        ) : (
          <Link href={`/${urllize(tree.kind)}/${urllize(tree.name)}`}>
            <a
              className={[
                'small-caps font-roboto',
                selected === tree.name
                  ? 'text-background-400 bg-crimson-500 rounded px-0.5'
                  : 'text-crimson-500',
              ].join(' ')}
            >
              {tree.name}
            </a>
          </Link>
        )}
      </span>
      <br />
      <Transition
        show={!!toggled}
        enter="transform transition ease-in duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-95"
      >
        <>
          {pipe(
            sortBy<DocumentHierarchy>((doc) =>
              doc.date ? new AlthaneDate(doc.date).compareKey() : doc.name
            ),
            map((tree: DocumentHierarchy) => (
              <Tree
                key={tree.name}
                tree={tree}
                level={curLevel + 1}
                kind={kind}
                selected={selected}
              />
            ))
          )(tree.children)}
        </>
      </Transition>
    </div>
  );
}
