import * as env from 'env-var';
import { config as envConfig } from 'dotenv';
envConfig();

export class QueueConfig {
    public static readonly HOST = env.get("QUEUE_HOST").asString();
}