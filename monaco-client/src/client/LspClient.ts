import { listen, MessageConnection } from '@sourcegraph/vscode-ws-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');
import { TextMateTokenizer } from '../monaco-configuration/TextMateTokenizer';

const ReconnectingWebSocket = require('reconnecting-websocket');

export class LspClient {

    private static tokenizer = new TextMateTokenizer();
    private static outputEditor : monaco.editor.IStandaloneCodeEditor;
    private static schemaEditor : monaco.editor.IStandaloneCodeEditor;

    /**
     * Creates the language-client und connects it to the language-server
     *
     * @static
     * @param {monaco.editor.IStandaloneCodeEditor} ovlEditor the monaco-editor which 
     *          needs to be connected to the language server
     * @param {monaco.editor.IStandaloneCodeEditor} schemaEditor the editor for the 
     *          schema definition in ov
     * @param {monaco.editor.IStandaloneCodeEditor} outputEditor the editor which displays
     *          the generated source-code
     * @memberof LspClient
     */
    public static createLspClient(
        ovlEditor: monaco.editor.IStandaloneCodeEditor,
        schemaEditor: monaco.editor.IStandaloneCodeEditor,
        outputEditor: monaco.editor.IStandaloneCodeEditor
    ) {
        this.outputEditor = outputEditor;
        this.schemaEditor = schemaEditor;
        console.log(this.schemaEditor);

        // create the web socket
        const url = this.createUrl('/ovLanguage');
        const webSocket = this.createWebSocket(url);

        // install Monaco language client services
        MonacoServices.install(ovlEditor);
        
        // listen when the web socket is opened
        listen({
            webSocket,
            onConnection: async connection => {

                // create and start the language client
                const languageClient = this.createLanguageClient(connection);
                const disposable = languageClient.start();

                connection.onDispose(() => disposable.dispose());
                connection.onClose(() => disposable.dispose());

                await languageClient.onReady;
            }
        });
    }

    
    /**
     * Creates the MonacoLanguageClient which is the language-client
     *  and communicates with the language-server
     * 
     * @private
     * @static
     * @param {MessageConnection} connection connection to the language-server
     * @returns {MonacoLanguageClient} created client
     * @memberof LspClient
     */
    private static createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
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
                get: async (errorHandler, closeHandler) => {
                    var newConnection = await createConnection(connection, errorHandler, closeHandler);

                    newConnection.onNotification("textDocument/semanticHighlighting", (params) => {
                        this.tokenizer.setTokenization(params);
                    });

                    newConnection.onNotification("textDocument/generatedCode", (param) => {
                        var paramJson = JSON.parse(param);
                        var language = paramJson.language.toLowerCase();
                        var value = paramJson.value;
                        
                        var currentModel = this.outputEditor.getModel()
                        if (currentModel) {
                            currentModel.setValue(value);
                            monaco.editor.setModelLanguage(currentModel, language);
                        }
                    });

                    return Promise.resolve(newConnection);
                }
            }
        });
    }

    
    /**
     * Creates the URL to the websocket we want to connect to
     *
     * @private
     * @static
     * @param {string} path path of the websocket of the language-server
     * @returns {string} the generated path
     * @memberof LspClient
     */
    private static createUrl(path: string): string {
        const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
        return normalizeUrl(`${protocol}://localhost:3000${location.pathname}${path}`);
    }


    /**
     * Generates a websocket to the language-server
     *
     * @private
     * @static
     * @param {string} url url to the language-server
     * @returns {WebSocket} the generated websocket
     * @memberof LspClient
     */
    private static createWebSocket(url: string): WebSocket {
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



