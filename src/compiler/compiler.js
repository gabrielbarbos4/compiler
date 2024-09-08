import * as lexical from './analysis/lexical.js'
import * as syntactic from './analysis/syntactic.js'
import * as semantic from './analysis/semantic.js'

const compile = (fileContents) => {
  const tokens = lexical.analyze(fileContents);

  syntactic.analyze(tokens);
  semantic.analyze(tokens);

  console.log('\x1b[32m%s\x1b[0m', 'Process done.');
}

export { compile }