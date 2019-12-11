import { Range } from "monaco-languageclient";
import { State } from "./State";

export function createTokenizationSupport(
  params: {
    range: Range;
    pattern: string;
  }[]
): monaco.languages.TokensProvider {
  var hashMap = generateTokensHashMap(params);
  return {
    getInitialState: () => new State(0),
    tokenize: (line: string, state: State) =>
      tokenize(<State>state, line, hashMap)
  };
}

function tokenize(
  state: State,
  text: string,
  params: Map<number, monaco.languages.IToken[]>
): monaco.languages.ILineTokens {
  var ret = {
    tokens: <monaco.languages.IToken[]>[],
    endState: new State(state.lineIndex + 1)
  };

  var something = params.get(state.lineIndex);
  if (!!something) {
    ret.tokens.push(...something);
  }

  return ret;
}

function generateTokensHashMap(
  params: { range: Range; pattern: string }[]
): Map<number, monaco.languages.IToken[]> {
  let returnMap = new Map<number, monaco.languages.IToken[]>();

  for (const param of params) {
    if (!param.range) continue;

    var startLine = param.range.start.line;

    // 1. just add the start
    if (!returnMap.get(startLine)) {
      var initialValue = [];
      if (param.range.start.character > 0) {
        initialValue.push({
          startIndex: 0,
          scopes: "empty"
        });
      }

      returnMap.set(startLine, initialValue);
    }

    var currentValue: monaco.languages.IToken[] | undefined = returnMap.get(
      startLine
    );
    if (!currentValue) continue;

    currentValue.push({
      startIndex: param.range.start.character,
      scopes: param.pattern
    });

    var multipleLines: boolean =
      param.range.end.line - param.range.start.line >= 1;
    if (!multipleLines) {
      currentValue.push({
        startIndex: param.range.end.character,
        scopes: "empty"
      });
    } else {
      for (
        var index = param.range.start.line + 1;
        index <= param.range.end.line;
        index++
      ) {
        var tmp = returnMap.get(index);
        if (!tmp) tmp = [];

        tmp.push({
          startIndex: 0,
          scopes: param.pattern
        });

        if (index == param.range.end.line) {
          tmp.push({
            startIndex: param.range.end.character,
            scopes: "empty"
          });
        }

        returnMap.set(index, tmp);
      }
    }

    returnMap.set(startLine, currentValue);
  }

  for (let [key, value] of returnMap) {
    var sortedValue = value.sort(
      (n1: monaco.languages.IToken, n2: monaco.languages.IToken) =>
        n1.startIndex - n2.startIndex
    );
    returnMap.set(key, sortedValue);
  }

  return returnMap;
}
