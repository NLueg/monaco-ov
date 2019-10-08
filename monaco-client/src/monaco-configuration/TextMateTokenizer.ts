import { wireTmGrammars } from 'monaco-editor-textmate';
import { Registry } from 'monaco-textmate'; // peer dependency
import { loadWASM } from 'onigasm'; // peer dependency of 'monaco-textmate'

/**
 * Class for setting Monaco-Tokenizer based on a TextMate grammar
 *
 * @export
 * @class TextMateTokenizer
 */
export class TextMateTokenizer {
    private wasmIsInitialized : boolean;

    constructor() {
        this.wasmIsInitialized = false;
    }

    /**
     * Loads all dependencies und setTokensProvider based on Textmate
     *
     * @param {SemanticHighlightingParams} params parameters send from the server
     * @memberof TextMateTokenizer
     */
    public async setTokenization(params: object) {
        if (!this.wasmIsInitialized) {
            await loadWASM(require("./../../node_modules/onigasm/lib/onigasm.wasm"));
            this.wasmIsInitialized = true;
        }		
	
		const registry = new Registry({
			getGrammarDefinition: async (scopeName) => {
				return {
					format: 'json',
					content: await params
				}
			}
		});
	
		// map of monaco "language id's" to TextMate scopeNames
		const grammars = new Map()
		grammars.set('ov', 'source.ov')
	
		await wireTmGrammars(monaco, registry, grammars);
    }
}