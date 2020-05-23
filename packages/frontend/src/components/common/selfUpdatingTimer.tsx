import * as React from "react";
import classNames from "classnames";
import styles from "./selfUpdatingTimer.module.scss";
import { playSound, SOUNDS } from "../../utils";

interface IOwnProps {
    nextTurnTimestamp: number;
}

type IProps = IOwnProps;

export function SelfUpdatingTimer(props: IProps) {
    const { nextTurnTimestamp } = props;

    const [ticker, updateTicker] = React.useState(0);

    React.useEffect(() => {
        setTimeout(() => {
            updateTicker(ticker + 1);
        }, 1000);
    }, [ticker]);

    const secondsLeft = Math.abs(Math.min(Math.round((new Date().valueOf() - nextTurnTimestamp) / 1000), 0));

    if (secondsLeft === 10) {
        playSound(SOUNDS.WARNING_BELL);
    }

    if (secondsLeft === 3) {
        playSound(SOUNDS.BELL);
    }

    return (
        <span
            className={classNames({
                [styles.green]: secondsLeft > 10,
                [styles.yellow]: secondsLeft > 3 && secondsLeft <= 10,
                [styles.red]: secondsLeft <= 3,
            })}
        >
            {secondsLeft} s
        </span>
    );
}
