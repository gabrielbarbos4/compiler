"use strict"
const fs = require('fs')
const fileContents = fs.readFileSync(`src/resources/code.txt`).toString();

const lexical = require('./lexical');
const sintatic = require('./sintatic');
const semantic = require('./semantic');

const tokens = lexical.analyze(fileContents);
console.log(tokens);

const sintaticResult = sintatic.analyze(tokens);
console.log(sintaticResult);

const semanticResult = semantic.analyze(tokens);
console.log(semanticResult)