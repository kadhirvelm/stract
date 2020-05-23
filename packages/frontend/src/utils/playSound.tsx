import * as React from "react";
import { ORIGIN, PORT } from "@stract/api";

const getSourceUrl = (fileName: string) => `http://${ORIGIN}:${PORT}/${fileName}`;

let setSourceUrl: (fileName: string) => void;
let audioRef: React.RefObject<HTMLAudioElement>;

export function SetupAudioPlayer() {
    audioRef = React.createRef<HTMLAudioElement>();
    const [sourceUrl, setInternalSourceUrl] = React.useState("");

    setSourceUrl = (fileName: string) => setInternalSourceUrl(getSourceUrl(fileName));

    return (
        <audio ref={audioRef} src={sourceUrl} controls autoPlay>
            <track kind="captions" />
        </audio>
    );
}

export function playSound(fileName: string) {
    if (setSourceUrl === undefined || audioRef == null) {
        return;
    }

    audioRef.current?.pause();
    // TODO: reset the current sound
    setSourceUrl(fileName);
}
