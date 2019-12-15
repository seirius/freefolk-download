import { DownloadWorker, WorkerState } from "./download-worker";
import { Injectable } from "@nestjs/common";
import { BatchConfig } from "./../config/BatchConfig";

@Injectable()
export class WorkerManagerService {
    private workers: DownloadWorker[] = [];

    constructor() {
        new Array(BatchConfig.PARALLEL_NUMBER)
        .fill(new DownloadWorker())
        .forEach((worker) => this.workers.push(worker));
    }

    public getFreeWorkers(): DownloadWorker[] {
        const freeWorkers =  this.workers
        .filter((worker) => worker.state === WorkerState.FREE);
        return freeWorkers;
    }
}