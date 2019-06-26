'use strict';

import { Classifier } from "./Classifier";
import { OvlTokenProvider } from "./OvlTokenProvider";

export async function createTokenizationSupport(): Promise<monaco.languages.TokensProvider> {
	var classifiers = await Classifier.getClassificationRules();
	return new OvlTokenProvider(classifiers);
}
