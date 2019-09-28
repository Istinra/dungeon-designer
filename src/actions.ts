import {Room, ToolMode} from "./state";

export const CREATE_ROOM_ACTION = "CREATE_ROOM";
export const CHANGE_MODE_ACTION = "CHANGE_MODE";

export interface CreateRoomAction {
    type: typeof CREATE_ROOM_ACTION;
    payload: Room;
}

export interface ChangeModeAction {
    type: typeof CHANGE_MODE_ACTION;
    payload: ToolMode;
}



export type DesignerActionTypes = CreateRoomAction | ChangeModeAction;