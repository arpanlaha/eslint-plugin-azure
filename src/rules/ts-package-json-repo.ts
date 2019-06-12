/**
 * @fileoverview Rule to force package.json's repository value to be set to github:Azure/azure-sdk-for-js.
 * @author Arpan Laha
 */

import structure from "../utils/structure";
import { Rule } from "eslint";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = {
  meta: {
    type: "problem",

    docs: {
      description:
        "force package.json's repository value to be 'github:Azure/azure-sdk-for-js'",
      category: "Best Practices",
      recommended: true,
      url:
        "https://azuresdkspecs.z5.web.core.windows.net/TypeScriptSpec.html#ts-package-json-repo"
    },
    schema: [] // no options
  },
  create: function(context: Rule.RuleContext) {
    var checkers = structure(context, {
      outer: "repository",
      expected: "github:Azure/azure-sdk-for-js",
      fileName: "package.json"
    });
    return {
      // callback functions

      // check to see if repository exists at the outermost level
      "VariableDeclarator > ObjectExpression": checkers.existsInFile,

      // check the node corresponding to repository to see if its value is github:Azure/azure-sdk-for-js
      "VariableDeclarator > ObjectExpression > Property[key.value='repository']":
        checkers.outerMatchesExpected
    } as Rule.RuleListener;
  }
};
