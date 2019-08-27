export class MonacoClientCreator {

    /**
     * Creates the main-editor for openVALDATION
     *
     * @static
     * @returns {Promise<monaco.editor.IStandaloneCodeEditor>} the created editor
     * @memberof MonacoClient
     */
    public static async createOvlEditor(): Promise<monaco.editor.IStandaloneCodeEditor> {
        var initialValue = `Wenn das Alter des Bewerbers kleiner 18 ist
Dann Sie müssen mindestens 18 Jahre alt sein

    das Alter des Bewerbers ist kleiner 18
Als Minderjährig

Wenn der Bewerber Minderjährig ist
    und sein Wohnort ist nicht Dortmund
Dann Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen

Wenn der Bewerber Minderjährig ist
    oder seine Berufserfahrung ist kürzer als 5 Jahre 
Dann Sie müssen mindestens 18 Jahre alt sein und über eine Berufserfahrung
        von minimum 5 Jahren verfügen

Kommentar Dies ist ein Kommentar
            Und hier auch...

    Summe von Einkaufsliste.Preis
Als Ausgaben

das Alter des Bewerbers muss mindestens 18 sein

    ( 20 - 18 ) * 12
Als Berufserfahrung in Monaten


`;

        // Der Bewerber DARF NICHT JÜNGER als 18 sein

        //     ( 20 - 18 ) * 12
        // ALS Berufserfahrung in Monaten

        var editor = monaco.editor.create(document.getElementById("monaco-editor")!, {
            model: monaco.editor.createModel(initialValue, 'ov', monaco.Uri.parse('inmemory://model.ov')),
            theme: 'vs-dark',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            },
            fixedOverflowWidgets: true,
            wordBasedSuggestions: false
        });

        return editor;
    }


    /**
     * Created the monaco editor for the output of the parsing-process
     *
     * @static
     * @returns {Promise<monaco.editor.IStandaloneCodeEditor>} the created editor
     * @memberof MonacoClient
     */
    public static async createOutputEditor(): Promise<monaco.editor.IStandaloneCodeEditor> {
        var editor = monaco.editor.create(document.getElementById("generated-code")!, {
            model: monaco.editor.createModel("", 'java', monaco.Uri.parse('inmemory://model.java')),
            theme: 'vs-dark',
            readOnly: true,
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            },
            fixedOverflowWidgets: true,
            wordBasedSuggestions: false
        });

        return editor;
    }

    /**
     * Created the monaco editor for the schema-definition for openVALIDATION
     *
     * @static
     * @returns {Promise<monaco.editor.IStandaloneCodeEditor>} the created editor
     * @memberof MonacoClient
     */
    public static async createSchemaEditor(): Promise<monaco.editor.IStandaloneCodeEditor> {
        var valueSchema = `Name: Satoshi 
Alter: 25 
Wohnort: Dortmund
Berufserfahrung: 5
Einkaufsliste: 
    Preis: 10`;
        var editor = monaco.editor.create(document.getElementById("schema-definition")!, {
            model: monaco.editor.createModel(valueSchema, 'yaml', monaco.Uri.parse('inmemory://schemaDefinition.yaml')),
            theme: 'vs-dark',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            },
            fixedOverflowWidgets: true,
            wordBasedSuggestions: false
        });

        return editor;
    }
}