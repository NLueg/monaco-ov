import { getTokenStringByTokenClass, TokenClass } from "./Enums";
import { createTokenizationSupport } from "../tokenization/tokenization";
import { ApiProxy } from "../rest/ApiService";

export namespace MonacoOvlConfiguration {
    export function setConfiguration() {
        // register Monaco languages
        monaco.languages.register({
            id: 'ovl',
            extensions: ['.ovl'],
            aliases: ['OVL', 'ovl', 'openVALIDATION'],
        });

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

    export async function setTokenization(text: string) {
        var returnList = await ApiProxy.postData(text);
        monaco.languages.setTokensProvider('ovl', createTokenizationSupport(returnList));
    }
}