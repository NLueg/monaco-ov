// /*
//  * Copyright (C) 2017 TypeFox and others.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
//  */
// /*---------------------------------------------------------------------------------------------
//  *  Copyright (c) Microsoft Corporation. All rights reserved.
//  *  Licensed under the MIT License. See License.txt in the project root for license information.
//  *--------------------------------------------------------------------------------------------*/

// // copied from https://github.com/Microsoft/monaco-typescript/tree/v2.3.0 and only slightly modified (imports and linting)

// 'use strict';

// // import * as axios from 'axios';

// export function createTokenizationSupport(): monaco.languages.TokensProvider {
// 	return {
// 		getInitialState: () => new State(null),
// 		tokenize: (line, state) => tokenize(<State>state, line)
// 	};
// }

// class State implements monaco.languages.IState {
// 	public eolState: any;

// 	constructor(public previous: monaco.languages.IState | null) {	}

// 	public getPreviousState() {
// 		return this.previous;
// 	}

// 	public clone(): State {
//     	return new State(this.previous);
//   	}

// 	public equals(other: monaco.languages.IState): boolean {
// 		if (other === this) {
// 			return true;
// 		}
// 		if (!other || !(other instanceof State)) {
// 			return false;
// 		}
// 		if (this.eolState !== (<State>other).eolState) {
// 			return false;
// 		}
// 		return true;
// 	}
// }

// function tokenize(state: State, line: string): monaco.languages.ILineTokens {

// 	// Create result early and fill in tokens
// 	var ret = {
// 		tokens: <monaco.languages.IToken[]>[],
// 		endState: state.clone()
// 	};

// 	// var something = generate(line, "{Alter: 23}", "en", "java").then(response => {
// 	// 	console.log(response);
// 	// });

// 	var wordList = line.trim().split(' ');
// 	var offset = 0;
// 	for (let index = 0; index < wordList.length; index++) {
// 		const word = wordList[index];
// 		offset += word.length + 1;

// 		const ruleType = getNameOfFittingRule(word);
		
// 		ret.endState = ret.endState.clone();
// 		ret.tokens.push({
// 			startIndex: offset,
// 			scopes: ruleType
// 		});
// 	}

// 	return ret;
// }

// function getNameOfFittingRule(expression : string) : string {
// 	for (let index = 0; index < rules.length; index++) {
// 		const element = rules[index];
		
// 		if (element[0].exec(expression)) {
// 			return element[1];
// 		}
// 	}

// 	return "";
// }

// var rules : [RegExp, string][] = [
// 	[/WENN|UND|ODER|DANN|LÄNGER ALS|OPERAND|OPERATOR|KÜRZER ALS|DARF NICHT|HÖHER ALS|NIEDRIGER ALS|NIEDRIGER IST ALS|HÖHER IST ALS|GRÖßER IST ALS|KLEINER ALS|GRÖßER ALS|GERINGER IST ALS|IST GLEICH|IST UNGLEICH|IST KEIN|IST EIN|IST NICHT|IST GRÖßER ALS|IST MEHR ALS| IST HÖHER ALS|IST LÄNGER ALS|IST KLEINER ALS|IST WENIGER ALS|IST NIEDRIGER ALS|IST KÜRZER ALS|IST GRÖßER ODER GLEICH|IST MEHR ALS ODER GLEICH|IST KLEINER ODER GLEICH|IST WENIGER ALS ODER GLEICH|ENTHÄLT ALLES|IST EINS VON|IST KEINES VON|IST ENTHALTEN IN|IST VORHANDEN|IST NICHT VORHANDEN|IST|ALS|KLEINER|GRÖßER|GERINGER|WENIGER/, 'keyword'],
// 	[/Kreditpunkte/, "variable"],
// 	[/KOMMENTAR(.*)/m, "comment"],
// 	[/[\d.]*/, "constant.numeric"],
// 	[/(?:ja|nein)\\b/, 'constant.language.boolean']
// ];

// // var API_URL = "http://api.openvalidation.io";

// // function generate(rule : string, schema : string, culture : string, language : string) {
// // 	return axios.default.post(API_URL, {
// // 		"rule": "the age of the applicant MUST be AT LEAST 18",
// // 		"schema": "{age:0}",
// // 		"culture": "en",
// // 		"language": "Java"
// // 	});
// // }
