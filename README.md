# Prompt

- Given a massive corpus of emails. Organize it in such a way to make it searchable.
- Searching "app" should return emails containing the words "app", "apple", or "application" (assuming case insensitive)
- Not necessary to implement autocomplete on keystroke - assume this functionality will be built at later point
  Constraints:
- Not a lot of memory, so can't store everything in RAM. Need to organize data to disk, with a low memory footprint.
- No access to internet - corpus should be offline-first (can, however, be pre-processed ahead of time)
- No third-party libraries

# Approach

1. Pre-process the text files in the corpus, and build an index

- TypeScript

# Instructions:

1. git clone this repo & install dependencies (`npm install` or `yarn install`)
2. run `npm start` (or `ts-node index.ts` if you have `ts-node` installed globally)
