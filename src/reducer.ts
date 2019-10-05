import {DesignerState, ObjectType, SelectedState, ToolMode} from "./state";
import {
    CHANGE_MODE_ACTION,
    CREATE_ROOM_ACTION,
    DesignerActionTypes,
    UPDATE_PROPERTIES,
    UpdatePropertiesAction
} from "./actions";

const initialState: DesignerState = {
    map: {
        properties: {color: "#111111"},
        rooms: [],
        doors: []
    },
    toolMode: ToolMode.ROOM,
    selected: {
        type: ObjectType.MAP,
        index: 0
    },
    pendingObjects: {
        room: {points: undefined, color: "#FF4444"},
        door: {start: undefined, finish: undefined, color: "#4444FF"}
    }
};

export function designerReducer(state: DesignerState = initialState, action: DesignerActionTypes): DesignerState {
    switch (action.type) {
        case CREATE_ROOM_ACTION:
            return {
                ...state,
                map: {
                    ...state.map, rooms: [...state.map.rooms, {...state.pendingObjects.room, points: action.payload}]
                }
            };
        case CHANGE_MODE_ACTION:
            return {
                ...state,
                toolMode: action.payload
            };
        case UPDATE_PROPERTIES: {
            return updateProperties(state, action);
        }
    }
    return state;
}

//TODO needs refactor
function updateProperties(state: DesignerState, action: UpdatePropertiesAction): DesignerState {
    switch (state.toolMode) {
        case ToolMode.SELECT:
            const selected: SelectedState = state.selected;
            if (selected && selected.type) {
                switch (selected.type) {
                    case ObjectType.ROOM:
                        return {
                            ...state,
                            map: {
                                ...state.map,
                                rooms: replaceAt(state.map.rooms,
                                    selected.index,
                                    {...state.map.rooms[selected.index], ...action.payload}
                                )
                            }
                        };
                    case ObjectType.DOOR:
                        return {
                            ...state,
                            map: {
                                ...state.map,
                                doors: replaceAt(state.map.doors,
                                    selected.index,
                                    {...state.map.doors[selected.index], ...action.payload}
                                )
                            }
                        };
                }
            }
            break;
        case ToolMode.ROOM:
            return {
                ...state,
                pendingObjects: {...state.pendingObjects, room: {...state.pendingObjects.room, ...action.payload}}
            };
        case ToolMode.DOOR:
            return {
                ...state,
                pendingObjects: {...state.pendingObjects, door: {...state.pendingObjects.door, ...action.payload}}
            };

    }
    return {...state, map: {...state.map, properties: {...state.map.properties, ...action.payload}}};
}

function replaceAt(array: any[], index: number, value: any): any[] {
    const ret = array.slice(0);
    ret[index] = value;
    return ret;
}