import { EndOfLineState, TokenClass } from "./enums";

export function createClassifier(): Classifier {
    return new Classifier();
}

export class Classifier {
    public getClassificationsForLine(line: string, lexState: EndOfLineState): ClassificationResult {
        var entries: ClassificationInfo[] = [];
        var classificationRules = getClassificationRules();

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

function getClassificationRules(): [RegExp, TokenClass][] {
    return getDynamicRules().concat(staticRules);
}

function getDynamicRules(): [RegExp, TokenClass][] {

    //TODO: Get Aliases via REST and convert them into our data structure

    return [
        [/WENN|UND|ODER|DANN|LÄNGER ALS|OPERAND|OPERATOR|KÜRZER ALS|DARF NICHT|HÖHER ALS|NIEDRIGER ALS|NIEDRIGER IST ALS|HÖHER IST ALS|GRÖßER IST ALS|KLEINER ALS|GRÖßER ALS|GERINGER IST ALS|IST GLEICH|IST UNGLEICH|IST KEIN|IST EIN|IST NICHT|IST GRÖßER ALS|IST MEHR ALS| IST HÖHER ALS|IST LÄNGER ALS|IST KLEINER ALS|IST WENIGER ALS|IST NIEDRIGER ALS|IST KÜRZER ALS|IST GRÖßER ODER GLEICH|IST MEHR ALS ODER GLEICH|IST KLEINER ODER GLEICH|IST WENIGER ALS ODER GLEICH|ENTHÄLT ALLES|IST EINS VON|IST KEINES VON|IST ENTHALTEN IN|IST VORHANDEN|IST NICHT VORHANDEN|IST|ALS|KLEINER|GRÖßER|GERINGER|WENIGER/,
            TokenClass.Keyword],
        [/Alter|Name|Ort|Berufserfahrung|Jahresbruttogehalt|Kuendigungsfrist|Kreditpunkte/, TokenClass.Variable],
        [/KOMMENTAR(.*)/m, TokenClass.Comment],
        [/(?:ja|nein)\\b/, TokenClass.BooleanLiteral]
    ]
}

export interface ClassificationResult {
    endOfLineState: EndOfLineState;
    entries: ClassificationInfo[];
}

export interface ClassificationInfo {
    length: number;
    classification: TokenClass;
}