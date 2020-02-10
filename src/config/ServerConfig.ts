import * as env from "env-var";
import { config as envConfig } from "dotenv";
envConfig();

export class ServerConfig {
    public static readonly PORT: number = env.get("PORT", "3000").asPortNumber();
}
