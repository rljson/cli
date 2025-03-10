# Contributors

## Issues

Check out [./README.trouble.md](./README.trouble.md)

Report issues as <https://github.com/rljson/cli/issues>

## Check out

```bash
mkdir rljson
cd rljson
git clone https://github.com/rljson/cli.git
cd cli
```

## Install pnpm

Windows:

```bash
corepack enable pnpm
```

Mac:

```bash
sudo corepack enable pnpm
```

## Install dependencies

```bash
npm install
```

## Run the tests

```bash
npm run test
```

## Build the package

```bash
npm run build
```

## Publish the package

1. Open `package.json`.
2. Increase the `version` number.
3. Compile TypeScript:

   ```bash
   pnpm run build
   ```

4. Perform a dry-run of the publish process:

   ```bash
   pnpm publish --access=public --dry-run
   ```

5. Review the uploaded changes.
6. Publish the package:

   ```bash
   pnpm publish --access=public
   ```

## Architecture

Read [README.architecture.md](./README.architecture.md) to get an overview of
the package architecture.

## Install VS Code extensions

1. Open this project in `VS Code`.
2. Press `Cmd+Shift+P`.
3. Type `Extensions: Show Recommended Extensions` and press `Enter`.
4. The recommended extensions will be displayed.
5. Make sure all recommended extensions are installed.

## Uninstall all test extensions (e.g., Jest or Jasmine)

Jest or Jasmine extensions conflict with the `Vitest` extension used in this
project.

Uninstall them if they are installed.

## Debug tests

1. In `VS Code`, click on the `Test Tube` icon in the left sidebar to open the
   `Test Explorer`.
2. At the top, click the `Refresh` icon to update the test list.
3. Open a test file (`*.spec.ts`).
4. Set a breakpoint.
5. Press `Alt` and click the play button next to the test.

Execution should stop at the breakpoint.

## Update goldens

In various tests, we create golden files, which serve as reference files that
are compared against test-generated files.

If a change is detected, the test fails.

To update the golden files, run:

```bash
npm run updateGoldens
```

Then, check the changes in the `test/goldens` folder.

## Add production dependencies

In the following commands replace `xyz` by your dependency:

```bash
npm install xyz --save-peer
```

Open `vite.config.mts`

Locate `rollupOptions`

Locate `external`

Add `xyz`

By adding dependencies to `peerDependencies` we make sure that they are not
bundled when we are building our package as an library
