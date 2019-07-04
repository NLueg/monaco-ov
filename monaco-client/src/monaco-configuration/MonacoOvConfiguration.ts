import { getTokenStringByTokenClass, TokenClass } from "./Enums";
import { SemanticHighlightingParams } from "monaco-languageclient";
import { loadWASM } from 'onigasm' // peer dependency of 'monaco-textmate'
import { Registry } from 'monaco-textmate' // peer dependency
import { wireTmGrammars } from 'monaco-editor-textmate';

export namespace MonacoOvConfiguration {
    export function setConfiguration() {
        // register Monaco languages
        monaco.languages.register({
            id: 'ov',
            extensions: ['.ov'],
            aliases: ['OV', 'ov', 'openVALIDATION'],
        });

        // defines color of the defined languages
        monaco.editor.defineTheme('ovTheme', {
            base: 'vs',
            inherit: false,
            rules: [
                { token: getTokenStringByTokenClass(TokenClass.Keyword), foreground: '8e8e8e', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.Identifier), foreground: '0000ff', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.Comment), foreground: '608b4e', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.NumberLiteral), foreground: 'b5cea8', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.StringLiteral), foreground: '0000ff', fontStyle: 'bold' },
            ],
            colors: {}
        });
    }

    export async function setTokenization(params: SemanticHighlightingParams) {
        await liftOff(params)
    }

	async function liftOff(params: SemanticHighlightingParams) {
		await loadWASM(require("./../../node_modules/onigasm/lib/onigasm.wasm"));
	
		const registry = new Registry({
			getGrammarDefinition: async (scopeName) => {
				return {
					format: 'json',
					content: await params.lines[0].tokens!
				}
			}
		});
	
		// map of monaco "language id's" to TextMate scopeNames
		const grammars = new Map()
		grammars.set('ov', 'source.ov')
	
		await wireTmGrammars(monaco, registry, grammars);
	}
}