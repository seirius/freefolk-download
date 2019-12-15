import * as env from 'env-var';
import { config as envConfig } from 'dotenv';
envConfig();

export class BatchConfig {
    public static readonly CRON_INTERVAL = env.get("CRON_INTERVAL", "*/5 * * * * *").asString();
    public static readonly PARALLEL_NUMBER = env.get("PARALLEL_NUMBER", "5").asIntPositive();
    public static readonly CRON_TIMEZONE = env.get("CRON_TIMEZONE", "Europe/Madrid").asString();
}