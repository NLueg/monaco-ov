import { createTokenizationSupport } from "../tokenization/tokenization";
import { getTokenStringByTokenClass, TokenClass } from "./Enums";

export namespace MonacoConfiguration {
    export async function setConfiguration() {
        // register Monaco languages
        monaco.languages.register({
            id: 'ovl',
            extensions: ['.ovl'],
            aliases: ['OVL', 'ovl', 'openVALIDATION'],
        });
        
        // imports syntax-highlighting for ovl
        monaco.languages.setTokensProvider('ovl', createTokenizationSupport());

        //TODO: Rules should be named like in vs
        // defines color of the defined languages
        monaco.editor.defineTheme('ovlTheme', {
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
}