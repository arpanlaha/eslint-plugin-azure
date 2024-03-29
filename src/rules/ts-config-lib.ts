/**
 * @fileoverview Rule to force tsconfig.json's compilerOptions.lib value to be an empty array.
 * @author Arpan Laha
 */

import getVerifiers from "../utils/verifiers";
import { Rule } from "eslint";
import { ArrayExpression, Property } from "estree";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = {
  meta: {
    type: "problem",

    docs: {
      description:
        "force tsconfig.json's compilerOptions.lib value to be an empty array",
      category: "Best Practices",
      recommended: true,
      url:
        "https://azuresdkspecs.z5.web.core.windows.net/TypeScriptSpec.html#ts-config-lib"
    },
    schema: [] // no options
  },
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const verifiers = getVerifiers(context, {
      outer: "compilerOptions",
      inner: "lib",
      fileName: "tsconfig.json"
    });
    return {
      // callback functions

      // check to see if compilerOptions exists at the outermost level
      "ExpressionStatement > ObjectExpression": verifiers.existsInFile,

      // check that lib is a member of compilerOptions
      "Property[key.value='compilerOptions']": verifiers.isMemberOf,

      // check the node corresponding to compilerOptions.lib to see if it is set to an empty array
      "ExpressionStatement > ObjectExpression > Property[key.value='compilerOptions'] > ObjectExpression > Property[key.value='lib']": (
        node: Property
      ): void => {
        if (
          context.getFilename().replace(/^.*[\\\/]/, "") === "tsconfig.json"
        ) {
          if (node.value.hasOwnProperty("elements")) {
            const nodeValue: ArrayExpression = node.value as ArrayExpression;
            nodeValue.elements.length !== 0 &&
              context.report({
                node: node,
                message: "compilerOptions.lib is not set to an empty array"
              });
          } else {
            context.report({
              node: node,
              message: "compilerOptions.lib is not set to an empty array"
            });
          }
        }
      }
    } as Rule.RuleListener;
  }
};
