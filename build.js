/*
 * Filename: /Users/gatzsche/dev/rljson/cli/build.js
 * Path: /Users/gatzsche/dev/rljson/cli
 * Created Date: Saturday, March 8th 2025, 12:45:25 pm
 * Author: Gabriel Gatzsche
 *
 * Copyright (c) 2025 Your Company
 */
import esbuild from 'esbuild';
import { existsSync, mkdirSync, rmSync } from 'fs';

// .............................................................................
const buildCli = async () => {
  esbuild
    .build({
      entryPoints: ['src/main.ts'],
      bundle: true, // Bundle everything into one file
      platform: 'node', // Target Node.js
      target: 'node22', // Set a modern Node.js version
      format: 'cjs', // Output CommonJS (CJS)
      outfile: 'dist/cli.cjs',
      external: [], // Keep dependencies external if needed
      minify: true,
      sourcemap: false,
      banner: {
        js: '#!/usr/bin/env node',
      },
    })
    .catch(() => process.exit(1));
};

const cleanDist = () => {
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
  }
  mkdirSync('dist');
};

// .............................................................................
cleanDist();
await buildCli();
