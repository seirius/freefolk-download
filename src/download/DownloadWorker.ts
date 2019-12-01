import { Logger } from "@overnightjs/logger";

export enum WorkerState {
    FREE, BUSY
}

export class DownloadWorker {
    public state = WorkerState.FREE;
    public async run(work: () => Promise<void>): Promise<void> {
        this.state = WorkerState.BUSY;
        try {
            await work();
        } catch(error) {
            Logger.Err(error, true);
        } finally {
            this.state = WorkerState.FREE;
        }
    }
}