// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { describe, expect, it } from 'vitest';

import * as index from '../src/index';


describe('index', () => {
  it('should export Cli', () => {
    const keys = Object.keys(index);
    expect(keys).toEqual(['Cli']);
  });
});
