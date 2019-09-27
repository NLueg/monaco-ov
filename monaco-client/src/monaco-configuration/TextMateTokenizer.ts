// import { loadWASM } from 'onigasm' // peer dependency of 'monaco-textmate'
// import { Registry } from 'monaco-textmate' // peer dependency
// import { wireTmGrammars } from 'monaco-editor-textmate';

/**
 * Class for setting Monaco-Tokenizer based on a TextMate grammar
 *
 * @export
 * @class TextMateTokenizer
 */
export class TextMateTokenizer {
    // private wasmIsInitialized: boolean;

    // constructor() {
    //     this.wasmIsInitialized = false;
    // }

    /**
     * Loads all dependencies und setTokensProvider based on Textmate
     *
     * @param {SemanticHighlightingParams} params parameters send from the server
     * @memberof TextMateTokenizer
     */
    public async setTokenization(params: monaco.languages.IToken[][]) {
        monaco.languages.setTokensProvider("ov", {
            getInitialState: () => new State(),
            tokenize: (line: string, state: State) => {
                var currentTokens = params.length > state.getLineNumber() ? params[state.getLineNumber()] : [];
                return {
                    endState: state.increaseLineNumber(),
                    tokens: currentTokens
                };
            }
        });

        // if (!this.wasmIsInitialized) {
        //     await loadWASM(require("./../../node_modules/onigasm/lib/onigasm.wasm"));
        //     this.wasmIsInitialized = true;
        // }

        // const registry = new Registry({
        //     getGrammarDefinition: async (scopeName) => {
        //         return {
        //             format: 'json',
        //             content: await params
        //         }
        //     }
        // });

        // // map of monaco "language id's" to TextMate scopeNames
        // const grammars = new Map()
        // grammars.set('ov', 'source.ov')

        // await wireTmGrammars(monaco, registry, grammars);
    }
}

class State implements monaco.languages.IState {
    private lineNumber: number;

    constructor() {
        this.lineNumber = 0;
    }

    public getLineNumber() { return this.lineNumber; }
    public setLineNumber(lineNumber: number) { this.lineNumber = lineNumber };

    public increaseLineNumber(): State {
        var newState = new State();
        newState.setLineNumber(this.getLineNumber() + 1);
        return newState;
    }

    public clone(): State {
        var newState = new State();
        newState.setLineNumber(this.lineNumber);
        return newState;
    }

    public equals(other: monaco.languages.IState): boolean {
        return other instanceof State && other.getLineNumber() == this.getLineNumber();
    }
}