import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isNil } from "lodash";
import { ApplicationConfig, RepositoryConfig } from "../types/config.types";

@Injectable()
export class ApiConfigService {
    constructor(private readonly configService: ConfigService) {}

    private getNumber(key: string): number {
        const value = this.get(key);

        try {
            return Number(value);
        } catch {
            throw new Error(`${key} environment variable is not a number`);
        }
    }

    private getBoolean(key: string): boolean {
        const value = this.get(key);

        try {
            return Boolean(JSON.parse(value));
        } catch {
            throw new Error(`${key} environment variable is not a boolean`);
        }
    }

    private getString(key: string): string {
        const value = this.get(key);

        return value.replaceAll("\\n", "\n");
    }

    private get(key: string): string {
        const value = this.configService.get<string>(key);

        if (isNil(value) || !value) {
            throw new Error(`${key} environment variable does not set`); // probably we should call process.exit() too to avoid locking the service
        }

        return value;
    }

    get app(): ApplicationConfig {
        return {
            port: this.getNumber("WWIZ_APP_SERVICE_HTTP_PORT"),
            repository: this.getRepositoryConfig(),
        };
    }

    private getRepositoryConfig(): RepositoryConfig {
        return {
            type: this.getString("WWIZ_REPOSITORY_TYPE"),
            host: this.getString("WWIZ_REPOSITORY_HOST"),
            port: this.getNumber("WWIZ_REPOSITORY_PORT"),
            username: this.getString("WWIZ_REPOSITORY_USERNAME"),
            password: this.getString("WWIZ_REPOSITORY_PASSWORD"),
            database: this.getString("WWIZ_REPOSITORY_DATABASE"),
        };
    }

    private is32BytesSymmetricKey(key: string): boolean {
        return this.isByteLengthEqual(key, 32);
    }

    private isByteLengthEqual(key: string, length: number): boolean {
        return Buffer.byteLength(key, "utf-8") === length;
    }
}
