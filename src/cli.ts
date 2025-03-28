// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { validate } from '@rljson/validate';

import chalk from 'chalk';
import { Command } from 'commander';
import * as fs from 'fs';

const { blue } = chalk;

// .............................................................................
export class Cli {
  /** Example instance for test purposes */
  static get example(): Cli {
    return new Cli();
  }

  async exec(): Promise<number> {
    this._initCommands();
    this._readCommandLineArgs();
    await this._command.parseAsync(process.argv);
    return this._exitCode;
  }

  get exitCode(): number {
    return this._exitCode;
  }

  get errors(): Error[] {
    return this._errors;
  }

  get result(): string[] {
    return this._result;
  }

  // ######################
  // Private
  // ######################

  private readonly _command = new Command();

  private _initCommands(): void {
    this._initValidate();
  }

  private _exitCode = 0;

  private _errors: Error[] = [];
  private _result: string[] = [];

  private async _initValidate() {
    this._command
      .name('rljson')
      .command('validate')
      .description('Validate a Rjson file')
      .option('-i, --input <file>', 'Input Rljson file')
      .option('-o, --output <file>', 'Validation result json')
      .action(async (options) => {
        if (!options.input || !options.output) {
          this._exit(
            2,
            Error('Error: Both input and output files must be specified.'),
          );
          return;
        }

        try {
          if (!fs.existsSync(options.input)) {
            this._exit(
              2,
              Error(`Error: Input file not found: ${blue(options.input)}`),
            );
            return;
          }

          const data = fs.readFileSync(options.input, 'utf8');
          const json = JSON.parse(data);

          const result = await validate(json);

          fs.writeFileSync(options.output, JSON.stringify(result, null, 2));

          const noErrors = Object.keys(result).length === 0;
          if (noErrors) {
            this._result.push(`Everything is fine.`);
            this._exit(0, undefined);
            return;
          } else {
            this._exit(
              1,
              new Error(`Errors written to: ${blue(options.output)}`),
            );
            return;
          }
        } catch (error) {
          this._exit(2, error as Error);
          return;
        }
      });
  }

  private _exit(exitCode: number, error: Error | undefined): void {
    if (error) {
      this._errors.push(error);
    }
    this._exitCode = exitCode;
  }

  private _readCommandLineArgs(): void {}
}
