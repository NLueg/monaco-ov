import { EndOfLineState, TokenClass } from "../monaco-configuration/Enums";

export class Classifier {
    public static validate(classificationRules: [RegExp, TokenClass][], line: string, lexState: EndOfLineState): ClassificationResult {
        var entries: ClassificationInfo[] = [];

        //TODO:  Highlight the Text after "DANN" in another color, same as an String-Operator
        var wordList = line.split(/(\s+)/);
        var previousClassification: TokenClass =
            (lexState === EndOfLineState.InMultiLineComment && line.trim() !== "")
                ? TokenClass.Comment    // Multiline Comment
                : TokenClass.Punctuation;      // Default

        wordList.forEach(word => {
            //Comments are in the whole line
            if (previousClassification === TokenClass.Comment) {
                entries.push({
                    length: word.length,
                    classification: previousClassification
                });
            } else {
                var matchingRule = classificationRules.filter(tuple => tuple[0].exec(word))[0];

                if (matchingRule !== undefined) {
                    var classification = matchingRule[1];

                    if (classification !== null) {
                        entries.push({
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
            : EndOfLineState.None;

        return {
            endOfLineState: lastState,
            entries: entries
        };
    }

    public static async getClassificationRules(): Promise<[RegExp, TokenClass][]> {
        var dynamicRules: [RegExp, TokenClass][] = await this.getDynamicRules();
        return dynamicRules.concat(this.staticRules);
    }

    private static staticRules: [RegExp, TokenClass][] = [
        [/[0-9]+.[0-9]*/, TokenClass.NumberLiteral],
        [/[ ^$]/, TokenClass.Whitespace],
        [/[a-zA-Z]/, TokenClass.Punctuation]
    ];

    private static async getDynamicRules(): Promise<[RegExp, TokenClass][]> {
        //TODO: How to get prevoiusly generated rules
        try {
            // var apiProxy = new ApiProxy();
            // var response = await apiProxy.getData();

            // if (response == null ||
            //     response.data == null)
            //     throw Error("Response of Dynamic Rules is empty");

            // var dynamicRules: [RegExp, TokenClass][] = []

            // for (let index = 0; index < response.data.length; index++) {
            //     const element = response.data[index];
            //     dynamicRules.push([new RegExp(element[0]), element[1]]);
            // }

            // return dynamicRules;

            return [];

        } catch (err) {
            console.log(err);
            return [];
        }
    }
}

export interface ClassificationResult {
    endOfLineState: EndOfLineState;
    entries: ClassificationInfo[];
}

export interface ClassificationInfo {
    length: number;
    classification: TokenClass;
}