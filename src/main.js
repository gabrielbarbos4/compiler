import * as fs from 'fs'
import { compile } from "./compiler/compiler.js";

compile(fs.readFileSync(`src/resources/code.txt`).toString());