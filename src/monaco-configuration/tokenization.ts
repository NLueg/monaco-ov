/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { createClassifier } from "./Classifier";
import { OwnTokensProvider } from "./OwnTokensProvider";

export async function createTokenizationSupport(): Promise<monaco.languages.TokensProvider> {
	var classifier = createClassifier();
	var classifiers = await classifier.getClassificationRules();

	return new OwnTokensProvider(classifiers);
}
