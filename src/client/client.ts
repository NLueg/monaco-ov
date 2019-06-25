import { LspClient } from "./LspClient";
import { MonacoClient } from "./MonacoClient";
 
LspClient.addAndCreateLangaugeClient(MonacoClient.editor);