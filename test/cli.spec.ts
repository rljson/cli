// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Rljson } from '@rljson/format';
import { Json } from '@rljson/json';

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

    const run = (args: string[]) => {
      process.argv = ['node', 'cli.js', ...args];
      cli.exec();
    };

    const expectError = (code: number, message: string) => {
      expect(cli.exitCode).toBe(code);
      expect(cli.errors.length).toBe(1);
      expect(cli.errors[0].message).toEqual(message);
    };

    const expectResult = (message: string) => {
      expect(cli.result.length).toBe(1);
      expect(cli.result[0]).toEqual(message);
    };

    // .........................................................................

    describe('exits with', () => {
      describe('0', () => {
        it('when input file is valid', async () => {
          const rljson: Rljson = { table: { _data: [], _type: 'properties' } };
          await setInput(JSON.stringify(rljson));
          run(['validate', '-i', inputFile, '-o', outputFile]);
          await expectOutput({});
          expectResult('Validation result written to ' + outputFile);
        });
      });

      describe('1', () => {
        it('when --input file is invalid', async () => {
          const rljson: Rljson = { tab_le: { _data: [], _type: 'properties' } };
          await setInput(JSON.stringify(rljson));
          run(['validate', '-i', inputFile, '-o', outputFile]);
          expectError(1, `Errors written to ${inputFile}.`);
          await expectOutput({
            tableNamesAreLowerCamelCase: {
              error: 'Table names must be lower camel case',
              invalidTableNames: ['tab_le'],
            },
          });
        });
      });

      describe('2', async () => {
        it('when --input is missing', async () => {
          run(['validate', '-o', outputFile]);
          expectError(
            2,
            'Error: Both input and output files must be specified.',
          );
        });

        it('when --output is missing', async () => {
          run(['validate', '-i', inputFile]);
          expect(cli.exitCode).toBe(2);
          expect(cli.errors.map((e) => e.message)).toEqual([
            'Error: Both input and output files must be specified.',
          ]);
        });

        it('when input file cannot be opened', async () => {
          run(['validate', '-i', inputFile, '-o', outputFile]);
          expectError(2, `Error: Input file not found: ${inputFile}`);
        });
      });
    });
  });
});
