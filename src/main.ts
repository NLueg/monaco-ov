import { LspClient } from "./client/LspClient";
import { MonacoClientCreator } from "./client/MonacoClient";
import { MonacoOvConfiguration } from "./monaco-configuration/MonacoOvConfiguration";

require("monaco-editor");
(self as any).MonacoEnvironment = {
  getWorkerUrl: (moduleId: any, label: string) => {
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.bundle.js";
    }
    return "./editor.worker.bundle.js";
  }
};

require("../css/style.css");
require("../images/logo-v2.png");
createEditors();

/**
 * Creates all required monaco- and lsp-clients and sets up the configuration for openVALIDATION
 */
async function createEditors() {
  MonacoOvConfiguration.setOvLanguageSupport();

  const ovlEditor = await MonacoClientCreator.createOvlEditor();
  const schemaEditor = await MonacoClientCreator.createSchemaEditor();
  const outputEditor = await MonacoClientCreator.createOutputEditor();
  LspClient.createLspClient(ovlEditor, schemaEditor, outputEditor);
}
