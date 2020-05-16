import { IPlayer, IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { GameBoard } from "./components/gameBoard";
import { RegisterPlayer } from "./components/player";
import styles from "./game.module.scss";
import { instantiateStractGameSocketListener } from "./socket";
import { IStoreState } from "./store";
import { SocketHealth } from "./components/socketHealth";

interface IOwnProps {
    storeDispatch: Dispatch;
}

interface IStoreProps {
    gameBoard?: IStractGameV1;
    player?: IPlayer;
}

type IProps = IOwnProps & IStoreProps;

class UnconnectedGame extends React.PureComponent<IProps> {
    public componentDidMount() {
        const { storeDispatch } = this.props;
        instantiateStractGameSocketListener(storeDispatch);
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
        const { player } = this.props;
        if (player == null) {
            return <RegisterPlayer />;
        }

        return (
            <div className={styles.boardContainer}>
                <GameBoard />
            </div>
        );
    }
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
        player: state.game.player,
    };
}

export const Game = connect(mapStateToProps)(UnconnectedGame);
