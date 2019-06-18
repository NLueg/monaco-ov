/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { listen, MessageConnection } from 'vscode-ws-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');
// import { createTokenizationSupport } from './tokenization/tokenization';
const ReconnectingWebSocket = require('reconnecting-websocket');

// register Monaco languages
monaco.languages.register({
    id: 'ovl',
    extensions: ['.ovl'],
    aliases: ['OVL', 'ovl', 'openVALIDATION'],
});

monaco.languages.setMonarchTokensProvider('ovl', tokenizer());

function tokenizer() : monaco.languages.IMonarchLanguage {
    return { 
        tokenizer: {
        root:  [
                    [/WENN|UND|ODER|DANN|LÄNGER ALS|OPERAND|OPERATOR|KÜRZER ALS|DARF NICHT|HÖHER ALS|NIEDRIGER ALS|NIEDRIGER IST ALS|HÖHER IST ALS|GRÖßER IST ALS|KLEINER ALS|GRÖßER ALS|GERINGER IST ALS|IST GLEICH|IST UNGLEICH|IST KEIN|IST EIN|IST NICHT|IST GRÖßER ALS|IST MEHR ALS| IST HÖHER ALS|IST LÄNGER ALS|IST KLEINER ALS|IST WENIGER ALS|IST NIEDRIGER ALS|IST KÜRZER ALS|IST GRÖßER ODER GLEICH|IST MEHR ALS ODER GLEICH|IST KLEINER ODER GLEICH|IST WENIGER ALS ODER GLEICH|ENTHÄLT ALLES|IST EINS VON|IST KEINES VON|IST ENTHALTEN IN|IST VORHANDEN|IST NICHT VORHANDEN|IST|ALS|KLEINER|GRÖßER|GERINGER|WENIGER/,
                    'keyword'],
                    [/Alter|Name|Ort|Berufserfahrung|Jahresbruttogehalt|Kuendigungsfrist|Kreditpunkte/, "variable"],
                    [/KOMMENTAR(.*)/m, "comment"],
                    [/0[xX][0-9a-fA-F]+\\b/, "constant.numeric"],
                    [/[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b/, "constant.numeric"],
                    [/(?:ja|nein)\\b/, 'constant.language.boolean']
                ]
            }
        };
}

// monaco.languages.setTokensProvider('ovl', createTokenizationSupport());

monaco.editor.defineTheme('ovlTheme', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: 'keyword', foreground: '8e8e8e', fontStyle: 'bold' },
      { token: 'variable', foreground: '0000ff', fontStyle: 'bold' },
      { token: 'comment', foreground: '608b4e', fontStyle: 'bold' },
      { token: 'constant.numeric', foreground: 'b5cea8', fontStyle: 'bold' },
      { token: 'language.boolean', foreground: '0000ff', fontStyle: 'bold' },
    ],
    colors: {}
});

// create Monaco editor
const value = `WENN das Alter des Bewerbers KLEINER 18 ist
DANN Sie müssen mindestens 18 Jahre alt sein

	 das Alter des Bewerbers ist KLEINER 18
ALS  Minderjährig

WENN der Bewerber Minderjährig ist
 UND sein Wohnort ist NICHT Dortmund
DANN Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen

WENN der Bewerber Minderjährig ist
 ODER seine Berufserfahrung ist KÜRZER als 5 Jahre
DANN Sie müssen mindestens 18 Jahre alt sein und über eine Berufserfahrung
	 von minimum 5 Jahren verfügen

KOMMENTAR Dies ist ein Kommentar
		  Und hier auch...

	SUMME VON Einkaufsliste.Preis
ALS Ausgaben

die Ausgaben DÜRFEN NICHT das Budget von 20 € ÜBERSTEIGEN

	das Alter des Bewerbers ist KLEINER 18
ALS Minderjährig

das Alter des Bewerbers MUSS MINDESTENS 18 sein

	( 20 - 18 ) * 12
ALS Berufserfahrung in Monaten

 OPERAND  Alter
OPERATOR  KLEINER
	 ALS  JÜNGER

Der Bewerber DARF NICHT JÜNGER als 18 sein`;
const editor = monaco.editor.create(document.getElementById("container")!, {
    model: monaco.editor.createModel(value, 'ovl', monaco.Uri.parse('inmemory://model.json')),
    theme: 'ovlTheme',
    glyphMargin: true,
    lightbulb: {
        enabled: true
    }
});

editor.deltaDecorations([], [
	{ range: new monaco.Range(3,1,4,1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }},
	{ range: new monaco.Range(7,1,7,24), options: { inlineClassName: 'myInlineDecoration' }},
]);


// install Monaco language client services
MonacoServices.install(editor);

// create the web socket
const url = createUrl('/ovlLanguage');
const webSocket = createWebSocket(url);

// listen when the web socket is opened
listen({
    webSocket,
    onConnection: connection => {
        // create and start the language client
        const languageClient = createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
    }
});

function createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name: "Ovl Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['ovl'],
            // disable the default error handler
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
            }
        }
    });
}

function createUrl(path: string): string {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`${protocol}://localhost:3000${location.pathname}${path}`);
}

function createWebSocket(url: string): WebSocket {
    const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
    };
    return new ReconnectingWebSocket(url, undefined, socketOptions);
}
