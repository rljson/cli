// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Json } from '@rljson/json';
import { Rljson } from '@rljson/rljson';

import * as fs from 'fs';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Cli } from '../src/cli';

describe('Cli', () => {
  let tmp = '';
  let cli: Cli;

  const createTmp = async () => {
    let i = 0;
    while (true) {
      tmp = join(tmpdir(), `rljson-cli-tests-${i}`);
      if (!fs.existsSync(tmp)) {
        await mkdir(tmp);
        break;
      }

      i++;
    }
  };

  beforeEach(async () => {
    cli = Cli.example;
    await createTmp();
  });

  afterEach(async () => {
    await rm(tmp, { recursive: true });
  });

  describe('validate', () => {
    let inputFile = '';
    let outputFile = '';

    beforeEach(async () => {
      inputFile = join(tmp, 'input.rl.son');
      outputFile = join(tmp, 'output.json');
      await createTmp();
    });

    const setInput = async (content: string) => {
      await writeFile(inputFile, content);
    };

    const expectOutput = async (content: Json) => {
      const output = JSON.parse(await readFile(outputFile, 'utf8'));
      expect(output).toEqual(content);
    };

    const run = async (args: string[]) => {
      process.argv = ['node', 'cli.js', ...args];
      await cli.exec();
    };

    const expectError = (code: number, message: string) => {
      expect(cli.exitCode).toBe(code);
      expect(cli.errors.length).toBe(1);
      expect(cli.errors[0].message).toContain(message);
    };

    const expectResult = (message: string) => {
      expect(cli.result.length).toBe(1);
      expect(cli.result[0]).toContain(message);
    };

    // .........................................................................

    describe('exits with', () => {
      describe('0', () => {
        it('when input file is valid', async () => {
          const rljson: Rljson = { table: { _data: [], _type: 'components' } };
          await setInput(JSON.stringify(rljson));
          await run(['validate', '-i', inputFile, '-o', outputFile]);
          await expectOutput({});
          expectResult('Everything is fine.');
        });
      });

      describe('1', () => {
        it('when --input file is invalid', async () => {
          const rljson: Rljson = {
            tab_le: { _data: [], _type: 'components' },
          };
          await setInput(JSON.stringify(rljson));
          await run(['validate', '-i', inputFile, '-o', outputFile]);
          expectError(1, `Errors written to`);
          expectError(1, outputFile);
          await expectOutput({
            base: {
              hasErrors: true,
              tableKeysNotLowerCamelCase: {
                error: 'Table names must be lower camel case',
                invalidTableKeys: ['tab_le'],
              },
            },
          });
        });
      });

      describe('2', async () => {
        it('when --input is missing', async () => {
          await run(['validate', '-o', outputFile]);
          expectError(
            2,
            'Error: Both input and output files must be specified.',
          );
        });

        it('when --output is missing', async () => {
          await run(['validate', '-i', inputFile]);
          expect(cli.exitCode).toBe(2);
          expect(cli.errors.map((e) => e.message)).toEqual([
            'Error: Both input and output files must be specified.',
          ]);
        });

        it('when input file cannot be opened', async () => {
          await run(['validate', '-i', inputFile, '-o', outputFile]);
          expectError(2, `Error: Input file not found`);
          expectError(2, inputFile);
        });

        it('when some other error happens', async () => {
          await setInput('invalid json');
          await run(['validate', '-i', inputFile, '-o', outputFile]);
          expectError(
            2,
            `Unexpected token 'i', "invalid json" is not valid JSON`,
          );
        });
      });
    });
  });
  describe('fromJSON', () => {
    let inputFile = '';
    let decomposeFile = '';
    let outputFile = '';

    beforeEach(async () => {
      inputFile = join(tmp, 'input.json');
      decomposeFile = join(tmp, 'decompose.json');
      outputFile = join(tmp, 'output.json');
      await createTmp();
    });

    const setInput = async (content: string) => {
      await writeFile(inputFile, content);
    };

    const setDecompose = async (content: string) => {
      await writeFile(decomposeFile, content);
    };

    const output = async () => {
      return JSON.parse(await readFile(outputFile, 'utf8'));
    };

    const run = async (args: string[]) => {
      process.argv = ['node', 'cli.js', ...args];
      await cli.exec();
    };

    const expectError = (code: number, message: string) => {
      expect(cli.exitCode).toBe(code);
      expect(cli.errors.length).toBe(1);
      expect(cli.errors[0].message).toContain(message);
    };

    const expectResult = (message: string) => {
      expect(cli.result.length).toBe(1);
      expect(cli.result[0]).toContain(message);
    };
    // .........................................................................

    describe('exits with', () => {
      describe('0', () => {
        it('when input & decompose file is valid', async () => {
          const json: Json = {
            id: 'car1',
            model: 'BMW',
          };
          const decompose: Json = {
            _sliceId: 'id',
            model: ['model'],
          };

          await setInput(JSON.stringify(json));
          await setDecompose(JSON.stringify(decompose));

          await run([
            'fromJson',
            '-i',
            inputFile,
            '-d',
            decomposeFile,
            '-o',
            outputFile,
          ]);
          const res = await output();
          expect(Object.keys(res)).toStrictEqual([
            'sliceId',
            'model',
            'modelLayer',
            'cake',
            'tableCfgs',
          ]);
          expectResult('Everything is fine.');
        });
      });

      describe('1', () => {
        it('when --input or --decompose file is invalid', async () => {
          const json: Json = {
            _wrong: 'id',
          };

          const decompose: Json = {
            wrong: 'id',
            _types: [
              {
                name: 'cake',
              },
            ],
          };

          await setInput(JSON.stringify(json));
          await setDecompose(JSON.stringify(decompose));

          await run([
            'fromJson',
            '-i',
            inputFile,
            '-d',
            decomposeFile,
            '-o',
            outputFile,
          ]);

          expectError(1, `If subtypes are defined, _name must be provided!`);
        });
      });

      describe('2', async () => {
        it('when --input is missing', async () => {
          await run(['fromJson', '-o', outputFile]);
          expectError(
            2,
            'Error: Input, decompose and output files must be specified.',
          );
        });

        it('when --output is missing', async () => {
          await run(['fromJson', '-i', inputFile]);
          expect(cli.exitCode).toBe(2);
          expect(cli.errors.map((e) => e.message)).toEqual([
            'Error: Input, decompose and output files must be specified.',
          ]);
        });

        it('when input file cannot be opened', async () => {
          await run([
            'fromJson',
            '-i',
            inputFile,
            '-d',
            decomposeFile,
            '-o',
            outputFile,
          ]);
          expectError(2, `Error: Input file not found`);
          expectError(2, inputFile);
        });

        it('when input file cannot be opened', async () => {
          setInput('{}');
          await run([
            'fromJson',
            '-i',
            inputFile,
            '-d',
            decomposeFile,
            '-o',
            outputFile,
          ]);
          expectError(2, `Error: Input Decompose Chart file not found`);
          expectError(2, inputFile);
        });

        it('when some other error happens', async () => {
          await setInput('invalid json');
          await setDecompose('invalid json');
          await run([
            'fromJson',
            '-i',
            inputFile,
            '-d',
            decomposeFile,
            '-o',
            outputFile,
          ]);
          expectError(
            2,
            `Unexpected token 'i', "invalid json" is not valid JSON`,
          );
        });
      });
    });
  });
});
