import {Range} from 'monaco-editor/monaco';
import { SemanticHighlightingService, SemanticHighlightingRange } from "./semantic-highlighting-service";
import { Disposable } from "monaco-languageclient/lib/monaco-language-client";
import { TextDocument, TextDocumentContentChangeEvent } from "vscode-languageserver";
import URI from 'vscode-uri';

/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/


/**
 * A helper class for grouping information about a decoration type that has
 * been registered with the editor service.
 */
class DecorationTypeInfo {
    key: string | undefined;
    options: monaco.editor.IModelDecorationOptions | undefined;
}

export class MonacoSemanticHighlightingService extends SemanticHighlightingService {
    // @inject(EditorManager)
    // protected readonly editorManager: EditorManager;

    protected readonly decorations = new Map<string, DecorationWithRanges>();
    protected readonly toDisposeOnEditorClose = new Map<string, Disposable>();

    async decorate(uri: URI, ranges: SemanticHighlightingRange[]): Promise<void> {
        const editor = await this.editor(uri);
        if (!editor) {
            return;
        }

        const key = uri.toString();
        if (!this.toDisposeOnEditorClose.has(key)) {
            this.toDisposeOnEditorClose.set(key, new DisposableCollection(
                editor.onDispose(() => this.deleteDecorations(key, editor)),
                editor.onDocumentContentChanged(this.documentContentChanged.bind(this))
            ));
        }
        // XXX: Why cannot TS infer this type? Perhaps `EditorDecorationOptions` has only optional properties. Just guessing though.
        const newDecorations: EditorDecoration[] = ranges.map(this.toDecoration.bind(this));
        const newState = editor.deltaDecorations({
            newDecorations,
            oldDecorations: []
        });

        // Cache the new state.
        this.decorations.set(key, {
            ranges,
            decorations: newState
        });
    }

    dispose(): void {
        Array.from(this.toDisposeOnEditorClose.values()).forEach(disposable => disposable.dispose());
    }

    protected async editor(uri: string | URI): Promise<MonacoEditor | undefined> {
        const editorWidget = await this.editorManager.getByUri(typeof uri === 'string' ? new URI(uri) : uri);
        if (!!editorWidget && editorWidget.editor instanceof MonacoEditor) {
            return editorWidget.editor;
        }
        return undefined;
    }

    protected async model(uri: string | URI): Promise<ITextModel | undefined> {
        const editor = await this.editor(uri);
        if (editor) {
            return editor.getControl().getModel();
        }
        return undefined;
    }

    /**
     * Returns with a range between `from` and `to`: `[from, from + 1, ..., to - 1, to]`.
     * - `from` can be greater than `to`. If so, the arguments will be swapped internally and you still get back `[to, to + 1, ..., from -1, from]`
     * - If `from` and `to` are the same, returns with a single element range: `[from]`.
     */
    protected rangeOf(from: number, to: number): number[] {
        const max = Math.max(from, to);
        const min = Math.min(from, to);
        const range: number[] = [];
        for (let i = min; i <= max; i++) {
            range.push(i);
        }
        return range;
    }

    /**
     * We do not get delta notification from the LS if lines were deleted and new semantic highlighting positions were introduced.
     * We need to track deletion here and get rid of the affected markers manually. Note, deletion can be an insert edit where the
     * replaced content is "less" than the original content.
     */
    protected async documentContentChanged(event: TextDocumentChangeEvent): Promise<void> {
        const editor = await this.editor(event.document.uri);
        if (editor) {
            const model = editor.getControl().getModel();
            const affectedLines = Array.from(new Set(event.contentChanges
                .filter(change => change.text.length === 0)
                .map(change => [change.range.start.line, change.range.end.line])
                .map(([from, to]) => this.rangeOf(from, to))
                .reduce((prev, curr) => prev.concat(curr), [])));
            const oldDecorations = Array.from(affectedLines)
                .map(line => model.getLineDecorations(line + 1, undefined, true)) // p2m
                .reduce((prev, curr) => prev.concat(curr), [])
                .map(decoration => decoration.id);
            editor.deltaDecorations({
                newDecorations: [],
                oldDecorations
            });
        }
    }

    protected deleteDecorations(uri: string, editor: MonacoEditor): void {
        const decorationWithRanges = this.decorations.get(uri);
        if (decorationWithRanges) {
            const oldDecorations = decorationWithRanges.decorations;
            editor.deltaDecorations({
                newDecorations: [],
                oldDecorations
            });
            this.decorations.delete(uri);
        }
        const disposable = this.toDisposeOnEditorClose.get(uri);
        if (disposable) {
            disposable.dispose();
        }
        this.toDisposeOnEditorClose.delete(uri);
    }

    protected toDecoration(range: SemanticHighlightingRange): EditorDecoration {
        const { start, end } = range;
        const options = this.toOptions(range.scopes);
        return {
            range: Range.create(start, end),
            options
        };
    }

    protected toOptions(scopes: string[]): DecorationOption {
        // TODO: why for-of? How to pick the right scope? Is it fine to get the first element (with the narrowest scope)?
        for (const scope of scopes) {
            const metadata = this.tokenTheme().match(undefined, scope);
            const inlineClassName = TokenMetadata.getClassNameFromMetadata(metadata);
            return {
                inlineClassName
            };
        }
        return {};
    }

    protected tokenTheme(): monaco.services.TokenTheme {
        return StaticServices.standaloneThemeService.get().getTheme().tokenTheme;
    }

}

/**
 * Helper tuple type with text editor decoration IDs and the raw highlighting ranges.
 */
export interface DecorationWithRanges {
    readonly decorations: string[];
    readonly ranges: SemanticHighlightingRange[];
}

export namespace DecorationWithRanges {
    export const EMPTY: DecorationWithRanges = {
        decorations: [],
        ranges: []
    };
}

export interface TextDocumentChangeEvent {
    readonly document: TextEditorDocument;
    readonly contentChanges: TextDocumentContentChangeDelta[];
}

export interface TextEditorDocument extends TextDocument, Disposable {
    getLineContent(lineNumber: number): string;
    getLineMaxColumn(lineNumber: number): number;
}

export interface TextDocumentContentChangeDelta extends TextDocumentContentChangeEvent {
    readonly range: Range;
    readonly rangeLength: number;
}

export namespace TextDocumentContentChangeDelta {

    // tslint:disable-next-line:no-any
    export function is(arg: any): arg is TextDocumentContentChangeDelta {
        return !!arg && typeof arg['text'] === 'string' && typeof arg['rangeLength'] === 'number' && Range.is(arg['range']);
    }

}