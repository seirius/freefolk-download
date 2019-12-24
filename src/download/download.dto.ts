import { ApiProperty } from "@nestjs/swagger";

export class DownloadResponseDto {
    @ApiProperty()
    filename: string;
}

export class MultipleStartDownloadDto {
    @ApiProperty({ 
        type: [String],
        required: false
    })
    ids?: string[];

    @ApiProperty({ required: false })
    playlistId: string;
}

export class MultipleStartDownloadResponseDto {
    @ApiProperty({ type: [String] })
    filename: string[];
}

export class StartDownloadAudioResponseDto {
    @ApiProperty()
    filename: string;
}

export class MultipleStartDownloadAudioDto {
    @ApiProperty({ 
        type: [String],
        required: false
    })
    ids?: string[];

    @ApiProperty({ required: false })
    playlistId: string;
}

export class MultipleStartDownloadAudioResponseDto {
    @ApiProperty({ type: [String] })
    filename: string[];
}

export enum EDownloadState {
    STAND_BY = "stand_by",
    INIT = "init",
    DOWNLOADING = "downloading",
    CONVERTING = "converting",
    END = "end",
    ERROR = "error"
}