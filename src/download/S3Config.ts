import * as env from 'env-var';
import { config as envConfig } from 'dotenv';

envConfig();

export class S3Config {

    public static readonly S3_BUCKET = env.get("S3_BUCKET", "freefolk-downloads").asString();

}