
export interface DesignerState {
    map: MapState;
    toolMode: ToolMode;
    selected: SelectedState;
}

export enum ToolMode {
    SELECT,
    ROOM,
    DOOR
}

export enum ObjectType {
    MAP,
    ROOM,
    DOOR
}

export interface SelectedState {
    type: ObjectType,
    index: number;
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