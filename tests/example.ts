import { CLIEngine } from "eslint";
import plugin from "../dist/src";

const cli = new CLIEngine({
  ignore: true,
  parser: "@typescript-eslint/parser",
  extensions: [".ts", ".json"],
  rulePaths: ["dist/src/rules"],
  rules: {
    "ts-config-allowsyntheticdefaultimports": "error",
    "ts-config-declaration": "error",
    "ts-config-esmoduleinterop": "error",
    "ts-config-forceconsistentcasinginfilenames": "error",
    "ts-config-importhelpers": "error",
    "ts-config-isolatedmodules": "warn",
    "ts-config-module": "error",
    "ts-config-no-experimentaldecorators": "error",
    "ts-config-strict": "error",
    "ts-package-json-author": "error",
    "ts-package-json-bugs": "error",
    "ts-package-json-license": "error",
    "ts-package-json-repo": "error",
    "ts-package-json-sideeffects": "error"
  } as any
});

cli.addPlugin("eslint-plugin-azure", {
  rules: plugin.rules,
  processors: plugin.processors,
  configs: plugin.configs
});

const report = cli.executeOnFiles(["tests/examples"]);

for (const obj of report.results) {
  console.log(obj.messages);
}
