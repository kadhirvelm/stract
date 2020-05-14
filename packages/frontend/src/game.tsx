import { Spinner } from "@blueprintjs/core";
import { IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { GameBoard } from "./components/gameBoard";
import styles from "./game.module.scss";
import { instantiateStractGameSocketListener, sendServerMessage } from "./socket";
import { IStoreState } from "./store";

interface IOwnProps {
    storeDispatch: Dispatch;
}

interface IStoreProps {
    gameBoard?: IStractGameV1;
}

type IProps = IOwnProps & IStoreProps;

class UnconnectedGame extends React.PureComponent<IProps> {
    public async componentDidMount() {
        const { storeDispatch } = this.props;
        await instantiateStractGameSocketListener(storeDispatch);
        sendServerMessage().getGameUpdate({});
    }

    public componentDidUpdate() {
        const { gameBoard } = this.props;
        if (gameBoard?.teams === undefined) {
            return;
        }

        sendServerMessage().registerPlayer({ name: "Sample player", team: gameBoard?.teams.north.id });
    }

    public render() {
        const { gameBoard } = this.props;
        if (gameBoard === undefined) {
            return <Spinner />;
        }

        return (
            <div className={styles.boardContainer}>
                <GameBoard gameBoard={gameBoard} />
            </div>
        );
    }
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
    };
}

export const Game = connect(mapStateToProps)(UnconnectedGame);
