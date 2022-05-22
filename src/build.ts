import { writeFile } from 'fs/promises';
import { buildIndex } from './search';
import root from 'app-root-path';

(async () => {
  const index = JSON.stringify(await buildIndex());
  await writeFile(root + '/public/index.json', index);
})()
  .then()
  .catch();
