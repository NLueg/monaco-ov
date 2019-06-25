import { EndOfLineState } from "./enums";

export class TokenizationState implements monaco.languages.IState {
    public eolState: EndOfLineState;
    public inJsDocComment: boolean;
    constructor(eolState: EndOfLineState, inJsDocComment: boolean) {
        this.eolState = eolState;
        this.inJsDocComment = inJsDocComment;
    }
    public clone(): TokenizationState {
        return new TokenizationState(this.eolState, this.inJsDocComment);
    }
    public equals(other: monaco.languages.IState): boolean {
        if (other === this) {
            return true;
        }
        if (!other || !(other instanceof TokenizationState)) {
            return false;
        }
        if (this.eolState !== (<TokenizationState>other).eolState) {
            return false;
        }
        if (this.inJsDocComment !== (<TokenizationState>other).inJsDocComment) {
            return false;
        }
        return true;
    }
}
