/**
 * ESLint local plugin: Playwright-specific fixers
 * Rule: remove-unused-request-param
 * - In Playwright tests, auto-remove unused `request` from destructured params
 *   e.g., async ({ page, request }) => { // not using request } -> async ({ page }) => {}
 */

const plugin = {
  rules: {
    'remove-unused-request-param': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Auto-remove unused `request` from Playwright test function params',
        },
        fixable: 'code',
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();

        function isIdentifierUsedInBody(funcNode, name) {
          const tokens = sourceCode.getTokens(funcNode.body);
          return tokens.some(
            (t) => t.type === 'Identifier' && t.value === name,
          );
        }

        function fixRemoveProperty(fixer, objectPattern, property) {
          const tokens = sourceCode;
          const [start, end] = property.range;
          const nextToken = tokens.getTokenAfter(property);
          const prevToken = tokens.getTokenBefore(property);

          // If there is a comma after the property, remove until after that comma
          if (nextToken && nextToken.value === ',') {
            let removalEnd = nextToken.range[1];
            const afterComma = tokens.getTokenAfter(nextToken, {
              includeComments: true,
            });
            if (
              afterComma &&
              sourceCode.text
                .slice(nextToken.range[1], afterComma.range[0])
                .match(/^\s+/)
            ) {
              removalEnd = afterComma.range[0];
            }
            return fixer.removeRange([start, removalEnd]);
          }

          // Else, if there is a comma before, remove from that comma
          if (prevToken && prevToken.value === ',') {
            let removalStart = prevToken.range[0];
            const beforeComma = tokens.getTokenBefore(prevToken, {
              includeComments: true,
            });
            if (
              beforeComma &&
              sourceCode.text
                .slice(beforeComma.range[1], prevToken.range[0])
                .match(/\s+$/)
            ) {
              removalStart = beforeComma.range[1];
            }
            return fixer.removeRange([removalStart, end]);
          }

          // Single property case: replace `{ request }` with `{}` or remove entirely
          if (objectPattern.properties.length === 1) {
            return fixer.replaceText(objectPattern, '{}');
          }
          return fixer.removeRange([start, end]);
        }

        return {
          ArrowFunctionExpression(node) {
            if (!node.params || node.params.length === 0) return;
            const first = node.params[0];
            if (first.type !== 'ObjectPattern') return;

            // Find `request` in destructured properties
            const requestProp = first.properties.find((p) => {
              if (p.type !== 'Property') return false;
              const key = p.key;
              return key && key.type === 'Identifier' && key.name === 'request';
            });
            if (!requestProp) return;

            // Ensure `request` is not used in the function body
            if (isIdentifierUsedInBody(node, 'request')) return;

            context.report({
              node: requestProp,
              message: 'Unused Playwright param `request` can be removed.',
              fix(fixer) {
                return fixRemoveProperty(fixer, first, requestProp);
              },
            });
          },
        };
      },
    },
  },
};

export default plugin;
