import { LspClient } from "./LspClient";
import { MonacoClient } from "./MonacoClient";

export class Main {
    public static async createEditors() {
        LspClient.addAndCreateLanguageClient(await MonacoClient.createEditor());
    }
}