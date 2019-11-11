/**
 * Enum that defines the content that needs to be saved with the contentManager
 *
 * @export
 * @enum {number}
 */
export enum ContentEnum {
  Schema = "ov-language-schema",
  Code = "ov-language-code"
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
    if (!storageItem) {
      return this.default(content);
    }

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
        return `Wenn die Kreditpunkte des Studenten kleiner als 120 sind
Dann die Anmeldung der Bachelorarbeit verlangt 120 Kreditpunkte

Wenn der Laufzettel nicht ausgefülllt wurde
    und die Kreditpunkte des Studenten kleiner als 120 sind
        oder das Fachsemester kleiner als 5 ist
Dann die Anmeldung der Bachelorarbeit ist nicht möglich

Wenn der Student unqualifiziert ist
Dann die Anmeldung der Bachelorarbeit verlangt mindestens 120 Kreditpunkte

Kommentar Das ist ein Kommentar
            ... über mehrere Zeilen

    Kreditpunkte des Studenten kleiner 120
Als Unqualifiziert
        

`;
      case ContentEnum.Schema:
        return `Kreditpunkte: 120
Laufzettel: True
Fachsemester: 5`;
      default:
        return "";
    }
  }
}
