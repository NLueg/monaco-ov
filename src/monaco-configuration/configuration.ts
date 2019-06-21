// import { createTokenizationSupport } from "./tokenization";

export namespace MonacoConfiguration {
    export function setConfiguration() {
        // register Monaco languages
        monaco.languages.register({
            id: 'ovl',
            extensions: ['.ovl'],
            aliases: ['OVL', 'ovl', 'openVALIDATION'],
        });

        // imports syntax-highlighting for ovl
        monaco.languages.setMonarchTokensProvider('ovl', tokenizer());

        function tokenizer() : monaco.languages.IMonarchLanguage {
            return { 
                tokenizer: {
                root:  [
                            [/WENN|UND|ODER|DANN|LÄNGER ALS|OPERAND|OPERATOR|KÜRZER ALS|DARF NICHT|HÖHER ALS|NIEDRIGER ALS|NIEDRIGER IST ALS|HÖHER IST ALS|GRÖßER IST ALS|KLEINER ALS|GRÖßER ALS|GERINGER IST ALS|IST GLEICH|IST UNGLEICH|IST KEIN|IST EIN|IST NICHT|IST GRÖßER ALS|IST MEHR ALS| IST HÖHER ALS|IST LÄNGER ALS|IST KLEINER ALS|IST WENIGER ALS|IST NIEDRIGER ALS|IST KÜRZER ALS|IST GRÖßER ODER GLEICH|IST MEHR ALS ODER GLEICH|IST KLEINER ODER GLEICH|IST WENIGER ALS ODER GLEICH|ENTHÄLT ALLES|IST EINS VON|IST KEINES VON|IST ENTHALTEN IN|IST VORHANDEN|IST NICHT VORHANDEN|IST|ALS|KLEINER|GRÖßER|GERINGER|WENIGER/,
                            'keyword'],
                            [/Alter|Name|Ort|Berufserfahrung|Jahresbruttogehalt|Kuendigungsfrist|Kreditpunkte/, "variable"],
                            [/KOMMENTAR(.*)/m, "comment"],
                            [/0[xX][0-9a-fA-F]+\\b/, "constant.numeric"],
                            [/[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b/, "constant.numeric"],
                            [/(?:ja|nein)\\b/, 'constant.language.boolean']
                        ]
                    }
                };
        }
        

        // defines color of the defined languages
        monaco.editor.defineTheme('ovlTheme', {
            base: 'vs',
            inherit: false,
            rules: [
                { token: 'keyword', foreground: '8e8e8e', fontStyle: 'bold' },
                { token: 'variable', foreground: '0000ff', fontStyle: 'bold' },
                { token: 'comment', foreground: '608b4e', fontStyle: 'bold' },
                { token: 'constant.numeric', foreground: 'b5cea8', fontStyle: 'bold' },
                { token: 'language.boolean', foreground: '0000ff', fontStyle: 'bold' },
            ],
            colors: {}
        });
    }
}