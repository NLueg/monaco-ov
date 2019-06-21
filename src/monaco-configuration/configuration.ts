import { createTokenizationSupport } from "./tokenization";
import { getTokenStringByTokenClass, TokenClass } from "./enums";

export namespace MonacoConfiguration {
    export function setConfiguration() {
        // register Monaco languages
        monaco.languages.register({
            id: 'ovl',
            extensions: ['.ovl'],
            aliases: ['OVL', 'ovl', 'openVALIDATION'],
        });
        
        // imports syntax-highlighting for ovl
        monaco.languages.setTokensProvider('ovl', createTokenizationSupport())
        

        // defines color of the defined languages
        monaco.editor.defineTheme('ovlTheme', {
            base: 'vs',
            inherit: false,
            rules: [
                { token: getTokenStringByTokenClass(TokenClass.Keyword), foreground: '8e8e8e', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.Variable), foreground: '0000ff', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.Comment), foreground: '608b4e', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.NumberLiteral), foreground: 'b5cea8', fontStyle: 'bold' },
                { token: getTokenStringByTokenClass(TokenClass.BooleanLiteral), foreground: '0000ff', fontStyle: 'bold' },
            ],
            colors: {}
        });
    }
}