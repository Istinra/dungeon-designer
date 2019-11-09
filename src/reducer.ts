import {DesignerState, ObjectType, ToolMode} from "./state";
import {
    CHANGE_MODE_ACTION,
    CREATE_DOOR_ACTION,
    CREATE_PROP_ACTION,
    CREATE_ROOM_ACTION,
    DesignerActionTypes,
    IMPORT_MAP,
    SELECT_OBJECT,
    UPDATE_DOOR_PROPERTIES,
    UPDATE_MAP_PROPERTIES,
    UPDATE_PROP_PROPERTIES,
    UPDATE_ROOM_PROPERTIES,
} from "./actions";

const initialState: DesignerState = {
    map: {
        properties: {
            name: "#1 Dungeon",
            type: ObjectType.MAP,
            gridLineColor: "#22222f",
            backgroundColor: "#000000",
            width: 20,
            height: 20
        },
        rooms: [],
        doors: [],
        props: []
    },
    toolMode: ToolMode.ROOM,
    selected: {
        type: ObjectType.MAP,
        index: 0
    },
    pendingObjects: {
        room: {points: undefined, color: "#FF4444", name: "", type: ObjectType.ROOM, wallThickness: 2},
        door: {from: undefined, to: undefined, normalVec: undefined, color: "#FFFF77", type: ObjectType.DOOR},
        prop: {type: ObjectType.PROP, name: "", color: "#00FFFF", location: undefined}
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
        case CREATE_DOOR_ACTION:
            return {
                ...state,
                map: {
                    ...state.map, doors: [...state.map.doors, {...state.pendingObjects.door, ...action.payload}]
                }
            };
        case CREATE_PROP_ACTION:
            return {
                ...state,
                map: {
                    ...state.map, props: [...state.map.props, {...state.pendingObjects.prop, ...action.payload}]
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
        case UPDATE_PROP_PROPERTIES: {
            if (state.toolMode === ToolMode.SELECT) {
                return {
                    ...state,
                    map: {
                        ...state.map,
                        props: replaceAt(state.map.props, state.selected.index, action.payload)
                    }
                };
            } else {
                return {
                    ...state,
                    pendingObjects: {...state.pendingObjects, prop: action.payload}
                };
            }
        }
        case SELECT_OBJECT: {
            return {...state, selected: action.payload};
        }
        case IMPORT_MAP: {
            return {...state, map: action.payload};
        }
    }
    return state;
}

function replaceAt(array: any[], index: number, value: any): any[] {
    const ret = array.slice(0);
    ret[index] = value;
    return ret;
}