"use strict"

const lexical = require('./lexical');
const sintatic = require('./sintatic');
const fs = require('fs')
const fileContents = fs.readFileSync(`src/resources/code.txt`).toString();

const tokens = lexical.analyze(fileContents);
sintatic.analyze(tokens);