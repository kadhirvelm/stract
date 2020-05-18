import * as React from "react";

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

    const secondsLeft = Math.max(Math.round(Math.abs(new Date().valueOf() - nextTurnTimestamp) / 1000), 0);
    return <div>{secondsLeft} s</div>;
}
