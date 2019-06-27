import { listen, MessageConnection } from '@sourcegraph/vscode-ws-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection, TextDocumentDidChangeEvent
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');
import { MonacoOvlConfiguration } from '../monaco-configuration/MonacoOvlConfiguration';

const ReconnectingWebSocket = require('reconnecting-websocket');

export module LspClient {
    export function addAndCreateLanguageClient(editor: monaco.editor.IStandaloneCodeEditor) {
        // create the web socket
        const url = createUrl('/ovlLanguage');
        const webSocket = createWebSocket(url);

        // install Monaco language client services
        var services = MonacoServices.install(editor);

        // listen when the web socket is opened
        listen({
            webSocket,
            onConnection: async connection => {

                // create and start the language client
                const languageClient = createLanguageClient(connection, services);
                const disposable = languageClient.start();
                connection.onClose(() => disposable.dispose());

                await languageClient.onReady;
                services.workspace.onDidChangeTextDocument(async (res: TextDocumentDidChangeEvent) => {
                    MonacoOvlConfiguration.setTokenization(res.textDocument.getText());

                    // //TODO: How to dispose the listener and/or use the newest connection
                    // //TODO: Try to get the response from the existing call or ask the websocket for given symbols
                    // connection.sendRequest("syntax", res.textDocument.uri).then(res => {
                    //     var convertedResponse = res as [string, number][];
                    //     if (!convertedResponse) return;

                    //     var regexList = getRegEx(convertedResponse);
                    //     MonacoOvlConfiguration.setTokenization(regexList);
                    // });
                });
            }
        });
    }

    function createLanguageClient(connection: MessageConnection, services: MonacoServices): MonacoLanguageClient {
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
                    //TODO: ERROR, when LSP restarts, maybe just use REST for now
                    var createdConnection = createConnection(connection, errorHandler, closeHandler);

                    // services.workspace.onDidChangeTextDocument((res: TextDocumentDidChangeEvent) => {
                    //     //TODO: Try to get the response from the existing call or ask the websocket for given symbols
                    //     createdConnection.sendRequest("syntax", res.textDocument.uri).then(res => { 
                    //         var convertedResponse = res as [string,number][];
                    //         if (!convertedResponse) return;

                    //         var regexList = getRegEx(convertedResponse);
                    //         MonacoOvlConfiguration.setTokenization(regexList);
                    //     });
                    // });

                    // services.workspace.onDidOpenTextDocument((res: TextDocument) => {
                    //     //TODO: Try to get the response from the existing call or ask the websocket for given symbols
                    //     createdConnection.sendRequest("syntax", res.uri).then(res => { 
                    //         var convertedResponse = res as [string,number][];
                    //         if (!convertedResponse) return;

                    //         var regexList = getRegEx(convertedResponse);
                    //         MonacoOvlConfiguration.setTokenization(regexList);
                    //     });
                    // });

                    return Promise.resolve(createdConnection)
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
}



