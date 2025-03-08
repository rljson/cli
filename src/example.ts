// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

// import { Cli } from '@rljson/cli';
import { Cli } from './cli.ts';


export const example = () => {
  // Print methods
  const l = console.log;
  const h1 = (text: string) => l(`${text}`);
  const h2 = (text: string) => l(`  ${text.split('\n')}`);
  const p = (text: string) => l(`    ${text}`);

  h1('Cli.example');
  h2('Returns an instance of the cli.');
  const example = Cli.example;
  p(JSON.stringify(example, null, 2));
};

// Comment out to run via »npx vite-node src/example.ts«:
// example();
