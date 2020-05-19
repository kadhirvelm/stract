import { IAllTeams, IBoardMetadata, IGamePiece, IGameTile } from "@stract/api";
import { ICanAddStagedActionToTile } from "@stract/utils";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IStoreState } from "../../store";
import { ChangeSelectedTile } from "../../store/interface/interfaceActions";
import { ISelectedTile } from "../../utils";
import { Piece } from "../pieces";
import { Plus } from "../pieces/pieceSvg";
import styles from "./gameTile.module.scss";

interface IOwnProps {
    boardMetadata: IBoardMetadata;
    canAddAnyStagedAction: ICanAddStagedActionToTile;
    dimension: number;
    gameTile: IGameTile;
    rowIndex: number;
    columnIndex: number;
}

interface IStateProps {
    selectedTile: ISelectedTile | undefined;
}

interface IDispatchProps {
    changeSelectedTile: (selectedTile: ISelectedTile) => void;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

function MaybeRenderOccupiedBy(props: { dimension: number; occupiedBy: IGamePiece[] | undefined }) {
    const { dimension, occupiedBy } = props;
    if (occupiedBy === undefined || occupiedBy.length === 0) {
        return null;
    }

    return <Piece piece={occupiedBy[0]} squareDimension={dimension} />;
}

export class UnconnectedGameTile extends React.PureComponent<IProps> {
    public render() {
        const {
            boardMetadata,
            canAddAnyStagedAction,
            changeSelectedTile,
            columnIndex,
            dimension,
            gameTile,
            rowIndex,
            selectedTile,
        } = this.props;

        const maybeSelectTile = () => {
            if (!canAddAnyStagedAction.isValid) {
                return;
            }

            changeSelectedTile({
                canSpawn: canAddAnyStagedAction.canSpawn,
                columnIndex,
                dimension,
                gameTile,
                rowIndex,
            });
        };

        const teamOwner: keyof IAllTeams<any> = rowIndex < boardMetadata.size.rows / 2 ? "north" : "south";

        return IGameTile.visit(gameTile, {
            free: tile => {
                return (
                    <div
                        className={classNames(styles.freeTile, {
                            [styles.northTile]: teamOwner === "north",
                            [styles.southTile]: teamOwner === "south",
                            [styles.canSelectTile]: canAddAnyStagedAction.isValid && selectedTile === undefined,
                            [styles.isSelectedTile]:
                                selectedTile?.rowIndex === rowIndex && selectedTile?.columnIndex === columnIndex,
                        })}
                        key={tile.occupiedBy[0]?.id ?? `${rowIndex}-${columnIndex}`}
                        onClick={maybeSelectTile}
                        style={{
                            height: dimension,
                            width: dimension,
                            top: rowIndex * dimension,
                            left: columnIndex * dimension,
                        }}
                    >
                        {canAddAnyStagedAction.canSpawn && (
                            <Plus squareDimension={dimension} size="board" team={teamOwner} />
                        )}
                        <MaybeRenderOccupiedBy dimension={dimension} occupiedBy={tile.occupiedBy} />
                    </div>
                );
            },
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
