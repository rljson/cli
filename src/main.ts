// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import chalk from 'chalk';

import { Cli } from './cli.ts';

const { green, red } = chalk;

const cli = Cli.example;
cli.exec();
if (cli.errors.length > 0) {
  console.error(red(cli.errors.map((e) => e.message).join('\n')));
} else {
  console.log(green(cli.result.join('\n')));
}

process.exit(cli.exitCode);
