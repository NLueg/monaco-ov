import axios from "axios";
import { TokenClass } from "src/monaco-configuration/enums";

export class ApiProxy {
    private static readonly apiUrl = "http://localhost:3000";

    /**
     * request
     */
    public static async postData(text: string): Promise<[string, TokenClass][]> {
        var response = await axios({
            method: "POST",
            url: this.apiUrl,
            data: {
                "documentText": text
            }
        });

        return response.data as [string, TokenClass][];
    }
}