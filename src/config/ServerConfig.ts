import * as env from 'env-var';

export class ServerConfig {
    public static readonly PORT: number = env.get("PORT", "3000").asPortNumber();
}