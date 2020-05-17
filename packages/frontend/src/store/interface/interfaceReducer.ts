import { TypedReducer, setWith } from "redoodle";
import { ChangeSelectedTile } from "./interfaceActions";
import { ISelectedTile } from "../../utils";

export interface IInterfaceState {
    selectedTile: ISelectedTile | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    selectedTile: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(ChangeSelectedTile.TYPE, (state, selectedTile) => {
        if (
            state.selectedTile?.rowIndex === selectedTile?.rowIndex &&
            state.selectedTile?.columnIndex === selectedTile?.columnIndex
        ) {
            return setWith(state, { selectedTile: undefined });
        }

        return setWith(state, { selectedTile });
    })
    .build();
