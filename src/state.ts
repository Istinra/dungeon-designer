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
    type: typeof ObjectType.MAP,
    gridLineColor: string;
    backgroundColor: string;
}

export interface Point {
    x,
    y: number;
}

export interface Room {
    type: typeof ObjectType.ROOM,
    name: string;
    points: Point[];
    color: string;
    wallThickness: number;
}

export interface Door {
    type: typeof ObjectType.DOOR,
    from: Point;
    to: Point;
    normalVec: Point;
    color: string;
}