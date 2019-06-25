import { EndOfLineState, TokenClass, getTokenStringByTokenClass } from "./enums";
import { Classifier } from "./Classifier";
import { TokenizationState } from "./TokenizationState";

export class OwnTokensProvider implements monaco.languages.TokensProvider {
    constructor(private readonly classifier: [RegExp, TokenClass][]) { }

    getInitialState(): monaco.languages.IState {
        return new TokenizationState(EndOfLineState.None, false);
    }

    tokenize(line: string, state: TokenizationState): monaco.languages.ILineTokens {
        // Create result early and fill in tokens
        var ret = {
            tokens: <monaco.languages.IToken[]>[],
            endState: new TokenizationState(EndOfLineState.None, false)
        };

        var result = Classifier.validate(this.classifier, line, (state).eolState), offset = 0;
        ret.endState.eolState = result.endOfLineState;
        ret.endState.inJsDocComment = result.endOfLineState === EndOfLineState.InMultiLineComment && (state.inJsDocComment || /\/\*\*.*$/.test(line));
        for (let entry of result.entries) {
            if (entry.classification === TokenClass.Comment) {
                // comments: check for JSDoc, block, and line comments
                if (ret.endState.inJsDocComment || /\/\*\*.*\*\//.test(line.substr(offset, entry.length))) {
                    this.appendToken(offset, getTokenStringByTokenClass(TokenClass.Comment), ret);
                }
                else {
                    this.appendToken(offset, getTokenStringByTokenClass(TokenClass.Comment), ret);
                }
            }
            else {
                this.appendToken(offset, getTokenStringByTokenClass(entry.classification), ret);
            }
            offset += entry.length;
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
