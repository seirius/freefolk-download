import { Logger } from "@overnightjs/logger";
import { FreeFolkServer } from "./FreeFolkServer";

async function run(): Promise<void> {
    try {
        new FreeFolkServer().start();
    } catch (error) {
        Logger.Err(error);
    }
}

run();