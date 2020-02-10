import * as env from "env-var";
import { config as envConfig } from "dotenv";
envConfig();

export class LoggerConfig {
    public static readonly LEVEL: string[] = env.get("LOGGER_LEVEL", "log,error").asArray();
}
