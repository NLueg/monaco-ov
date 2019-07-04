export class MonacoClientCreator {

    /**
     * Creates the main-editor for openVALDATION
     *
     * @static
     * @returns {Promise<monaco.editor.IStandaloneCodeEditor>} the created editor
     * @memberof MonacoClient
     */
    public static async createOvlEditor(): Promise<monaco.editor.IStandaloneCodeEditor> {
        var initialValue = `WENN das Alter des Bewerbers KLEINER 18 ist
DANN Sie müssen mindestens 18 Jahre alt sein

    das Alter des Bewerbers ist KLEINER 18
ALS  Minderjährig

WENN der Bewerber Minderjährig ist
    UND sein Wohnort ist NICHT Dortmund
DANN Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen

WENN der Bewerber Minderjährig ist
    ODER seine Berufserfahrung ist KÜRZER als 5 Jahre
DANN Sie müssen mindestens 18 Jahre alt sein und über eine Berufserfahrung
        von minimum 5 Jahren verfügen

KOMMENTAR Dies ist ein Kommentar
            Und hier auch...

            `;
//     SUMME VON Einkaufsliste.Preis
// ALS Ausgaben

// das Alter des Bewerbers MUSS MINDESTENS 18 sein

//     ( 20 - 18 ) * 12
// ALS Berufserfahrung in Monaten

//     OPERAND  Alter
// OPERATOR  KLEINER
//         ALS  JÜNGER

// die Ausgaben DÜRFEN NICHT das Budget von 20 € ÜBERSTEIGEN

// Der Bewerber DARF NICHT JÜNGER als 18 sein 
        var editor = monaco.editor.create(document.getElementById("monaco-editor")!, {
            model: monaco.editor.createModel(initialValue, 'ov', monaco.Uri.parse('inmemory://model.ov')),
            theme: 'vs-dark',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            }
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
        var valueCode = `huml.appendRule("",
["name"],
"your name HAS to be Validaria",
function(model) { 
    return huml.NOT_EQUALS(model.name, "Validaria");
},
false
);`;
        var editor = monaco.editor.create(document.getElementById("generated-code")!, {
            model: monaco.editor.createModel(valueCode, 'java', monaco.Uri.parse('inmemory://model.java')),
            theme: 'vs-dark',
            readOnly: true,
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            }
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
        var valueSchema = `Name: Satoshi \nAlter: 25 \nOrt: Dortmund`;
        var editor = monaco.editor.create(document.getElementById("schema-definition")!, {
            model: monaco.editor.createModel(valueSchema, 'yaml', monaco.Uri.parse('inmemory://model.yaml')),
            theme: 'vs-dark',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            }
        });

        return editor;
    }
}