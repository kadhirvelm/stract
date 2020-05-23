import * as React from "react";
import { ORIGIN, PORT } from "@stract/api";
import { v4 } from "uuid";

const getSourceUrl = (fileName: string) => `http://${ORIGIN}:${PORT}/${fileName}`;

let setSourceUrl: (fileName: string) => void;

export function SetupAudioPlayer() {
    const audioRef = React.createRef<HTMLAudioElement>();
    const [sourceUrl, setInternalSourceUrl] = React.useState({ url: "", id: "" });

    React.useEffect(() => {
        if (audioRef.current == null) {
            return;
        }

        audioRef.current.volume = 0.15;
        audioRef.current.load();
        audioRef.current.play();
    }, [sourceUrl.id]);

    setSourceUrl = (fileName: string) => {
        setInternalSourceUrl({ url: getSourceUrl(fileName), id: v4() });
    };

    return (
        <audio ref={audioRef} src={sourceUrl.url} style={{ display: "none", position: "absolute", zIndex: -1 }}>
            <track kind="captions" />
        </audio>
    );
}

export enum SOUNDS {
    BELL = "bell.mp3",
    DESTROY = "destroy.mp3",
    NOTIFICATION = "notification.mp3",
    PAUSE = "pause.mp3",
    SCORE = "score.mp3",
    UNPAUSE = "unpause.mp3",
    WARNING_BELL = "warning-bell.mp3",
}

export function playSound(fileName: SOUNDS) {
    if (setSourceUrl === undefined) {
        return;
    }

    setSourceUrl(fileName);
}
