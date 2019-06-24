import { EndOfLineState, TokenClass } from "./enums";
import { ApiProxy } from "src/rest-interface/ApiProxy";

export function createClassifier(): Classifier {
    return new Classifier();
}

export class Classifier {
    public async getClassificationsForLine(line: string, lexState: EndOfLineState): Promise<ClassificationResult> {
        var entries: ClassificationInfo[] = [];
        var classificationRules = await getClassificationRules();

        //TODO:  Highlight the Text after "DANN" in another color, same as an String-Operator

        var wordList = line.split(/(\s+)/);
        var previousClassification : TokenClass = 
            (lexState === EndOfLineState.InMultiLineComment && line.trim() !== "")
                ? TokenClass.Comment    // Multiline Comment
                : TokenClass.Text;      // Default

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

                    if (matchingRule !== null) {
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
}

const staticRules: [RegExp, TokenClass][] = [
    [/[0-9]+.[0-9]*/, TokenClass.NumberLiteral],
    [/[ ^$]/, TokenClass.WhiteSpace],
    [/[a-zA-Z]/, TokenClass.Text]
];

async function getClassificationRules(): Promise<[RegExp, TokenClass][]> {
    var dynamicRules = await getDynamicRules();
    var dynamicRules : [RegExp, TokenClass][] = [];
    return dynamicRules.concat(staticRules);
}

async function getDynamicRules(): Promise<[RegExp, TokenClass][]> {
    var apiProxy = new ApiProxy();
    var response = await apiProxy.getData();
    return response.data;
}

export interface ClassificationResult {
    endOfLineState: EndOfLineState;
    entries: ClassificationInfo[];
}

export interface ClassificationInfo {
    length: number;
    classification: TokenClass;
}