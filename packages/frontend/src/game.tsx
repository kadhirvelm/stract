import { IPlayer, IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { UAParser } from "ua-parser-js";
import { NonIdealState } from "@blueprintjs/core";
import { GameBoard } from "./components/gameBoard";
import { RegisterPlayer } from "./components/player";
import styles from "./game.module.scss";
import { instantiateStractGameSocketListener } from "./socket";
import { IStoreState } from "./store";
import { SocketHealth } from "./components/socketHealth";
import { IDevice, IDeviceType } from "./utils";
import { ActionsSidebar } from "./components/actionsSidebar";

interface IOwnProps {
    storeDispatch: Dispatch;
}

interface IStoreProps {
    gameBoard?: IStractGameV1;
    player?: IPlayer;
}

type IProps = IOwnProps & IStoreProps;

class UnconnectedGame extends React.PureComponent<IProps> {
    private userDevice: IDeviceType | undefined = undefined;

    public componentDidMount() {
        const { storeDispatch } = this.props;
        instantiateStractGameSocketListener(storeDispatch);

        this.userDevice = IDevice.getDeviceType({
            browser: new UAParser().getBrowser(),
            type: new UAParser().getDevice().type,
        });
    }

    public render() {
        return (
            <>
                <SocketHealth />
                {this.renderGameElement()}
            </>
        );
    }

    private renderGameElement() {
        if (this.userDevice === undefined) {
            return null;
        }

        return IDevice.visitor(this.userDevice, {
            browser: this.renderGame,
            mobile: this.renderUnsupported,
            tablet: this.renderGame,
            unknown: this.renderUnsupported,
        });
    }

    private renderGame = () => {
        const { player } = this.props;
        if (player == null) {
            return <RegisterPlayer />;
        }

        return (
            <div className={styles.gameContainer}>
                <ActionsSidebar />
                <GameBoard />
            </div>
        );
    };

    private renderUnsupported = () => {
        return (
            <NonIdealState description="Looks like you're using a device we don't support yet. We only support desktop and tablet browsers for now." />
        );
    };
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
        player: state.game.player,
    };
}

export const Game = connect(mapStateToProps)(UnconnectedGame);
