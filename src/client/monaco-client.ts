import { MonacoConfiguration } from "../monaco-configuration/configuration";

export namespace MonacoClient {
    MonacoConfiguration.setConfiguration();

    // create Monaco editor
    const value = `WENN das Alter des Bewerbers KLEINER 18 ist
DANN Sie müssen mindestens 18 Jahre alt sein

    das Alter des Bewerbers ist KLEINER 18
ALS  Minderjährig

WENN der Bewerber Minderjährig ist
 UND sein Wohnort ist NICHT Dortmund
DANN Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen
`;


    // WENN der Bewerber Minderjährig ist
    //  ODER seine Berufserfahrung ist KÜRZER als 5 Jahre
    // DANN Sie müssen mindestens 18 Jahre alt sein und über eine Berufserfahrung
    // 	 von minimum 5 Jahren verfügen

    // KOMMENTAR Dies ist ein Kommentar
    // 		  Und hier auch...

    // 	SUMME VON Einkaufsliste.Preis
    // ALS Ausgaben

    // die Ausgaben DÜRFEN NICHT das Budget von 20 € ÜBERSTEIGEN

    // 	das Alter des Bewerbers ist KLEINER 18
    // ALS Minderjährig

    // das Alter des Bewerbers MUSS MINDESTENS 18 sein

    // 	( 20 - 18 ) * 12
    // ALS Berufserfahrung in Monaten

    //  OPERAND  Alter
    // OPERATOR  KLEINER
    // 	 ALS  JÜNGER

    // Der Bewerber DARF NICHT JÜNGER als 18 sein

    export const editor = monaco.editor.create(document.getElementById("container")!, {
        model: monaco.editor.createModel(value, 'ovl', monaco.Uri.parse('inmemory://model.json')),
        theme: 'ovlTheme',
        glyphMargin: true,
        lightbulb: {
            enabled: true
        }
    });
}