import * as React from "react";
import { Spinner } from "@blueprintjs/core";
import { connect } from "react-redux";
import classNames from "classnames";
import { ILastPong } from "../../utils";
import styles from "./socketHealth.module.scss";
import { IStoreState } from "../../store";

const toMilliseconds = (seconds: number) => 1000 * seconds;

interface IStoreProps {
    lastPong?: ILastPong;
}

type IProps = IStoreProps;

function UnconnectedSocketHealth(props: IProps) {
    const { lastPong } = props;
    if (lastPong === undefined) {
        return (
            <div className={styles.socketContainer}>
                <Spinner size={Spinner.SIZE_SMALL} />
            </div>
        );
    }

    if (new Date().valueOf() - lastPong.timeStamp.valueOf() > toMilliseconds(15)) {
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
