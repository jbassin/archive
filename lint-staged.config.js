const escape = (x) => x.map((x) => `'${x}'`).join(' ');

module.exports = {
  '**/*.(ts|tsx)': () => 'pnpm tsc --noEmit',

  '**/*.(ts|tsx|js)': (filenames) => [
    `pnpm eslint --fix ${escape(filenames)}`,
    `pnpm prettier --write ${escape(filenames)}`,
  ],

  '**/*.(md|json)': (filenames) => `pnpm prettier --write ${escape(filenames)}`,
};
