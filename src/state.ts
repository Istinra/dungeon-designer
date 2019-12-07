export interface DesignerState {
    map: MapState;
    toolMode: ToolMode;
    selected: SelectedState;
    pendingObjects: PropertiesPanelState;
    scale: number;
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
    PROP,
    WALL
}

export interface PropertiesPanelState {
    room: Room;
    door: Door;
    prop: Prop;
}

export interface SelectedState {
    type: ObjectType,
    index: number,
    subIndex?: number;
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
    walls: Wall[];
    color: string;
    wallThickness: number;
}

export interface Wall {
    type: typeof ObjectType.WALL,
    pointIndex: number;
    open: boolean;
}

export interface Door {
    type: typeof ObjectType.DOOR,
    name: string;
    from: Point;
    to: Point;
    color: string;
}

export interface Prop {
    type: typeof  ObjectType.PROP,
    name: string;
    location: Point;
    color: string;
}