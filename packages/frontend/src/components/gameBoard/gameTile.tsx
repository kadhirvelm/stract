import { IAllTeams, IOccupiedBy, IOccupiedByAlive } from "@stract/api";
import { ICanAddStagedActionToTile } from "@stract/utils";
import classNames from "classnames";
import { isEqual, pick, noop } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ChangeSelectedTile, IStoreState } from "../../store";
import { getGameTileKey, ISelectedTile } from "../../utils";
import { Piece, Spawn, Star, Cross } from "../pieces";
import styles from "./gameTile.module.scss";

interface IOwnProps {
    canAddAnyStagedAction: ICanAddStagedActionToTile;
    columnIndex: number;
    dimension: number;
    occupiedBy: IOccupiedBy | undefined;
    rowIndex: number;
    totalBoardRows: number;
}

interface IStateProps {
    selectedTile: ISelectedTile | undefined;
}

interface IDispatchProps {
    changeSelectedTile: (selectedTile: ISelectedTile | undefined) => void;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

function MaybeRenderOccupiedBy(props: { dimension: number; occupiedBy: IOccupiedBy }) {
    const { dimension, occupiedBy } = props;

    return IOccupiedBy.visit<React.ReactElement | null>(occupiedBy, {
        alive: alivePiece => <Piece piece={alivePiece.piece} squareDimension={dimension} />,
        destroyed: destroyed => (
            <>
                <Piece className={styles.destroyedPiece} piece={destroyed.piece} squareDimension={dimension} />
                <Cross className={styles.destroyedPiece} squareDimension={dimension} />
            </>
        ),
        scored: scoredPiece => (
            <>
                <Piece className={styles.scoredPiece} piece={scoredPiece.piece} squareDimension={dimension} />
                <Star className={styles.scoredPiece} squareDimension={dimension} />
            </>
        ),
        undefined: () => null,
        unknown: () => null,
    });
}

const BasicTile: React.FunctionComponent<{
    canAddAnyStagedAction: ICanAddStagedActionToTile;
    columnIndex: number;
    dimension: number;
    keyString: string;
    onClick: () => void;
    rowIndex: number;
    selectedTile: ISelectedTile | undefined;
    shouldRenderBackground?: boolean;
    teamOwner: keyof IAllTeams<any>;
}> = props => {
    const {
        canAddAnyStagedAction,
        children,
        columnIndex,
        dimension,
        keyString,
        onClick,
        rowIndex,
        selectedTile,
        shouldRenderBackground,
        teamOwner,
    } = props;

    return (
        <div
            className={classNames(
                styles.freeTile,
                shouldRenderBackground && {
                    [styles.northTile]: teamOwner === "north",
                    [styles.southTile]: teamOwner === "south",
                    [styles.canSelectTile]: canAddAnyStagedAction.isValid && selectedTile === undefined,
                    [styles.isSelectedTile]:
                        selectedTile?.rowIndex === rowIndex && selectedTile?.columnIndex === columnIndex,
                },
            )}
            key={keyString}
            onClick={onClick}
            style={{
                height: dimension,
                width: dimension,
                top: rowIndex * dimension,
                left: columnIndex * dimension,
            }}
        >
            {children}
        </div>
    );
};

export class UnconnectedGameTile extends React.Component<IProps> {
    // We need to check for deep referential equality before re-rendering, this should be a cheap action since these pieces are small
    public shouldComponentUpdate(nextProps: IProps) {
        const keysToCompare: Array<keyof IProps> = [
            "canAddAnyStagedAction",
            "occupiedBy",
            "selectedTile",
            "rowIndex",
            "columnIndex",
        ];
        return !isEqual(pick(nextProps, keysToCompare), pick(this.props, keysToCompare));
    }

    public render() {
        const {
            totalBoardRows,
            canAddAnyStagedAction,
            changeSelectedTile,
            columnIndex,
            dimension,
            occupiedBy,
            rowIndex,
            selectedTile,
        } = this.props;

        const maybeSelectTile = (occupiedByAlive: IOccupiedByAlive | undefined) => () => {
            if (
                selectedTile !== undefined &&
                (!canAddAnyStagedAction.isValid ||
                    (selectedTile.columnIndex === columnIndex && selectedTile.rowIndex === rowIndex))
            ) {
                changeSelectedTile(undefined);
            } else if (canAddAnyStagedAction.isValid) {
                changeSelectedTile({
                    canSpawn: canAddAnyStagedAction.canSpawn,
                    columnIndex,
                    dimension,
                    occupiedByAlive,
                    rowIndex,
                });
            }
        };

        const teamOwner: keyof IAllTeams<any> = rowIndex < totalBoardRows / 2 ? "north" : "south";

        const commonProps = {
            canAddAnyStagedAction,
            dimension,
            columnIndex,
            rowIndex,
            selectedTile,
            shouldRenderBackground: true,
            teamOwner,
        };

        return IOccupiedBy.visit<React.ReactElement | null>(occupiedBy, {
            alive: occupiedByAlive => (
                <BasicTile
                    {...commonProps}
                    keyString={getGameTileKey(occupiedByAlive, rowIndex, columnIndex)}
                    onClick={maybeSelectTile(occupiedByAlive)}
                >
                    {canAddAnyStagedAction.canSpawn && (
                        <Spawn squareDimension={dimension} size="board" team={teamOwner} />
                    )}
                    <MaybeRenderOccupiedBy dimension={dimension} occupiedBy={occupiedByAlive} />
                </BasicTile>
            ),
            destroyed: occupiedByDead => (
                <BasicTile
                    {...commonProps}
                    keyString={getGameTileKey(occupiedByDead, rowIndex, columnIndex)}
                    onClick={noop}
                    shouldRenderBackground={false}
                >
                    <MaybeRenderOccupiedBy dimension={dimension} occupiedBy={occupiedByDead} />
                </BasicTile>
            ),
            scored: occupiedByScored => (
                <BasicTile
                    {...commonProps}
                    keyString={getGameTileKey(occupiedByScored, rowIndex, columnIndex)}
                    onClick={maybeSelectTile(undefined)}
                >
                    {canAddAnyStagedAction.canSpawn && (
                        <Spawn squareDimension={dimension} size="board" team={teamOwner} />
                    )}
                    <MaybeRenderOccupiedBy dimension={dimension} occupiedBy={occupiedByScored} />
                </BasicTile>
            ),
            undefined: () => (
                <BasicTile
                    {...commonProps}
                    keyString={getGameTileKey(undefined, rowIndex, columnIndex)}
                    onClick={maybeSelectTile(undefined)}
                >
                    {canAddAnyStagedAction.canSpawn && (
                        <Spawn squareDimension={dimension} size="board" team={teamOwner} />
                    )}
                </BasicTile>
            ),
            unknown: () => null,
        });
    }
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        selectedTile: state.interface.selectedTile,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            changeSelectedTile: ChangeSelectedTile.create,
        },
        dispatch,
    );
}

export const GameTile = connect(mapStateToProps, mapDispatchToProps)(UnconnectedGameTile);
