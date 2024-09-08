import * as lexical from './analysis/lexical.js'
import * as syntactic from './analysis/syntactic.js'
import * as semantic from './analysis/semantic.js'

const compile = (fileContents) => {
  const tokens = lexical.analyze(fileContents);
  console.log("Lexical  analysis: ", tokens && tokens.size > 0 ? `Success` : `Failure`);

  const syntacticResult = syntactic.analyze(tokens);
  console.log("Syntactic  analysis: ", syntacticResult ? `Success` : `Failure`);

  const semanticResult = semantic.analyze(tokens);
  console.log("Semantic  analysis: ", semanticResult ? `Success` : `Failure`);
}

export { compile }