/**
 * @fileoverview Rule to force tsconfig.json's compilerOptions.esModuleInterop value to be true.
 * @author Arpan Laha
 */

"use strict";

import getVerifiers from "../utils/verifiers";
import { Rule } from "eslint";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = {
  meta: {
    type: "problem",

    docs: {
      description:
        "force tsconfig.json's compilerOptions.esModuleOnterop value to be true",
      category: "Best Practices",
      recommended: true,
      url:
        "https://azuresdkspecs.z5.web.core.windows.net/TypeScriptSpec.html#ts-config-esmoduleinterop"
    },
    schema: [] // no options
  },
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const verifiers = getVerifiers(context, {
      outer: "compilerOptions",
      inner: "esModuleInterop",
      expected: true,
      fileName: "tsconfig.json"
    });
    return {
      // callback functions

      // check to see if compilerOptions exists at the outermost level
      "ExpressionStatement > ObjectExpression": verifiers.existsInFile,

      // check that esModuleInterop is a member of compilerOptions
      "Property[key.value='compilerOptions']": verifiers.isMemberOf,

      // check the node corresponding to compilerOptions.esModuleInterop to see if it is set to true
      "ExpressionStatement > ObjectExpression > Property[key.value='compilerOptions'] > ObjectExpression > Property[key.value='esModuleInterop']":
        verifiers.innerMatchesExpected
    } as Rule.RuleListener;
  }
};
