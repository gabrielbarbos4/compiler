"use strict"

const analyze = (tokens) => {
  const tokensArray = Array.from(tokens);
  let currentIndex = 0;

  if(tokensArray[tokensArray.length - 1].value !== "end")
    throw new Error("Último token não é 'end'");

  if(!isType(tokensArray[currentIndex], 'integer'))
    throw new Error("Primeira Linha nao iniciada com digito");

  currentIndex++;

  while(currentIndex !== tokensArray.length - 1) {
    const actualToken = tokensArray[currentIndex];

    if(tokensArray[currentIndex].value === "\n" && !isType(tokensArray[currentIndex + 1], 'integer'))
      throw new Error("Linha nao iniciada com digito");

    if(isType(actualToken, 'integer')) {
      currentIndex++;
    }

    switch(actualToken.value) {
      case "\n":
        currentIndex++;
        break;
      case "rem":
        currentIndex++;
        break;
      case "input": {
        if(!isType(tokensArray[++currentIndex], 'variable'))
          throw new Error("token nao e variavel a frente do input");
        currentIndex++;
        break;
      }
      case "let": {
        let nextToken = tokensArray[++currentIndex]

        if(!isType(nextToken, 'variable'))
          throw new Error("Token nao e uma variavel apos o let");

        nextToken = tokensArray[++currentIndex];

        if(nextToken.value !== "=")
          throw new Error("Token não é um '=' após a variável");

        let pairAuxArray = [];

        while(nextToken.value !== "\n") {
          pairAuxArray.push(nextToken);

          currentIndex++;
          nextToken = tokensArray[currentIndex];
        }

        for(let i = 0; i < pairAuxArray.length; i += 2) {
          if(pairAuxArray[i + 1].value === "-") {
            if(pairAuxArray[i + 2].value !== "1")
              throw new Error("Pilha de tokens invalida para operacao let com operador negativo")

            i++;
          } else {
            const isOperator = isType(pairAuxArray[i], 'operator');
            let isArithmeticOperator = isArithmeticOperators(pairAuxArray[i].value);

            // ignore =
            if(i === 0) {
              isArithmeticOperator = true;
            }

            if(!(isOperator && isArithmeticOperator && (isType(pairAuxArray[i + 1], 'variable') || isType(pairAuxArray[i + 1], 'integer'))))
              throw new Error(`Pilha de tokens inválida para operacao let: valores analisados ${pairAuxArray[i].value} | ${pairAuxArray[i + 1].value}`)
          }
        }

        currentIndex++;
        break;
      }
      case "print": {
        const nextToken = tokensArray[++currentIndex];

        if(!isType(nextToken, 'variable'))
          throw new Error(`Token após acao print não é válido: ${nextToken.value}`)

        currentIndex++;
        break;
      }
      case "goto": {
        let nextToken = tokensArray[++currentIndex];

        if(!isType(nextToken, 'integer'))
          throw new Error(`Token após goto não é um inteiro: ${nextToken.value}`);

        nextToken = tokensArray[++currentIndex]

        if(nextToken.value !== "\n")
          throw new Error(`Token após declaração de goto não é um '\\n': ${nextToken.value}`);

        break;
      }
      case "if": {
        let nextToken = tokensArray[++currentIndex]

        if(!(isType(nextToken, 'integer') || isType(nextToken, 'variable')))
          throw new Error(`Primeiro token após if não é uma variável ou um inteiro: ${nextToken.value}`);

        nextToken = tokensArray[++currentIndex];

        if(!isType(nextToken, 'operator'))
          throw new Error(`Segundo token após if não é um operador: ${nextToken.value}`);

        nextToken = tokensArray[++currentIndex];

        if(!(isType(nextToken, 'integer') || isType(nextToken, 'variable')))
          throw new Error(`Terceiro token após if não é uma variável ou um inteiro: ${nextToken.value}`);

        currentIndex++;
        break;
      }
      case "end": {
        break;
      }
    }
  }

  return true;
}

const isArithmeticOperators = (value) => {
  return value === "-"
    || value === "+"
    || value === "*"
    || value === "/"
    || value === "%"
}

const isType = (token, type) => {
  return token.type === type;
}

module.exports = { analyze }
