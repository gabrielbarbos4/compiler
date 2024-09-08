import * as fs from 'fs'
import * as path from 'path'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { compile } from "../compiler/compiler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fromFiles = (type) => {
  const folderPath = `resources/${type}`;
  const failureDirPath = path.join(__dirname, folderPath)
  const files = fs.readdirSync(failureDirPath);

  return files.map(file => ({
    content: fs.readFileSync(path.join(failureDirPath, file)).toString(),
    fileName: file
  }));
}

describe("Compiler", () => {
  test.each(fromFiles('failure'))('file name: $fileName', ({ content }) => {
    // act - assert
    expect(() => { compile(content) }).toThrowError();
  });

  test.each(fromFiles('success'))('file name: $fileName', ({ content }) => {
    // act - assert
    expect(() => { compile(content) }).not.toThrowError();
  });
})