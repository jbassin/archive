import { Index, Query } from 'lunr';
import useSWR from 'swr';
import { uuid } from '../src/app';
import { useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { urllize } from '../src/document';

export default function Search({ className }: { className: string }) {
  const { data: index } = useSWR(`/index.json?uuid=${uuid}`, async (url) => {
    const data = await fetch(url);
    const json = await data.json();
    return Index.load(json);
  });

  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const search = !!index
    ? index.query(function () {
        this.term(query, {
          wildcard: Query.wildcard.LEADING | Query.wildcard.TRAILING,
        });
      })
    : [];

  return (
    <div className={className}>
      <Combobox
        value={selected}
        onChange={(select: Index.Result | null) => {
          if (select == null) return setSelected(select);
          const [kind, name] = select.ref.split('/');
          router.push(`/${urllize(kind)}/${urllize(name)}`);
        }}
        nullable
      >
        <div className="relative mt-1 font-gelasio">
          <div className="relative w-full cursor-default overflow-hidden bg-white rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-crimson-500 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:ring-crimson-500"
              displayValue={(res: Index.Result) => res?.ref.split('/')[1]}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FontAwesomeIcon
                icon={faSearch}
                className="h-5 w-5 text-crimson-500"
              />
            </Combobox.Button>
          </div>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {search.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                search.map((res) => (
                  <Combobox.Option
                    key={res.ref}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 ${
                        active ? 'bg-crimson-500 text-white' : 'text-gray-900'
                      }`
                    }
                    value={res}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {res.ref.split('/')[1]}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-crimson-500'
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="h-5 w-5"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
