import { EndOfLineState, TokenClass, getTokenStringByTokenClass } from "../monaco-configuration/Enums";
import { Classifier } from "./Classifier";
import { TokenizationState } from "./TokenizationState";

export class OvlTokenProvider implements monaco.languages.TokensProvider {
    constructor(private readonly classificationRules: [RegExp, TokenClass][]) {
     }

    getInitialState(): monaco.languages.IState {
        return new TokenizationState(EndOfLineState.None, false);
    }

    tokenize(line: string, state: TokenizationState): monaco.languages.ILineTokens {
        // Create result early and fill in tokens
        var ret = {
            tokens: <monaco.languages.IToken[]>[],
            endState: new TokenizationState(EndOfLineState.None, false)
        };

        var result = Classifier.validate(this.classificationRules, line, (state).eolState);
        ret.endState.eolState = result.endOfLineState;
        ret.endState.inJsDocComment = result.endOfLineState === EndOfLineState.InMultiLineComment && (state.inJsDocComment || /\/\*\*.*$/.test(line));
        for (let entry of result.entries) {
            if (entry.classification === TokenClass.Comment) {
                // comments: check for JSDoc, block, and line comments
                if (ret.endState.inJsDocComment || /\/\*\*.*\*\//.test(line.substr(entry.start, entry.length))) {
                    this.appendToken(entry.start, getTokenStringByTokenClass(TokenClass.Comment), ret);
                }
                else {
                    this.appendToken(entry.start, getTokenStringByTokenClass(TokenClass.Comment), ret);
                }
            }
            else {
                this.appendToken(entry.start, getTokenStringByTokenClass(entry.classification), ret);
            }
        }
        return ret;
    }

    private appendToken(startIndex: number, type: string, ret: monaco.languages.ILineTokens): void {
        if (ret.tokens.length === 0 || ret.tokens[ret.tokens.length - 1].scopes !== type) {
            ret.tokens.push({
                startIndex: startIndex,
                scopes: type
            });
        }
    }
}
