/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { EndOfLineState, TokenClass, getTokenStringByTokenClass } from "./enums";
import { createClassifier, Classifier } from "./classifier";

export function createTokenizationSupport(): monaco.languages.TokensProvider {
	var classifier = createClassifier();

	return {
		getInitialState: () => new State(EndOfLineState.None, false),
		tokenize: (line, state) => tokenize(classifier, <State>state, line)
	};
}


var bracketTypeTable: INumberStringDictionary = Object.create(null);
bracketTypeTable['('.charCodeAt(0)] = 'delimiter.parenthesis.js';
bracketTypeTable[')'.charCodeAt(0)] = 'delimiter.parenthesis.js';
bracketTypeTable['{'.charCodeAt(0)] = 'delimiter.bracket.js';
bracketTypeTable['}'.charCodeAt(0)] = 'delimiter.bracket.js';
bracketTypeTable['['.charCodeAt(0)] = 'delimiter.array.js';
bracketTypeTable[']'.charCodeAt(0)] = 'delimiter.array.js';

class State implements monaco.languages.IState {

	public eolState: EndOfLineState;
	public inJsDocComment: boolean;

	constructor(eolState: EndOfLineState, inJsDocComment: boolean) {
		this.eolState = eolState;
		this.inJsDocComment = inJsDocComment;
	}

	public clone(): State {
		return new State(this.eolState, this.inJsDocComment);
	}

	public equals(other: monaco.languages.IState): boolean {
		if (other === this) {
			return true;
		}
		if (!other || !(other instanceof State)) {
			return false;
		}
		if (this.eolState !== (<State>other).eolState) {
			return false;
		}
		if (this.inJsDocComment !== (<State>other).inJsDocComment) {
			return false;
		}
		return true;
	}
}


function appendToken(startIndex: number, type: string, ret: monaco.languages.ILineTokens): void {
	if (ret.tokens.length === 0 || ret.tokens[ret.tokens.length - 1].scopes !== type) {
		ret.tokens.push({
			startIndex: startIndex,
			scopes: type
		});
	}
}

function tokenize(classifier: Classifier, state: State, text: string): monaco.languages.ILineTokens {

	// Create result early and fill in tokens
	var ret = {
		tokens: <monaco.languages.IToken[]>[],
		endState: new State(EndOfLineState.None, false)
	};

	var result = classifier.getClassificationsForLine(text, state.eolState),
		offset = 0;

	ret.endState.eolState = result.endOfLineState;
	ret.endState.inJsDocComment = result.endOfLineState === EndOfLineState.InMultiLineComment && (state.inJsDocComment || /\/\*\*.*$/.test(text));

	for (let entry of result.entries) {

		if (entry.classification === TokenClass.Comment) {
			// comments: check for JSDoc, block, and line comments
			if (ret.endState.inJsDocComment || /\/\*\*.*\*\//.test(text.substr(offset, entry.length))) {
				appendToken(offset, getTokenStringByTokenClass(TokenClass.Comment), ret);
			} else {
				appendToken(offset, getTokenStringByTokenClass(TokenClass.Comment), ret);
			}
		} else {
			appendToken(offset, getTokenStringByTokenClass(entry.classification), ret);
		}

		offset += entry.length;
	}

	return ret;
}

interface INumberStringDictionary {
	[idx: number]: string;
}
