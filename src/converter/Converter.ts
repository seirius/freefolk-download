import { ReadStream } from "fs";
import FormData from "form-data";
import Axios from "axios";
import { resolve } from "url";
import { ConverterConfig } from "../config/ConverterConfig";


export class Converter {

    public static async convert({
        file, id, tags, filename, format, from
    }: IUploadArgs): Promise<void> {
        const formData = new FormData();
        formData.append("file", file, filename);
        formData.append("id", id);
        formData.append("tags", tags.join(","));
        formData.append("format", format);
        formData.append("from", from);
        await Axios.post(resolve(ConverterConfig.HOST, "convert"), formData, {
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
    format: string;
    from: string;
}