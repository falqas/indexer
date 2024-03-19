import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

interface Index {
  [key: string]: string[]; // For simplicity's sake we are storing the file paths as strings, although a hashing algo might make more sense
}

// Step 1: Read files recursively and process them
const processDirectory = async (directory: string, index: Index) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath, index);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      processFile(content, fullPath, index);
    }
  }
};

// Step 2: Normalize text and create the index
const processFile = (
  content: string,
  filePath: string,
  index: Index
) => {
  const normalizedContent = content.toLowerCase();
  const words = normalizedContent.match(/\b(\w+)\b/g) || [];
  for (let word of words) {
    if (!index[word]) {
      // TODO Out of scope, but we could also store the line number of the word for highlighting
      index[word] = [filePath];
    } else if (!index[word].includes(filePath)) {
      // TODO use Set here to avoid duplicates & for faster lookups
      index[word].push(filePath);
    }
  }
};

const writeFileAsync = promisify(fs.writeFile);
const saveIndexToFile = async (index: Index, filePath: string) => {
  try {
    // Convert the index object to a JSON string
    const data = JSON.stringify(index, null, 2);
    // Write the JSON string to a file
    await writeFileAsync(filePath, data, 'utf-8');
  } catch (error) {
    console.error('Error saving index to file:', error);
  }
};

// Main function to kickstart the indexing process
const main = async () => {
  const rootDirectory = 'corpus';
  let index: Index = {};
  await processDirectory(rootDirectory, index);
  await saveIndexToFile(index, 'indices/index.json');
};

main()
  .then(() => console.log('Indexing completed'))
  .catch(console.error);
