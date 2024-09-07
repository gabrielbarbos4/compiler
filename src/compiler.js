"use strict"
const fs = require('fs')
const fileContents = fs.readFileSync(`src/resources/code.txt`).toString();

const lexical = require('./lexical');
const syntactic = require('./syntactic');
const semantic = require('./semantic');

const tokens = lexical.analyze(fileContents);

const syntacticResult = syntactic.analyze(tokens);
console.log("Syntactic  analysis: ", syntacticResult ? `Success` : `Failure`);

const semanticResult = semantic.analyze(tokens);
console.log("Semantic  analysis: ", semanticResult ? `Success` : `Failure`);