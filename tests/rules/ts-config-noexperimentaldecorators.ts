/**
 * @fileoverview Testing the ts-config-no-experimentaldecorators rule.
 * @author Arpan Laha
 */

import { rule } from "../../src/rules/ts-config-no-experimentaldecorators";
import { RuleTester } from "eslint";
import { processJSON } from "../utils/processTests";

//------------------------------------------------------------------------------
// Example files
//------------------------------------------------------------------------------

const example_tsconfig_good = `{
  "compilerOptions": {
    /* Basic Options */
    "target": "es6" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */,
    "module": "es6" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,

    "declaration": true /* Generates corresponding '.d.ts' file. */,
    "declarationMap": true /* Generates a sourcemap for each corresponding '.d.ts' file. */,
    "sourceMap": true /* Generates corresponding '.map' file. */,

    "outDir": "./dist-esm" /* Redirect output structure to the directory. */,
    "declarationDir": "./typings" /* Output directory for generated declaration files.*/,

    "importHelpers": true /* Import emit helpers from 'tslib'. */,

    /* Strict Type-Checking Options */
    "strict": true /* Enable all strict type-checking options. */,
    "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,

    /* Additional Checks */
    "noUnusedLocals": true /* Report errors on unused locals. */,

    /* Module Resolution Options */
    "moduleResolution": "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,
    "allowSyntheticDefaultImports": true /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */,
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,

    /* Experimental Options */
    "forceConsistentCasingInFileNames": true,

    /* Other options */
    "newLine": "LF" /*	Use the specified end of line sequence to be used when emitting files: "crlf" (windows) or "lf" (unix).”*/,
    "allowJs": false /* Don't allow JavaScript files to be compiled.*/,
    "resolveJsonModule": true
  },
  "compileOnSave": true,
  "exclude": ["node_modules", "typings/**", "./samples/**/*.ts"],
  "include": ["./src/**/*.ts", "./test/**/*.ts"]
}`;

const example_tsconfig_bad = `{
  "compilerOptions": {
    /* Basic Options */
    "target": "es6" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */,
    "module": "es6" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,

    "declaration": true /* Generates corresponding '.d.ts' file. */,
    "declarationMap": true /* Generates a sourcemap for each corresponding '.d.ts' file. */,
    "sourceMap": true /* Generates corresponding '.map' file. */,

    "outDir": "./dist-esm" /* Redirect output structure to the directory. */,
    "declarationDir": "./typings" /* Output directory for generated declaration files.*/,

    "importHelpers": true /* Import emit helpers from 'tslib'. */,

    /* Strict Type-Checking Options */
    "strict": true /* Enable all strict type-checking options. */,
    "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,

    /* Additional Checks */
    "noUnusedLocals": true /* Report errors on unused locals. */,

    /* Module Resolution Options */
    "moduleResolution": "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,
    "allowSyntheticDefaultImports": true /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */,
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,

    /* Experimental Options */
    "forceConsistentCasingInFileNames": true,

    /* Other options */
    "newLine": "LF" /*	Use the specified end of line sequence to be used when emitting files: "crlf" (windows) or "lf" (unix).”*/,
    "allowJs": false /* Don't allow JavaScript files to be compiled.*/,
    "resolveJsonModule": true,
    "experimentalDecorators": true
  },
  "compileOnSave": true,
  "exclude": ["node_modules", "typings/**", "./samples/**/*.ts"],
  "include": ["./src/**/*.ts", "./test/**/*.ts"]
}`;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser"
});

ruleTester.run("ts-config-no-experimentaldecorators", rule, {
  valid: [
    {
      // only the fields we care about
      code: '{"compilerOptions": { "experimentalDecorators": false }}',
      filename: processJSON("tsconfig.json") as any // this is stupid but it works
    },
    {
      // a full example tsconfig.json (taken from https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/event-hubs/tsconfig.json)
      code: example_tsconfig_good,
      filename: processJSON("tsconfig.json") as any
    },
    {
      // incorrect format but in a file we don't care about
      code: '{"compilerOptions": { "experimentalDecorators": true }}',
      filename: processJSON("not_tsconfig.json") as any
    },
    {
      // field not provided
      code: '{"compilerOptions": {}}',
      filename: processJSON("tsconfig.json") as any
    }
  ],
  invalid: [
    {
      code: '{"notCompilerOptions": {}}',
      filename: processJSON("tsconfig.json") as any,
      errors: [
        {
          message:
            "tsconfig.json: compilerOptions does not exist at the outermost level"
        }
      ]
    },
    {
      // commpilerOptions is in a nested object
      code:
        '{"outer": {"compilerOptions": { "experimentalDecorators": false }}}',
      filename: processJSON("tsconfig.json") as any,
      errors: [
        {
          message:
            "tsconfig.json: compilerOptions does not exist at the outermost level"
        }
      ]
    },
    {
      // only the fields we care about
      code: '{"compilerOptions": { "experimentalDecorators": true }}',
      filename: processJSON("tsconfig.json") as any,
      errors: [
        {
          message:
            "tsconfig.json: compilerOptions.experimentalDecorators is set to true when it should be set to false"
        }
      ]
    },
    {
      // example file with compilerOptions.experimentalDecorators set to true
      code: example_tsconfig_bad,
      filename: processJSON("tsconfig.json") as any,
      errors: [
        {
          message:
            "tsconfig.json: compilerOptions.experimentalDecorators is set to true when it should be set to false"
        }
      ]
    }
  ]
});