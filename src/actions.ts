import {Door, MapPropertiesState, Room, ToolMode} from "./state";

export const CREATE_ROOM_ACTION = "CREATE_ROOM";
export const CHANGE_MODE_ACTION = "CHANGE_MODE";
export const UPDATE_PROPERTIES = "UPDATE_PROPERTIES";

export interface CreateRoomAction {
    type: typeof CREATE_ROOM_ACTION;
    payload: Room;
}

export interface ChangeModeAction {
    type: typeof CHANGE_MODE_ACTION;
    payload: ToolMode;
}

export interface UpdatePropertiesAction {
    type: typeof UPDATE_PROPERTIES;
    payload: Room | Door | MapPropertiesState;
}

export type DesignerActionTypes = CreateRoomAction | ChangeModeAction | UpdatePropertiesAction;