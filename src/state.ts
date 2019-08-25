
export interface DesignerState {
    map: MapState;
    toolMode: ToolMode;
}

export enum ToolMode {
    SELECT,
    ROOM
}

export interface MapState {
    rooms: Room[];
}

export interface Point {
    x, y: number;
}

export interface Room {
    points: Point[];
    colour: string;
}