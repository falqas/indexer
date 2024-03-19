import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

interface Index {
  [key: string]: string[]; // For simplicity's sake we are storing the file paths as strings, although a hashing algo might make more sense
}

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Step 1: Read files recursively and process them
const processDirectory = async (
  directory: string,
  indexes: Map<string, Index>
) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath, indexes);
    } else if (entry.isFile()) {
      const content = await readFileAsync(fullPath, 'utf-8');
      processFile(content, fullPath, indexes);
    }
  }
};

// Step 2: Normalize text and create the index
const processFile = (
  content: string,
  filePath: string,
  indices: Map<string, Index>
) => {
  const normalizedContent = content.toLowerCase();
  const words = normalizedContent.match(/\b(\w+)\b/g) || [];
  for (let word of words) {
    const prefix = word[0]; // First letter of the word
    if (!indices.has(prefix)) {
      indices.set(prefix, {});
    }
    let index = indices.get(prefix);
    if (index && !index[word]) {
      index[word] = [filePath];
    } else if (index && !index[word].includes(filePath)) {
      index[word].push(filePath);
    }
  }
};

const saveIndicesToFiles = async (
  indexes: Map<string, Index>,
  basePath: string
) => {
  for (const [prefix, index] of indexes) {
    const filePath = path.join(basePath, `${prefix}.json`);
    try {
      const data = JSON.stringify(index, null, 2);
      await writeFileAsync(filePath, data, 'utf-8');
      console.log(
        `Index for '${prefix}' successfully written to ${filePath}`
      );
    } catch (error) {
      console.error(
        `Error saving index for '${prefix}' to file:`,
        error
      );
    }
  }
};

// Main function to kickstart the indexing process
const main = async () => {
  const rootDirectory = 'corpus';
  let indices: Map<string, Index> = new Map();
  await processDirectory(rootDirectory, indices);
  await saveIndicesToFiles(indices, './indices');
  console.log('Indexing completed');
};

main()
  .then(() => console.log('Indexing completed'))
  .catch(console.error);
