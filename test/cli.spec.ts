// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { describe, expect, it } from 'vitest';

import { Cli } from '../src/cli';


describe('Cli', () => {
  it('should validate a cli', () => {
    const cli = Cli.example;
    expect(cli).toBeDefined();
  });
});
