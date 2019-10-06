import {DesignerState, ObjectType, ToolMode} from "./state";
import {
    CHANGE_MODE_ACTION,
    CREATE_ROOM_ACTION,
    DesignerActionTypes,
    UPDATE_DOOR_PROPERTIES,
    UPDATE_MAP_PROPERTIES,
    UPDATE_ROOM_PROPERTIES,
} from "./actions";

const initialState: DesignerState = {
    map: {
        properties: {color: "#111111", type: ObjectType.MAP},
        rooms: [],
        doors: []
    },
    toolMode: ToolMode.ROOM,
    selected: {
        type: ObjectType.MAP,
        index: 0
    },
    pendingObjects: {
        room: {points: undefined, color: "#FF4444", name: "", type: ObjectType.ROOM},
        door: {start: undefined, finish: undefined, color: "#4444FF", type: ObjectType.DOOR}
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
        case UPDATE_MAP_PROPERTIES: {
            return {...state, map: {...state.map, properties: action.payload}}
        }
        case UPDATE_ROOM_PROPERTIES: {
            if (state.toolMode === ToolMode.SELECT) {
                return {
                    ...state,
                    map: {
                        ...state.map,
                        rooms: replaceAt(state.map.rooms, state.selected.index, action.payload)
                    }
                };
            } else {
                return {
                    ...state,
                    pendingObjects: {...state.pendingObjects, room: action.payload}
                };
            }
        }
        case UPDATE_DOOR_PROPERTIES: {
            if (state.toolMode === ToolMode.SELECT) {
                return {
                    ...state,
                    map: {
                        ...state.map,
                        doors: replaceAt(state.map.doors, state.selected.index, action.payload)
                    }
                };
            } else {
                return {
                    ...state,
                    pendingObjects: {...state.pendingObjects, door: action.payload}
                };
            }
        }
    }
    return state;
}

function replaceAt(array: any[], index: number, value: any): any[] {
    const ret = array.slice(0);
    ret[index] = value;
    return ret;
}