import { Configurations, WorkspaceConfiguration, ConfigurationChangeEvent, Emitter, Event } from "./services";

export class MonacoConfigurations implements Configurations {

    private configuration: MonacoWorkspaceConfiguration;

    constructor() {
        this.configuration = new MonacoWorkspaceConfiguration();
        this.onDidChangeConfigurationEmitter.fire({
            affectsConfiguration: (section: string) => {
                return true;
            }
        });
    }

    protected readonly onDidChangeConfigurationEmitter = new Emitter<ConfigurationChangeEvent>();

    getConfiguration(section?: string | undefined, resource?: string | undefined): WorkspaceConfiguration {
        return this.configuration;
    }

    get onDidChangeConfiguration(): Event<ConfigurationChangeEvent> {
        return this.onDidChangeConfigurationEmitter.event;
    }
}

export class MonacoWorkspaceConfiguration implements WorkspaceConfiguration {
    private ovConfiguration: OvConfiguration;

    constructor() {
        this.ovConfiguration = new OvConfiguration();
    }

    public toJSON(): any {
        JSON.parse(this.ovConfiguration.toString());
    }

    get<T>(section: string): T | undefined;

    get<T>(section: string, defaultValue: T): T;

    get(section: any, defaultValue?: any) {
        if (section === "language") {
            return this.ovConfiguration.language;
        }
        if (section === "culture") {
            return this.ovConfiguration.culture;
        }
        if (section === "schema") {
            return this.ovConfiguration.schema;
        }
        return defaultValue;
    }

    has(section: string): boolean {
        return (section === "language" ||
            section === "culture" ||
            section === "schema");
    }


}

export class OvConfiguration {
    private _language: string;
    private _culture: string;
    private _schema: string;

    constructor() {
        this._culture = "";
        this._language = "";
        this._schema = "";
    }

    public set language(value: string) {
        this._language = value;
    }

    public get language(): string {
        return this._language;
    }

    public set culture(value: string) {
        this._culture = value;
    }

    public get culture(): string {
        return this._culture;
    }

    public set schema(value: string) {
        this._schema = value;
    }

    public get schema(): string {
        return this._schema
    }
}