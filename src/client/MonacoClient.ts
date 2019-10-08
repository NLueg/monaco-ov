import { ContentEnum, ContentManager } from '../ContentManager';

export class MonacoClientCreator {

    /**
     * Creates the main-editor for openVALDATION
     *
     * @static
     * @returns {Promise<monaco.editor.IStandaloneCodeEditor>} the created editor
     * @memberof MonacoClient
     */
    public static async createOvlEditor(): Promise<monaco.editor.IStandaloneCodeEditor> {
        return monaco.editor.create(document.getElementById('monaco-editor')!, {
            model: monaco.editor.createModel(ContentManager.getValue(ContentEnum.Code), 'ov', monaco.Uri.parse('inmemory://model.ov')),
            theme: 'vs-dark',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            },
            fixedOverflowWidgets: true,
            wordBasedSuggestions: false
        });
    }

    /**
     * Created the monaco editor for the output of the parsing-process
     *
     * @static
     * @returns {Promise<monaco.editor.IStandaloneCodeEditor>} the created editor
     * @memberof MonacoClient
     */
    public static async createOutputEditor(): Promise<monaco.editor.IStandaloneCodeEditor> {
        return monaco.editor.create(document.getElementById('generated-code')!, {
            model: monaco.editor.createModel('', 'java', monaco.Uri.parse('inmemory://model.java')),
            theme: 'vs',
            readOnly: true,
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            },
            fixedOverflowWidgets: true,
            wordBasedSuggestions: false
        });
    }

    /**
     * Created the monaco editor for the schema-definition for openVALIDATION
     *
     * @static
     * @returns {Promise<monaco.editor.IStandaloneCodeEditor>} the created editor
     * @memberof MonacoClient
     */
    public static async createSchemaEditor(): Promise<monaco.editor.IStandaloneCodeEditor> {
        return monaco.editor.create(document.getElementById('schema-definition')!, {
            model: monaco.editor.createModel(ContentManager.getValue(ContentEnum.Schema), 'yaml', monaco.Uri.parse('inmemory://schemaDefinition.yaml')),
            theme: 'vs-dark',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            },
            fixedOverflowWidgets: true,
            wordBasedSuggestions: false
        });
    }
}
