/**
 * Enum that defines the content that needs to be saved with the contentManager
 *
 * @export
 * @enum {number}
 */
export enum ContentEnum {
    Schema = 'ov-language-schema',
    Code = 'ov-language-code'
}

/**
 * This class is used for the publishing/saving of the openVALIDATION-Code and the schema.
 * It currently uses the sessionStorage to provide basic saving.
 *
 * @export
 * @class ContentManager
 */
export class ContentManager {

    public static getValue(content: ContentEnum): string {
        const storageItem: string | null = this.storage.getItem(content);
        if (!storageItem) { return this.default(content); }

        return storageItem;

    }

    public static setValue(content: ContentEnum, value: string): void {
        this.storage.setItem(content, value);
    }

    /**
     * Defines the storage we want to use for saving the values.
     *
     * @private
     * @static
     * @type {Storage}
     * @memberof ContentManager
     */
    private static storage: Storage = sessionStorage;

    private static default(content: ContentEnum): string {
        switch (content) {
            case ContentEnum.Code:
                return `Wenn das Alter des Bewerbers kleiner 18 ist
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
            case ContentEnum.Schema:
                return `Name: Satoshi
Alter: 25
Wohnort: Dortmund
Berufserfahrung: 5
Einkaufsliste:
    Preis: 10`;
            default:
                return '';
        }
    }
}
