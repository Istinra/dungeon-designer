
export interface DesignerState {
    map: MapState;
    toolMode: ToolMode;
}

export enum ToolMode {
    SELECT,
    ROOM,
    DOOR
}

export interface MapState {
    rooms: Room[];
    doors: Door[];
}

export interface Point {
    x, y: number;
}

export interface Room {
    points: Point[];
    colour: string;
}

export interface Door {
    start: Point;
    finish: Point;
    color: string;
}