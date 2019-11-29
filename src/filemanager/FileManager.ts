import { ReadStream } from "fs";
import FormData from "form-data";
import Axios from "axios";
import { FileManagerConfig } from "../config/FileManagerConfig";
import { resolve } from "url";


export class FileManager {

    public static async upload({
        file, id, tags, filename,
    }: IUploadArgs): Promise<void> {
        const formData = new FormData();
        formData.append("file", file, filename);
        formData.append("id", id);
        formData.append("tags", tags.join(","));
        await Axios.post(resolve(FileManagerConfig.HOST, "upload"), formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
        });
    }

}

export interface IUploadArgs {
    file: ReadStream;
    id: string;
    tags: string[];
    filename: string;
}