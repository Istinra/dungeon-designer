export interface DesignerState {
    map: MapState;
    toolMode: ToolMode;
    selected: SelectedState;
    pendingObjects: PropertiesPanelState;
}

export enum ToolMode {
    SELECT,
    ROOM,
    DOOR,
    PROP
}

export enum ObjectType {
    MAP,
    ROOM,
    DOOR,
    PROP
}

export interface PropertiesPanelState {
    room: Room;
    door: Door;
    prop: Prop;
}

export interface SelectedState {
    type: ObjectType,
    index: number;
}

export interface MapState {
    properties: MapPropertiesState;
    rooms: Room[];
    doors: Door[];
    props: Prop[];
}

export interface MapPropertiesState {
    type: typeof ObjectType.MAP,
    name: string;
    gridLineColor: string;
    backgroundColor: string;
    width,
    height: number;
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

export interface Prop {
    type: typeof  ObjectType.PROP,
    name: string;
    location: Point;
    color: string;
}