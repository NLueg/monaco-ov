import axios, { AxiosPromise } from "axios";

export class ApiProxy {
    private readonly ovlApiUrl = "http://api.openvalidation.io";
    private readonly ovlSyntaxUrl = "http://localhost:3000";

    /**
     * request
     */
    public postData(rule: string): AxiosPromise {
        return axios({
            method: "POST",
            url: this.ovlApiUrl,
            "data": {
                "rule": rule,
                "schema": "{Alter:0, Wohnort:'Dortmund'}",
                "culture": "de",
                "language": "Java"
            },
            validateStatus: (status) => {
                return status == 418 || status == 200;
            },
            headers: { "content-type": "application/json", "accept": "application/json" }
        });
    }

    /**
     * getData
  : AxiosPromise    */
    public getData(): AxiosPromise {
        return axios({
            method: "GET",
            url: this.ovlSyntaxUrl
        });
    }
}