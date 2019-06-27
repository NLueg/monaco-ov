'use strict';

import { OvlTokenProvider } from "./OvlTokenProvider";
import { TokenClass } from "../monaco-configuration/enums";

export async function createTokenizationSupport(classifiers : [string, TokenClass][]): Promise<monaco.languages.TokensProvider> {
	return new OvlTokenProvider(getRegEx(classifiers));
}

function getRegEx(stringList : [string,TokenClass][]) : [RegExp, TokenClass][] {
	var returnList : [RegExp, TokenClass][] = [];

	stringList.forEach((element) => {
		returnList.push([new RegExp(element[0]), element[1]]);
	});

	console.log(returnList);
	return returnList;
}