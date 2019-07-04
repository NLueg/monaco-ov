import { LspClient } from "./client/LspClient";
import { MonacoClientCreator } from "./client/MonacoClient";
import { MonacoOvConfiguration } from "./monaco-configuration/MonacoOvConfiguration";

require('monaco-editor');
(self as any).MonacoEnvironment = {
    getWorkerUrl: (moduleId: any, label: string) => {
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js';
        }
        return './editor.worker.bundle.js'
    }
}

require('../css/style.css');
require('../images/logo-v2-small.png');
createEditors();

/**
 * Creates all needed monaco- and lsp-clients and sets up the configuration for openVALIDATION
 */
async function createEditors() {
    MonacoOvConfiguration.setOvLanguageSupport();

    var ovlClient = await MonacoClientCreator.createOvlEditor();
    LspClient.createLspClient(ovlClient);

    await MonacoClientCreator.createSchemaEditor();

    await MonacoClientCreator.createOutputEditor();
}