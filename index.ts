import express from 'express';
import path from 'path';
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

app.use(express.json());

const INDICES_PATH = './indices';

// Function to search within a single partition
const searchPartition = async (partition: string, query: string) => {
  try {
    const filePath = path.join(INDICES_PATH, `${partition}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const index = JSON.parse(data);

    // Simple search logic: find all entries where the query matches the beginning of the word
    const results = Object.entries(index)
      .filter(([word, _]) => word.startsWith(query))
      .flatMap(([_, filePaths]) => filePaths);
    return results;
  } catch (error) {
    console.error(`Error searching partition ${partition}:`, error);
    return [];
  }
};

const getPartitionKey = (query: string) => query[0].toLowerCase();

// API endpoint for searching
app.get(
  '/search',
  async (req: express.Request, res: express.Response) => {
    const query: string = req.query.q as string;
    if (!query) {
      return res.status(400).send({ error: 'Query is required' });
    }
    const partitionKey = getPartitionKey(query);
    const results = await searchPartition(partitionKey, query);

    res.send({ query, results });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    'For a sample query try visiting http://localhost:3000/search?q=app'
  );
  console.log(
    'Note: ensure the indices are generated before running the server'
  );
});
