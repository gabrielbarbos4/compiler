import * as lexical from './analysis/lexical.js'
import * as syntactic from './analysis/syntactic.js'
import * as semantic from './analysis/semantic.js'
import * as synthesis from './synthesis/synthesis.js'

const compile = (fileContents) => {
  const tokens = lexical.analyze(fileContents);

  syntactic.analyze(tokens);
  semantic.analyze(tokens);

  console.log('\x1b[32m%s\x1b[0m', 'Process done.');
}

const executeSynthesis = (fileContent) => {
  synthesis.execute(fileContent);
}

export { compile, executeSynthesis }