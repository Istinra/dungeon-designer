import {DesignerState, MapState, ObjectType, Point, SelectedMap, SelectedRoom, ToolMode} from "./state";
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
        type: ObjectType.MAP
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
            if (state.toolMode === ToolMode.SELECT && state.selected.type === ObjectType.ROOM) {
                return {
                    ...state,
                    map: {
                        ...state.map,
                        rooms: replaceAt(state.map.rooms, state.selected.roomIndex, action.payload)
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
            if (state.toolMode === ToolMode.SELECT && state.selected.type === ObjectType.DOOR) {
                const room = state.map.rooms[state.selected.roomIndex];
                return {
                    ...state,
                    map: {
                        ...state.map,
                        rooms: replaceAt(state.map.rooms, state.selected.roomIndex,
                            {
                                ...room,
                                walls: replaceAt(room.walls, state.selected.wallIndex, {
                                    ...room.walls[state.selected.wallIndex],
                                    doors: replaceAt(room.walls[state.selected.wallIndex].doors, state.selected.doorIndex, action.payload)
                                })
                            }
                        )
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
            if (state.toolMode === ToolMode.SELECT && state.selected.type === ObjectType.PROP) {
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
            if (state.selected.type === ObjectType.WALL) {
                const room = state.map.rooms[state.selected.roomIndex];
                return {
                    ...state,
                    map: {
                        ...state.map,
                        rooms: replaceAt(state.map.rooms, state.selected.roomIndex,
                            {
                                ...room,
                                walls: replaceAt(room.walls, state.selected.wallIndex, action.payload)
                            }
                        )
                    }
                };
            }
        }
    }
    return state;
}

function splitSelectedWall(state: DesignerState) {
    if (state.selected.type !== ObjectType.WALL) {
        return state;
    }
    const selectedRoom = state.map.rooms[state.selected.roomIndex];

    const newPointIndex = state.selected.wallIndex + 1;
    //Need to account for the last point given rooms can loop
    const from = selectedRoom.walls[state.selected.wallIndex],
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
    const roomSelection: SelectedRoom = {
        type: ObjectType.ROOM, roomIndex: state.selected.roomIndex
    };
    return {
        ...state,
        map: {
            ...state.map,
            rooms: replaceAt(state.map.rooms, state.selected.roomIndex, {...selectedRoom, points: newPoints})
        },
        selected: roomSelection
    };
}

function deleteReducer(state: DesignerState) {
    let update: Partial<MapState>;
    if (state.selected.type === ObjectType.ROOM) {
        update = {
            rooms: removeAt(state.map.rooms, state.selected.roomIndex)
        }
    } else if (state.selected.type === ObjectType.DOOR) {
        const updatedRoom = state.map.rooms[state.selected.roomIndex];
        const updatedWall = updatedRoom.walls[state.selected.wallIndex];
        update = {
            rooms: replaceAt(state.map.rooms, state.selected.roomIndex,
                {
                    ...updatedRoom,
                    walls: replaceAt(updatedRoom.walls, state.selected.wallIndex, {
                        ...updatedWall,
                        doors: removeAt(updatedWall.doors, state.selected.doorIndex)
                    })
                }
            )
        }
    } else if (state.selected.type === ObjectType.PROP) {
        update = {
            props: removeAt(state.map.props, state.selected.index)
        }
    } else {
        return state;
    }
    const mapSelection: SelectedMap = {
        type: ObjectType.MAP
    };
    return {
        ...state,
        map: {
            ...state.map,
            ...update
        },
        selected: mapSelection
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