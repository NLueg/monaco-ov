export enum EndOfLineState {
    None,
    InMultiLineComment
}

export enum TokenClass {
    Variable,
    Keyword,
    Operator,
    Punctuation,
    BooleanLiteral,
    NumberLiteral,
    StringLiteral,
    Comment,
    WhiteSpace,
    Text
}

const TokenClassString = new Map<number, string>(
    [
        [TokenClass.Variable, "identifier"],
        [TokenClass.Keyword, "keyword"],
        [TokenClass.Operator,"operator"],
        [TokenClass.Punctuation,"punctuation"],
        [TokenClass.BooleanLiteral,"booleanLiteral"],
        [TokenClass.NumberLiteral,"numberLiteral"],
        [TokenClass.StringLiteral,"stringLiteral"],
        [TokenClass.Comment,"comment"],
        [TokenClass.WhiteSpace,"whiteSpace"],
        [TokenClass.Text, "text"]
    ]
);

export function getTokenStringByTokenClass(params : TokenClass) : string {
    var returnValue = TokenClassString.get(params);

    if (returnValue == undefined)
        return "";
    return returnValue;
} 