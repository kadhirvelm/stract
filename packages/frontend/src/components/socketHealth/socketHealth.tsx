import * as React from "react";
import { Spinner } from "@blueprintjs/core";
import { connect } from "react-redux";
import classNames from "classnames";
import { ILastPong } from "../../utils";
import styles from "./socketHealth.module.scss";
import { IStoreState } from "../../store";

const toMilliseconds = (seconds: number) => 1000 * seconds;
const CHECK_EVERY_SECONDS = toMilliseconds(15);

interface IStoreProps {
    lastPong?: ILastPong;
}

type IProps = IStoreProps;

function UnconnectedSocketHealth(props: IProps) {
    const [checkOnlineState, incrementCheckOnlineState] = React.useState(0);

    const { lastPong } = props;
    if (lastPong === undefined) {
        return (
            <div className={styles.socketContainer}>
                <Spinner size={Spinner.SIZE_SMALL} />
            </div>
        );
    }

    const isOnline = () => new Date().valueOf() - lastPong.timeStamp.valueOf() < CHECK_EVERY_SECONDS;

    setTimeout(() => {
        incrementCheckOnlineState(checkOnlineState + 1);
    }, CHECK_EVERY_SECONDS);

    if (!isOnline()) {
        return (
            <div className={styles.socketContainer}>
                --
                <div className={classNames(styles.genericIndicator, styles.red)} />
            </div>
        );
    }

    return (
        <div className={styles.socketContainer}>
            {lastPong.latency.toLocaleString()}
            <div className={classNames(styles.genericIndicator, styles.green)} />
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        lastPong: state.game.lastPong,
    };
}

export const SocketHealth = connect(mapStateToProps)(UnconnectedSocketHealth);
