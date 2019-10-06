import {Door, MapPropertiesState, Point, Room, ToolMode} from "./state";

export const CREATE_ROOM_ACTION = "CREATE ROOM";
export const CHANGE_MODE_ACTION = "CHANGE MODE";
export const UPDATE_MAP_PROPERTIES = "UPDATE MAP PROPERTIES";
export const UPDATE_ROOM_PROPERTIES = "UPDATE ROOM PROPERTIES";
export const UPDATE_DOOR_PROPERTIES = "UPDATE DOOR PROPERTIES";

export interface CreateRoomAction {
    type: typeof CREATE_ROOM_ACTION;
    payload: Point[];
}

export interface ChangeModeAction {
    type: typeof CHANGE_MODE_ACTION;
    payload: ToolMode;
}

export interface UpdateMapPropertiesAction {
    type: typeof UPDATE_MAP_PROPERTIES;
    payload: MapPropertiesState;
}

export interface UpdateRoomPropertiesAction {
    type: typeof UPDATE_ROOM_PROPERTIES;
    payload: Room;
}

export interface UpdateDoorPropertiesAction {
    type: typeof UPDATE_DOOR_PROPERTIES;
    payload: Door;
}

export type DesignerActionTypes = CreateRoomAction |
    ChangeModeAction |
    UpdateMapPropertiesAction |
    UpdateRoomPropertiesAction |
    UpdateDoorPropertiesAction;