import { IAllTeams, IColumnIndex, IOccupiedBy, IOccupiedByAlive, IRowIndex } from "@stract/api";
import { ICanAddStagedActionToTile } from "@stract/utils";
import classNames from "classnames";
import { isEqual, noop, pick } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ChangeSelectedTile, IStoreState } from "../../store";
import { getGameTileKey, ISelectedTile, ITilesInStagedActions, getRowColumnKey } from "../../utils";
import { Cross, Piece, Spawn, Star } from "../pieces";
import styles from "./gameTile.module.scss";
import { getTilesUsedInStagedActions, hasPlayerTeamReachedMaxStagedActions } from "../../selectors";

interface IOwnProps {
    canAddAnyStagedAction: ICanAddStagedActionToTile;
    columnIndex: IColumnIndex;
    dimension: number;
    occupiedBy: IOccupiedBy | undefined;
    rowIndex: IRowIndex;
    totalBoardRows: number;
}

interface IStateProps {
    hasPlayerTeamReachedMaxStagedActionsBoolean: boolean;
    selectedTile: ISelectedTile | undefined;
    tilesUsedInStagedActions: ITilesInStagedActions;
}

interface IDispatchProps {
    changeSelectedTile: (selectedTile: ISelectedTile | undefined) => void;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

function MaybeRenderOccupiedBy(props: { className?: string; dimension: number; occupiedBy: IOccupiedBy }) {
    const { className, dimension, occupiedBy } = props;

    return IOccupiedBy.visit<React.ReactElement | null>(occupiedBy, {
        alive: alivePiece => <Piece className={className} piece={alivePiece.piece} squareDimension={dimension} />,
        destroyed: destroyed => {
            // This helps differentiate between multiple pieces being destroyed at the same time
            const randomTime = `${Math.random() * 500}ms`;
            return (
                <>
                    <Piece
                        className={styles.destroyedPiece}
                        piece={destroyed.piece}
                        squareDimension={dimension}
                        style={{ animationDelay: randomTime }}
                    />
                    <Cross
                        className={styles.destroyedPiece}
                        squareDimension={dimension}
                        style={{ animationDelay: randomTime }}
                    />
                </>
            );
        },
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
    className?: string;
    columnIndex: IColumnIndex;
    dimension: number;
    hasPlayerTeamReachedMaxStagedActionsBoolean: boolean;
    keyString: string;
    onClick: () => void;
    rowIndex: IRowIndex;
    selectedTile: ISelectedTile | undefined;
    shouldRenderBackground?: boolean;
    teamOwner: keyof IAllTeams<any> | undefined;
    tilesUsedInStagedActions: ITilesInStagedActions;
}> = props => {
    const {
        canAddAnyStagedAction,
        className,
        children,
        columnIndex,
        dimension,
        hasPlayerTeamReachedMaxStagedActionsBoolean,
        keyString,
        onClick,
        rowIndex,
        selectedTile,
        shouldRenderBackground,
        teamOwner,
        tilesUsedInStagedActions,
    } = props;

    const isUsedInStagedAction = tilesUsedInStagedActions.get(getRowColumnKey(rowIndex, columnIndex));

    return (
        <div
            className={classNames(
                styles.freeTile,
                className,
                shouldRenderBackground && {
                    [styles.northTile]: teamOwner === "north",
                    [styles.normalTile]: teamOwner === undefined,
                    [styles.southTile]: teamOwner === "south",
                    [styles.isPartOfSpawnAction]: isUsedInStagedAction === "spawn-piece",
                    [styles.isPartOfMoveAction]: isUsedInStagedAction === "move-piece",
                    [styles.isPartOfSpecialAction]:
                        isUsedInStagedAction === "special-move-piece" || isUsedInStagedAction === "switch-places",
                    [styles.canSelectTile]:
                        !hasPlayerTeamReachedMaxStagedActionsBoolean &&
                        canAddAnyStagedAction.isValid &&
                        selectedTile === undefined,
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
            hasPlayerTeamReachedMaxStagedActionsBoolean,
            occupiedBy,
            rowIndex,
            selectedTile,
            tilesUsedInStagedActions,
        } = this.props;

        const isSelectedTile = selectedTile?.columnIndex === columnIndex && selectedTile.rowIndex === rowIndex;

        const maybeSelectTile = (occupiedByAlive: IOccupiedByAlive | undefined) => () => {
            if (selectedTile !== undefined && (!canAddAnyStagedAction.isValid || isSelectedTile)) {
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

        const teamOwner = (): keyof IAllTeams<any> | undefined => {
            if (rowIndex === 0) {
                return "north";
            }

            if (rowIndex === totalBoardRows - 1) {
                return "south";
            }

            return undefined;
        };

        const commonProps = {
            canAddAnyStagedAction,
            dimension,
            columnIndex,
            hasPlayerTeamReachedMaxStagedActionsBoolean,
            rowIndex,
            selectedTile,
            shouldRenderBackground: false,
            teamOwner: teamOwner(),
            tilesUsedInStagedActions,
        };

        return IOccupiedBy.visit<React.ReactElement | null>(occupiedBy, {
            alive: occupiedByAlive => (
                <BasicTile
                    {...commonProps}
                    className={styles.actionablePiece}
                    keyString={getGameTileKey(occupiedByAlive, rowIndex, columnIndex)}
                    onClick={maybeSelectTile(occupiedByAlive)}
                >
                    <MaybeRenderOccupiedBy
                        className={classNames({
                            [styles.spawnOverAliveTile]: canAddAnyStagedAction.canSpawn && isSelectedTile,
                        })}
                        dimension={dimension}
                        occupiedBy={occupiedByAlive}
                    />
                </BasicTile>
            ),
            destroyed: occupiedByDestroyed => (
                <BasicTile
                    {...commonProps}
                    keyString={getGameTileKey(occupiedByDestroyed, rowIndex, columnIndex)}
                    onClick={noop}
                >
                    <MaybeRenderOccupiedBy dimension={dimension} occupiedBy={occupiedByDestroyed} />
                </BasicTile>
            ),
            scored: occupiedByScored => (
                <BasicTile
                    {...commonProps}
                    keyString={getGameTileKey(occupiedByScored, rowIndex, columnIndex)}
                    onClick={maybeSelectTile(undefined)}
                >
                    <MaybeRenderOccupiedBy dimension={dimension} occupiedBy={occupiedByScored} />
                </BasicTile>
            ),
            undefined: () => (
                <BasicTile
                    {...commonProps}
                    className={styles.actionablePiece}
                    keyString={getGameTileKey(undefined, rowIndex, columnIndex)}
                    onClick={maybeSelectTile(undefined)}
                    shouldRenderBackground
                >
                    {canAddAnyStagedAction.canSpawn && !isSelectedTile && (
                        <Spawn squareDimension={dimension} size="board" team={teamOwner()} />
                    )}
                </BasicTile>
            ),
            unknown: () => null,
        });
    }
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        hasPlayerTeamReachedMaxStagedActionsBoolean: hasPlayerTeamReachedMaxStagedActions(state),
        selectedTile: state.interface.selectedTile,
        tilesUsedInStagedActions: getTilesUsedInStagedActions(state),
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
