import {Door, MapPropertiesState, MapState, Point, Prop, Room, SelectedState, ToolMode} from "./state";

export const CREATE_ROOM_ACTION = "CREATE ROOM";
export const CREATE_DOOR_ACTION = "CREATE DOOR";
export const CREATE_PROP_ACTION = "CREATE PROP";
export const CHANGE_MODE_ACTION = "CHANGE MODE";
export const UPDATE_MAP_PROPERTIES = "UPDATE MAP PROPERTIES";
export const UPDATE_ROOM_PROPERTIES = "UPDATE ROOM PROPERTIES";
export const UPDATE_DOOR_PROPERTIES = "UPDATE DOOR PROPERTIES";
export const UPDATE_PROP_PROPERTIES = "UPDATE PROP PROPERTIES";
export const SELECT_OBJECT = "SELECT OBJECT";
export const DELETE_SELECTED = "DELETE SELECTED";
export const IMPORT_MAP = "IMPORT MAP";
export const CHANGE_ZOOM_LEVEL = "CHANGE_ZOOM_LEVEL";

export interface CreateRoomAction {
    type: typeof CREATE_ROOM_ACTION;
    payload: Point[];
}

export interface CreateDoorAction {
    type: typeof CREATE_DOOR_ACTION;
    payload: { from: Point, to: Point };
}

export interface CreatePropAction {
    type: typeof CREATE_PROP_ACTION;
    payload: { location: Point };
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

export interface UpdatePropPropertiesAction {
    type: typeof UPDATE_PROP_PROPERTIES;
    payload: Prop;
}

export interface SelectObjectAction {
    type: typeof SELECT_OBJECT;
    payload: SelectedState;
}

export interface ImportMapAction {
    type: typeof IMPORT_MAP;
    payload: MapState;
}

export interface DeleteSelectedAction {
    type: typeof DELETE_SELECTED;
}

export interface ChangeZoomLevelAction {
    type: typeof CHANGE_ZOOM_LEVEL;
    payload: number;
}

export type DesignerActionTypes = CreateRoomAction |
    CreateDoorAction |
    CreatePropAction |
    ChangeModeAction |
    UpdateMapPropertiesAction |
    UpdateRoomPropertiesAction |
    UpdateDoorPropertiesAction |
    UpdatePropPropertiesAction |
    SelectObjectAction |
    ImportMapAction |
    ChangeZoomLevelAction |
    DeleteSelectedAction;