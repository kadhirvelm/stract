import { IAllTeams, IOccupiedBy, IOccupiedByAlive } from "@stract/api";
import { ICanAddStagedActionToTile } from "@stract/utils";
import classNames from "classnames";
import { isEqual, pick } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IStoreState } from "../../store";
import { ChangeSelectedTile } from "../../store/interface/interfaceActions";
import { getGameTileKey, ISelectedTile } from "../../utils";
import { Piece } from "../pieces";
import { Spawn } from "../pieces/pieceSvg";
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
    changeSelectedTile: (selectedTile: ISelectedTile) => void;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

function MaybeRenderOccupiedBy(props: { dimension: number; occupiedBy: IOccupiedBy }) {
    const { dimension, occupiedBy } = props;
    if (!IOccupiedBy.isAlive(occupiedBy)) {
        return null;
    }

    return <Piece piece={occupiedBy.piece} squareDimension={dimension} />;
}

export class UnconnectedGameTile extends React.Component<IProps> {
    // We need to check for deep referential equality before re-rendering, this should be a cheap action since these pieces are small
    public shouldComponentUpdate(nextProps: IProps) {
        const keysToCompare: Array<keyof IProps> = ["canAddAnyStagedAction", "occupiedBy", "rowIndex", "columnIndex"];
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
            if (!canAddAnyStagedAction.isValid) {
                return;
            }

            changeSelectedTile({
                canSpawn: canAddAnyStagedAction.canSpawn,
                columnIndex,
                dimension,
                occupiedByAlive,
                rowIndex,
            });
        };

        const teamOwner: keyof IAllTeams<any> = rowIndex < totalBoardRows / 2 ? "north" : "south";

        return IOccupiedBy.visit<React.ReactElement | null>(occupiedBy, {
            alive: occupiedByAlive => {
                return (
                    <div
                        className={classNames(styles.freeTile, {
                            [styles.northTile]: teamOwner === "north",
                            [styles.southTile]: teamOwner === "south",
                            [styles.canSelectTile]: canAddAnyStagedAction.isValid && selectedTile === undefined,
                            [styles.isSelectedTile]:
                                selectedTile?.rowIndex === rowIndex && selectedTile?.columnIndex === columnIndex,
                        })}
                        key={getGameTileKey(occupiedByAlive, rowIndex, columnIndex)}
                        onClick={maybeSelectTile(occupiedByAlive)}
                        style={{
                            height: dimension,
                            width: dimension,
                            top: rowIndex * dimension,
                            left: columnIndex * dimension,
                        }}
                    >
                        {canAddAnyStagedAction.canSpawn && (
                            <Spawn squareDimension={dimension} size="board" team={teamOwner} />
                        )}
                        <MaybeRenderOccupiedBy dimension={dimension} occupiedBy={occupiedByAlive} />
                    </div>
                );
            },
            dead: () => <div>Dead</div>,
            scored: () => <div>Scored</div>,
            undefined: () => (
                <div
                    className={classNames(styles.freeTile, {
                        [styles.northTile]: teamOwner === "north",
                        [styles.southTile]: teamOwner === "south",
                        [styles.canSelectTile]: canAddAnyStagedAction.isValid && selectedTile === undefined,
                        [styles.isSelectedTile]:
                            selectedTile?.rowIndex === rowIndex && selectedTile?.columnIndex === columnIndex,
                    })}
                    key={getGameTileKey(undefined, rowIndex, columnIndex)}
                    onClick={maybeSelectTile(undefined)}
                    style={{
                        height: dimension,
                        width: dimension,
                        top: rowIndex * dimension,
                        left: columnIndex * dimension,
                    }}
                >
                    {canAddAnyStagedAction.canSpawn && (
                        <Spawn squareDimension={dimension} size="board" team={teamOwner} />
                    )}
                </div>
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
