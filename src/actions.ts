import {Door, MapPropertiesState, MapState, Point, Room, SelectedState, ToolMode} from "./state";

export const CREATE_ROOM_ACTION = "CREATE ROOM";
export const CREATE_DOOR_ACTION = "CREATE DOOR";
export const CHANGE_MODE_ACTION = "CHANGE MODE";
export const UPDATE_MAP_PROPERTIES = "UPDATE MAP PROPERTIES";
export const UPDATE_ROOM_PROPERTIES = "UPDATE ROOM PROPERTIES";
export const UPDATE_DOOR_PROPERTIES = "UPDATE DOOR PROPERTIES";
export const SELECT_OBJECT = "SELECT OBJECT";
export const IMPORT_MAP = "IMPORT MAP";

export interface CreateRoomAction {
    type: typeof CREATE_ROOM_ACTION;
    payload: Point[];
}

export interface CreateDoorAction {
    type: typeof CREATE_DOOR_ACTION;
    payload: { from: Point, to: Point };
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

export interface SelectObjectAction {
    type: typeof SELECT_OBJECT;
    payload: SelectedState;
}

export interface ImportMapAction {
    type: typeof IMPORT_MAP;
    payload: MapState;
}

export type DesignerActionTypes = CreateRoomAction |
    CreateDoorAction |
    ChangeModeAction |
    UpdateMapPropertiesAction |
    UpdateRoomPropertiesAction |
    UpdateDoorPropertiesAction |
    SelectObjectAction |
    ImportMapAction;