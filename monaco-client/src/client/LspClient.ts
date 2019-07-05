import { listen, MessageConnection } from '@sourcegraph/vscode-ws-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection, IConnection
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');
import { TextMateTokenizer } from '../monaco-configuration/TextMateTokenizer';

const ReconnectingWebSocket = require('reconnecting-websocket');

export class LspClient {
    private static tokenizer = new TextMateTokenizer();
    // private static ovlEditor: monaco.editor.IStandaloneCodeEditor;
    private static outputEditor: monaco.editor.IStandaloneCodeEditor;
    private static schemaEditor: monaco.editor.IStandaloneCodeEditor;
    private static monacoServices: MonacoServices;
    private static currentConnection: IConnection;

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
        // this.ovlEditor = ovlEditor;
        this.outputEditor = outputEditor;
        this.schemaEditor = schemaEditor;
        
        // install Monaco language client services
        this.monacoServices = MonacoServices.install(ovlEditor);

        // create the web socket
        const url = this.createUrl('/ovLanguage');
        const webSocket = this.createWebSocket(url);


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
                    this.currentConnection = await createConnection(connection, errorHandler, closeHandler);

                    // Informs the server about the initialized schema
                    this.currentConnection.sendNotification("textDocument/schemaChanged", this.schemaEditor.getValue());

                    // Handler for semantic-highlighting
                    this.currentConnection.onNotification("textDocument/semanticHighlighting", (params) => {
                        this.tokenizer.setTokenization(params);
                    });

                    // Handler for newly generated code
                    this.currentConnection.onNotification("textDocument/generatedCode", (param) => {
                        var paramJson = JSON.parse(param);
                        var language = paramJson.language.toLowerCase();
                        var value = paramJson.value;

                        var currentModel = this.outputEditor.getModel()
                        if (currentModel) {
                            currentModel.setValue(value);
                            monaco.editor.setModelLanguage(currentModel, language);
                        }
                    });

                    // Handler for changing of the schema
                    this.monacoServices.workspace.onDidChangeTextDocument((event) => {
                        if (event.textDocument.languageId == "yaml") {
                            this.currentConnection.sendNotification("textDocument/schemaChanged", this.schemaEditor.getValue());
                        }

                        //TODO: Trigger text-edit for ov-model
                    });

                    return Promise.resolve(this.currentConnection);
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



