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
    private ovlConfiguration: OvlConfiguration;

    constructor() {
        this.ovlConfiguration = new OvlConfiguration();
    }

    public toJSON(): any {
        JSON.parse(this.ovlConfiguration.toString());
    }

    get<T>(section: string): T | undefined;

    get<T>(section: string, defaultValue: T): T;

    get(section: any, defaultValue?: any) {
        if (section === "language") {
            return this.ovlConfiguration.language;
        }
        if (section === "culture") {
            return this.ovlConfiguration.culture;
        }
        if (section === "schema") {
            return this.ovlConfiguration.schema;
        }
        return defaultValue;
    }

    has(section: string): boolean {
        return (section === "language" ||
            section === "culture" ||
            section === "schema");
    }


}

export class OvlConfiguration {
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