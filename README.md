# Prompt

- Given a massive corpus of emails. Organize it in such a way to make it searchable.
- Searching "app" should return emails containing the words "app", "apple", or "application" (assuming case insensitive)
- Not necessary to implement autocomplete on keystroke - assume this functionality will be built at later point
  Constraints:
- Not a lot of memory, so can't store everything in RAM. Need to organize data to disk, with a low memory footprint.
- No access to internet - corpus should be offline-first (can, however, be pre-processed ahead of time)
- No third-party libraries

# Approach

1. Pre-process the text files in the corpus (starting with a subset for proof of concept)
2. Build an index out of tokenized text, e.g.:

```js
  "sponsoring": [
    "corpus/mark/3."
  ],
  "energy": [
    "corpus/mark/3.",
    "corpus/sent_items/21.",
    "corpus/sent_items/23.",
  ],
  "conference": [
    "corpus/mark/3.",
    "corpus/sent_items/31.",
  ]
```

3. Store the index to a file
4. Implement search api
5. Suggested improvements/considerations/"if I had more time"...
6. Add an init.sh script to preprocess the corpus

# Considerations

- Ideally use a db like sqlite (#TODO sample schema)
- Address uneven distribution of terms across files based on initial letter - split large indices over multiple files, based on multiple letters of a prefix (e.g. instead of e.json, have e1.json and e2.json which cover terms beginning ea-el and em-ez, like an encyclopedia might)

# Instructions:

1. git clone this repo & install dependencies (`npm install` or `yarn install`)
2. run `npm start` (or `ts-node index.ts` if you have `ts-node` installed globally)
