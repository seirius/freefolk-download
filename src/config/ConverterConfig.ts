import * as env from 'env-var';
import { config as envConfig } from 'dotenv';
envConfig();

export class ConverterConfig {
    public static readonly HOST = env.get("CONVERTER_HOST").asString();
}