import { readdir, readFile, stat } from 'fs/promises';
import * as root from 'app-root-path';
import { parseDocument, Document } from './document';

// const markdown = md({
//   html: true,
//   linkify: true,
//   typographer: true,
// })
//   .use(mdcontainer)
//   .use(mdtable);

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
      files.push(parseDocument(file));
    }
  }

  return files;
}

let data: Document[] = [];
export async function getData() {
  if (data.length === 0) data = await allFiles(root + '/data');
  return data;
}
