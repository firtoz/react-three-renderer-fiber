const Path = require("path");

/**
 * Makes the test debugging easier by source-mapping the function bodies
 */

/**
 *
 * @param babel
 * @returns {*}
 */
module.exports = (babel) => {
  const printParent = false;

  const { types: t } = babel;

  function funcVisitor(path) {
    const pathNode = path.node;
    if (!pathNode.loc) {
      return;
    }

    const parentPath = path.parentPath;

    if (parentPath.type === 'CallExpression' &&
      parentPath.node.callee.name === 'it') {

      const inputSourceMap = path.hub.file.opts.inputSourceMap;

      const fileMap = inputSourceMap.sources.reduce((map, source, i) => {
        map[inputSourceMap.sourceRoot + source] = inputSourceMap.sourcesContent[i];

        return map;
      }, {});


      const sourceMapConsumer = new require('source-map').SourceMapConsumer(inputSourceMap);

      // pathNode.star

      const locStart = pathNode.loc.start;
      const locEnd = pathNode.loc.end;

      const originalStart = sourceMapConsumer.originalPositionFor({
        line: locStart.line,
        column: locStart.column,
      });

      const originalEnd = sourceMapConsumer.originalPositionFor({
        line: locEnd.line,
        column: locEnd.column,
      });

      let expectedToString = path.hub.file.code.substr(
        pathNode.start,
        pathNode.end - pathNode.start);

      if (originalStart.source === originalEnd.source) {
        const sourceData = fileMap[originalStart.source];

        const lines = sourceData.replace(/\r\n/g, '\n').split(/\n/);

        const sourceLines = [
          lines[originalStart.line - 1].substring(originalStart.column),
        ].concat(lines.slice(originalStart.line, originalEnd.line - 1), [
          lines[originalEnd.line - 1].substring(0, originalEnd.column),
        ]);

        const numCommonSpaceChars = sourceLines.slice(1).reduce((minimumSpace, line) => {
          if (line.length === 0) {
            return minimumSpace;
          }

          const firstSpace = line.match(/^\s+/);

          if (!firstSpace) {
            return 0;
          }

          return Math.min(minimumSpace, firstSpace[0].length);
        }, 120);

        expectedToString = `// ${Path.relative(inputSourceMap.sourceRoot, inputSourceMap.file)}:${originalStart.line}:${originalStart.column}
const testCode = ` + ([sourceLines[0]].concat(
          sourceLines
            .slice(1)
            .map(line => {
              if (line.length === 0) {
                return line;
              }

              return line.substring(numCommonSpaceChars);
            })
        ).join('\n')) + ';';
      }

      try {
        path.replaceWith(
          t.expressionStatement(t.callExpression(
            t.functionExpression(null,
              [],
              t.blockStatement(
                [
                  t.variableDeclaration(
                    'let',
                    [
                      t.variableDeclarator(
                        t.identifier('func'),
                        pathNode,
                      ),
                    ]
                  ),
                  t.expressionStatement(
                    t.assignmentExpression(
                      '=', // operator
                      t.memberExpression(
                        t.identifier('func'),
                        t.identifier('toString'),
                        false
                      ), // left
                      t.functionExpression(
                        null,
                        [], // params
                        t.blockStatement([
                          t.returnStatement(
                            t.callExpression(
                              t.identifier('decodeURI'),
                              [t.stringLiteral(encodeURI(expectedToString))]
                            )
                          ),
                        ])// body
                      ), // right
                    )
                  ),
                  t.returnStatement(
                    t.identifier('func'),
                  ),
                ]
              ), // body
              false,
              false),
            []
            )
          )
        );
      } catch (e) {
        console.error(e); // eslint-disable-line
      }

      if (printParent) {
        // used for debugging
        try {
          console.log(babel.transformFromAst(// eslint-disable-line
            t.file(
              t.program(
                [
                  path.parentPath.parentPath.node,
                ]
              )
            )
          ).code);
        } catch (e) {
          console.error(e); // eslint-disable-line
        }
      }
    }
  }

  return ({
    visitor: {
      ArrowFunctionExpression: funcVisitor,
      FunctionExpression: funcVisitor,
    },
  });
}
;
