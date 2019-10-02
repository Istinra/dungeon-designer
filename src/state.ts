export interface DesignerState {
    map: MapState;
    toolMode: ToolMode;
    selected: SelectedState;
    pendingObjects: PropertiesPanelState;
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

export interface PropertiesPanelState {
    room: Room;
    door: Door;
}

export interface SelectedState {
    type: ObjectType,
    index: number;
}

export interface MapState {
    properties: MapPropertiesState;
    rooms: Room[];
    doors: Door[];
}

export interface MapPropertiesState {
    color: string;
}

export interface Point {
    x, y: number;
}

export interface Room {
    points: Point[];
    color: string;
}

export interface Door {
    start: Point;
    finish: Point;
    color: string;
}