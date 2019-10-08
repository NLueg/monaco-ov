export class MonacoOvConfiguration {

	/**
 * Registers openVALIDATION as a language to monaco
 *
 * @static
 * @memberof MonacoOvConfiguration
 */
	public static setOvLanguageSupport() {
		monaco.languages.register({
			id: 'ov',
			extensions: ['.ov'],
			aliases: ['OV', 'ov', 'openVALIDATION'],
		});
	}
}