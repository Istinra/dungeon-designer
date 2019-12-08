import {DesignerState, MapState, ObjectType, Point, ToolMode} from "./state";
import {
    CHANGE_MODE_ACTION,
    CHANGE_ZOOM_LEVEL,
    CREATE_DOOR_ACTION,
    CREATE_PROP_ACTION,
    CREATE_ROOM_ACTION,
    DELETE_SELECTED,
    DesignerActionTypes,
    IMPORT_MAP,
    SELECT_OBJECT,
    SPLIT_WALL_PROPERTIES,
    UPDATE_DOOR_PROPERTIES,
    UPDATE_MAP_PROPERTIES,
    UPDATE_PROP_PROPERTIES,
    UPDATE_ROOM_PROPERTIES,
    UPDATE_WALL_PROPERTIES,
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
        props: []
    },
    toolMode: ToolMode.ROOM,
    selected: {
        type: ObjectType.MAP,
        index: 0
    },
    pendingObjects: {
        room: {walls: [], color: "#FF4444", name: "", type: ObjectType.ROOM, wallThickness: 2},
        door: {ratio: undefined, name: "", color: "#FFFF77", type: ObjectType.DOOR},
        prop: {type: ObjectType.PROP, name: "", color: "#00FFFF", location: undefined}
    },
    scale: 40
};

export function designerReducer(state: DesignerState = initialState, action: DesignerActionTypes): DesignerState {
    switch (action.type) {
        case CREATE_ROOM_ACTION:
            return {
                ...state,
                map: {
                    ...state.map, rooms: [...state.map.rooms, {...state.pendingObjects.room, walls: action.payload}]
                }
            };
        case CREATE_DOOR_ACTION:
            return {
                ...state,
                map: {
                    ...state.map,
                    rooms: replaceAt(state.map.rooms, action.payload.room,
                        {
                            ...state.map.rooms[action.payload.room],
                            walls: replaceAt(state.map.rooms[action.payload.room].walls, action.payload.wall,
                                {
                                    ...state.map.rooms[action.payload.room].walls[action.payload.wall],
                                    doors: [...state.map.rooms[action.payload.room].walls[action.payload.wall].doors, {
                                        ...state.pendingObjects.door,
                                        ratio: action.payload.ratio
                                    }]
                                }
                            )
                        })
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
                    //TODO plz fix
                    // map: {
                    //     ...state.map,
                    //     doors: replaceAt(state.map.doors, state.selected.index, action.payload)
                    // }
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
        case DELETE_SELECTED: {
            return deleteReducer(state);
        }
        case IMPORT_MAP: {
            return {...state, map: action.payload};
        }
        case CHANGE_ZOOM_LEVEL: {
            return {...state, scale: action.payload};
        }
        case SPLIT_WALL_PROPERTIES: {
            return splitSelectedWall(state);
        }
        case UPDATE_WALL_PROPERTIES: {
            //TODO plz fix
            // const room = state.map.rooms[state.selected.index];
            // const wallIndex = room.walls.findIndex(w => w.pointIndex === state.selected.subIndex);
            // return {
            //     ...state,
            //     map: {
            //         ...state.map,
            //         rooms: replaceAt(state.map.rooms, state.selected.index,
            //             {
            //                 ...room,
            //                 walls: wallIndex === -1 ? [action.payload] : replaceAt(room.walls, wallIndex, action.payload)
            //             }
            //         )
            //     }
            // };
        }
    }
    return state;
}

function splitSelectedWall(state: DesignerState) {
    const selectedRoom = state.map.rooms[state.selected.index];

    const newPointIndex = state.selected.subIndex + 1;
    //Need to account for the last point given rooms can loop
    const from = selectedRoom.walls[state.selected.subIndex],
        to = selectedRoom.walls[newPointIndex === selectedRoom.walls.length ? 0 : newPointIndex];

    const newPoint: Point = {
        x: from.x + (to.x - from.x) / 2,
        y: from.y + (to.y - from.y) / 2
    };

    let newPoints: Point[];
    if (newPointIndex === selectedRoom.walls.length) {
        newPoints = [
            ...selectedRoom.walls.slice(0, newPointIndex),
            newPoint
        ];
    } else {
        newPoints = [
            ...selectedRoom.walls.slice(0, newPointIndex),
            newPoint,
            ...selectedRoom.walls.slice(newPointIndex)
        ]
    }
    return {
        ...state,
        map: {
            ...state.map,
            rooms: replaceAt(state.map.rooms, state.selected.index, {...selectedRoom, points: newPoints})
        },
        selected: {...state.selected, type: ObjectType.ROOM}
    };
}

function deleteReducer(state: DesignerState) {
    let update: Partial<MapState>;
    if (state.selected.type === ObjectType.ROOM) {
        update = {
            rooms: removeAt(state.map.rooms, state.selected.index)
        }
    } else if (state.selected.type === ObjectType.DOOR) {
        return state;
        //TODO plz fix
        // update = {
        //     doors: removeAt(state.map.doors, state.selected.index)
        // }
    } else if (state.selected.type === ObjectType.PROP) {
        update = {
            props: removeAt(state.map.props, state.selected.index)
        }
    } else {
        return state;
    }
    return {
        ...state,
        map: {
            ...state.map,
            ...update
        },
        selected: {
            type: ObjectType.MAP,
            index: 0
        }
    }
}

function replaceAt(array: any[], index: number, value: any): any[] {
    const ret = array.slice(0);
    ret[index] = value;
    return ret;
}

function removeAt(array: any[], index: number): any[] {
    return [...array.slice(0, index), ...array.slice(index + 1)];
}