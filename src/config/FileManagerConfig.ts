import * as env from 'env-var';
import { config as envConfig } from 'dotenv';
envConfig();

export class FileManagerConfig {
    public static readonly HOST = env.get("FILE_MANAGER_HOST").asString();
}