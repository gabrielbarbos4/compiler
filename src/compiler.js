const lexical = require('./lexical');
const fs = require('fs')
const fileContents = fs.readFileSync(`src/resources/code.txt`).toString();

lexical.analyze(fileContents);
