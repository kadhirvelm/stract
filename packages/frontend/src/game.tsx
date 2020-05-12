import * as React from "react";
import io from "socket.io-client";
import { StractGameSocketService } from "@stract/api";

export class Game extends React.PureComponent {
    public componentDidMount() {
        const socket = io("http://10.0.0.215:3000/");

        const toServer = StractGameSocketService.frontend.toServer(socket, { socketIdentifier: "sample-socket" });
        const fromServer = StractGameSocketService.frontend.fromServer(socket);

        fromServer.onGameUpdate(game => console.log("We got game", game));

        toServer.getGameUpdate({});
    }

    public render() {
        return <div>Hello world!</div>;
    }
}
