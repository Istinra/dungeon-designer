import {Room} from "./state";

export const CREATE_ROOM_ACTION = "CREATE_ROOM";

export interface CreateRoomAction {
    type: typeof CREATE_ROOM_ACTION;
    payload: Room;
}



export type DesignerActionTypes = CreateRoomAction;