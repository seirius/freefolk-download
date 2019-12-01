import { DownloadWorker, WorkerState } from "./DownloadWorker";

export class WorkerManager {
    private workers: DownloadWorker[] = [];

    constructor(workerNumber: number) {
        new Array(workerNumber)
        .fill(new DownloadWorker())
        .forEach((worker) => this.workers.push(worker));
    }

    public getFreeWorkers(): DownloadWorker[] {
        const freeWorkers =  this.workers
        .filter((worker) => worker.state === WorkerState.FREE);
        return freeWorkers;
    }
}