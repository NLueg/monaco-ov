export enum EndOfLineState {
    None,
    InMultiLineComment
}

export enum TokenClass {
    Punctuation = 0,
    Keyword = 1,
    Operator = 2,
    Comment = 3,
    Whitespace = 4,
    Identifier = 5,
    NumberLiteral = 6,
    StringLiteral = 7,
    RegExpLiteral = 8,
}

const TokenClassString = new Map<number, string>(
    [
        [TokenClass.Keyword, "keyword"],
        [TokenClass.Operator,"operator"],
        [TokenClass.Punctuation,"punctuation"],
        [TokenClass.NumberLiteral,"numberLiteral"],
        [TokenClass.StringLiteral, "text"],
        [TokenClass.Comment,"comment"],
        [TokenClass.Whitespace,"whiteSpace"],
        [TokenClass.Identifier,"identifier"]
    ]
);

export function getTokenStringByTokenClass(params : TokenClass) : string {
    var returnValue = TokenClassString.get(params);
    
    if (returnValue == undefined)
        return "";
    return returnValue;
}