import { Logger } from "@nestjs/common";

export enum WorkerState {
    FREE, BUSY
}

export class DownloadWorker {
    private logger = new Logger(DownloadWorker.name);
    public state = WorkerState.FREE;
    public async run(work: () => Promise<void>): Promise<void> {
        this.state = WorkerState.BUSY;
        try {
            await work();
        } catch(error) {
            this.logger.error(error);
        } finally {
            this.state = WorkerState.FREE;
        }
    }
}