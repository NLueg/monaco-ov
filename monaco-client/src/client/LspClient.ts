import { listen, MessageConnection } from '@sourcegraph/vscode-ws-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection, TextDocumentDidChangeEvent
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');
import { MonacoOvConfiguration } from '../monaco-configuration/MonacoOvConfiguration';
import { TokenClass } from 'src/monaco-configuration/Enums';

const ReconnectingWebSocket = require('reconnecting-websocket');

export module LspClient {
    export function addAndCreateLanguageClient(editor: monaco.editor.IStandaloneCodeEditor) {
        // create the web socket
        const url = createUrl('/ovLanguage');
        const webSocket = createWebSocket(url);

        var valueCode = `huml.appendRule("",
["name"],
"your name HAS to be Validaria",
function(model) { 
    return huml.NOT_EQUALS(model.name, "Validaria");
},
false
);`;
        monaco.editor.create(document.getElementById("generated-code")!, {
            model: monaco.editor.createModel(valueCode, 'java', monaco.Uri.parse('inmemory://model.java')),
            theme: 'ovTheme',
            readOnly: true,
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            }
        });

        var valueSchema = `Name: Satoshi \nAlter: 25 \nOrt: Dortmund`;
        monaco.editor.create(document.getElementById("schema-definition")!, {
            model: monaco.editor.createModel(valueSchema, 'yaml', monaco.Uri.parse('inmemory://model.yaml')),
            theme: 'vs-dark',
            automaticLayout: true,
            glyphMargin: true,
            lightbulb: {
                enabled: true
            }
        });

        // install Monaco language client services
        var services = MonacoServices.install(editor);

        // listen when the web socket is opened
        listen({
            webSocket,
            onConnection: async connection => {

                // create and start the language client
                const languageClient = createLanguageClient(connection, services);
                const disposable = languageClient.start();

                connection.onDispose(() => disposable.dispose());
                connection.onClose(() => disposable.dispose());

                await languageClient.onReady;

                //TODO: Maybe do this at Client-Creation? (line 107)
                services.workspace.onDidChangeTextDocument(async (res: TextDocumentDidChangeEvent) => {
                    await languageClient.onReady;

                    //TODO: Renew the reference to the language-client or just reload the handler
                    try {
                        if (res.textDocument.languageId == "yaml") {
                            //TODO: Update tokenization
                            languageClient.sendNotification("schemaChanged", res.textDocument.getText());
                        }

                        //TODO: Trigger on click
                        languageClient.sendNotification("languageChanged", "java");
                        languageClient.sendNotification("cultureChanged", "de");

                        if (res.textDocument.languageId == "ov") {
                            var response = await languageClient.sendRequest("syntax", res.textDocument.uri) as [string, TokenClass][];
                            if (!response) return;

                            MonacoOvConfiguration.setTokenization(response);
                        }
                    } catch (err) {
                    }
                });
            }
        });
    }

    function createLanguageClient(connection: MessageConnection, services: MonacoServices): MonacoLanguageClient {
        return new MonacoLanguageClient({
            name: "openVALIDATION Language Client",
            clientOptions: {
                // use a language id as a document selector
                documentSelector: ['ov'],
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
                    return Promise.resolve(createdConnection);
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



