import { MonacoOvlConfiguration } from "../monaco-configuration/MonacoOvlConfiguration";

export class MonacoClient {
    public static createEditor() : monaco.editor.IStandaloneCodeEditor {
        MonacoOvlConfiguration.setConfiguration();

        return monaco.editor.create(document.getElementById("monaco-editor")!, {
            model: monaco.editor.createModel(this.initialValue, 'ovl', monaco.Uri.parse('inmemory://model.ovl')),
            theme: 'ovlTheme',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            }
        });
    }

    // create Monaco editor
    private static initialValue = `WENN das Alter des Bewerbers KLEINER 18 ist
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

    SUMME VON Einkaufsliste.Preis
ALS Ausgaben

    das Alter des Bewerbers ist KLEINER 18
ALS Minderjährig

das Alter des Bewerbers MUSS MINDESTENS 18 sein

    ( 20 - 18 ) * 12
ALS Berufserfahrung in Monaten

    OPERAND  Alter
OPERATOR  KLEINER
        ALS  JÜNGER

`;
    // die Ausgaben DÜRFEN NICHT das Budget von 20 € ÜBERSTEIGEN

    // Der Bewerber DARF NICHT JÜNGER als 18 sein
}