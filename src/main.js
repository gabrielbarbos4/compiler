import * as fs from 'fs'
import { compile, executeSynthesis } from "./compiler/compiler.js";

// compile(fs.readFileSync(`src/resources/code.txt`).toString());
executeSynthesis(fs.readFileSync(`src/resources/code.txt`).toString());