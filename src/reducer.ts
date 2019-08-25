import {DesignerState, ToolMode} from "./state";
import {CREATE_ROOM_ACTION, DesignerActionTypes} from "./actions";

const initialState: DesignerState = {
    map: {
        rooms: []
    },
    toolMode: ToolMode.ROOM
};

export function designerReducer(state: DesignerState = initialState, action: DesignerActionTypes): DesignerState {
    switch (action.type) {
        case CREATE_ROOM_ACTION:
            return {
                ...state,
                map: {
                    ...state.map, rooms: [...state.map.rooms, action.payload]
                }
            };
    }
    return state;
}