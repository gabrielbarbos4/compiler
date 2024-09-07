"use strict"

const analyze = (tokens) => {
  const tokensArray = Array.from(tokens);

  let currentIndex = 0;

  if(!isDigit(tokensArray[0]))
    throw new Error("Linha nao iniciada com digito");

  while(currentIndex != tokensArray.length) {
    const actualToken = tokensArray[currentIndex];

    if(
      tokensArray[currentIndex].value === "\n"
      && !isDigit(tokensArray[currentIndex + 1]) 
    ) throw new Error("Linha nao iniciada com digito");

    switch(actualToken.value) {
        case "rem":
          currentIndex++; 
          break;
        case "input":
          if(!tokensArray[currentIndex + 1].type !== "variable")
            throw new Error("token nao e variavel a frente do input");
          break;

        case "let":
            let indexAux = currentIndex + 1;
            let nextToken = tokensArray[indexAux]

            if(!isVariable(nextToken)) 
              throw new Error("Token nao e uma variavel apos o let");

            indexAux++;
            nextToken = tokensArray[indexAux];

            if(nextToken.value === "=") 
              throw new Error("Token nao e um '=' apos a variavel");

            while(nextToken !== "\n") {
              pairAuxArray.push({ token: nextToken });

              indexAux++;
              nextToken = tokensArray[indexAux];
            }
          break;

        case "rem": 
        break;
        case "rem": 
        break;
        case "rem": 
        break;
        case "rem": 
        break;
        case "rem": 
        break;
    }
  }

  console.log(tokensArray)
}

const isVariable = (token) => {
  return token.type === 'variable';
}

const isDigit = (character) => {
  return /^\d+$/.test(character)
}

module.exports = { analyze }