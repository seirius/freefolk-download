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

    public static async convertMp3Mp4({
        file, image, imageUrl, id, tags, metadata, filename
    }: IConvertMp4Mp3Args) {
        const formData = new FormData();
        formData.append("file", file, filename);
        if (image) {
            formData.append("image", image, "cover");
        } else if (imageUrl) {
            formData.append("imageUrl", imageUrl);
        }
        formData.append("id", id);
        formData.append("tags", tags.join(","));
        if (typeof metadata === "object") {
            formData.append("metadata", JSON.stringify(metadata));
        }
        await Axios.post(resolve(ConverterConfig.HOST, "convert-mp3-mp4"), formData, {
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

export interface IConvertMp4Mp3Args {
    file: ReadStream;
    filename: string;
    image?: ReadStream;
    imageUrl?: string;
    id: string;
    tags: string[];
    metadata: Record<string, any>;
}