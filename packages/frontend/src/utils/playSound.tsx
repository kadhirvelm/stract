import * as React from "react";
import { ORIGIN, PORT } from "@stract/api";

export function playSound(soundUrl: string) {
    // const [soundRef] = React.useRef();
    const fullSoundUrl = `http://${ORIGIN}:${PORT}/${soundUrl}`;
    return (
        <audio src={fullSoundUrl} autoPlay style={{ display: "none" }}>
            <track kind="captions" />
        </audio>
    );
}
