import { EndOfLineState, TokenClass } from "../monaco-configuration/Enums";

export class Classifier {
    public static validate(classificationRules: [RegExp, TokenClass][], line: string, lexState: EndOfLineState): ClassificationResult {
        var entries: ClassificationInfo[] = [];

        //TODO:  Highlight the Text after "DANN" in another color, same as an String-Operator
        var wordList = line.split(/(\s+)/);
        var previousClassification: TokenClass =
            (lexState === EndOfLineState.InMultiLineComment && line.trim() !== "")
                ? TokenClass.Comment        // Multiline Comment
                : TokenClass.Punctuation;   // Default //TODO: Enable Multi line string (for DANN ...)

        wordList.forEach(word => {
            //Comments are in the whole line
            if (previousClassification === TokenClass.Comment) {
                entries.push({
                    start: line.indexOf(word),
                    length: word.length,
                    classification: previousClassification
                });
            } else {
                var matchingRule = classificationRules.filter(tuple => tuple[0].exec(word))[0];

                if (matchingRule !== undefined) {
                    var classification = matchingRule[1];

                    if (classification !== null) {
                        entries.push({
                            start: line.indexOf(word),
                            length: word.length,
                            classification: classification
                        });

                        previousClassification = classification;
                    }
                }
            }
        });

        var lastState = String(previousClassification) === String(TokenClass.Comment)
            ? EndOfLineState.InMultiLineComment
            : String(previousClassification) === String(TokenClass.StringLiteral)
                ? EndOfLineState.InMultilineString
                : EndOfLineState.None;

        return {
            endOfLineState: lastState,
            entries: entries
        };
    }

    // private static staticRules: [RegExp, TokenClass][] = [
    //     [/[0-9]+.[0-9]*/, TokenClass.NumberLiteral],
    //     [/[ ^$]/, TokenClass.Whitespace],
    //     [/[a-zA-Z]/, TokenClass.Punctuation]
    // ];
}

export interface ClassificationResult {
    endOfLineState: EndOfLineState;
    entries: ClassificationInfo[];
}

export interface ClassificationInfo {
    start: number;
    length: number;
    classification: TokenClass;
}