import { listen, MessageConnection } from '@sourcegraph/vscode-ws-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');

const ReconnectingWebSocket = require('reconnecting-websocket');

export module LspClient {
    export function addAndCreateLanguageClient(editor: monaco.editor.IStandaloneCodeEditor) {

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
    }

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
}



