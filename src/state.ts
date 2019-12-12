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

export type SelectedState = SelectedMap | SelectedRoom | SelectedProp | SelectedWall | SelectedDoor;

export interface PropertiesPanelState {
    room: Room;
    door: Door;
    prop: Prop;
}

export interface SelectedMap {
    type: typeof ObjectType.MAP
}

export interface SelectedRoom {
    type: typeof ObjectType.ROOM,
    roomIndex: number
}

export interface SelectedProp {
    type: typeof ObjectType.PROP,
    index: number
}

export interface SelectedWall {
    type: typeof ObjectType.WALL,
    roomIndex: number,
    wallIndex: number
}

export interface SelectedDoor {
    type: typeof ObjectType.DOOR,
    roomIndex: number,
    wallIndex: number
    doorIndex: number
}

export interface MapState {
    properties: MapPropertiesState;
    rooms: Room[];
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
    walls: Wall[];
    color: string;
    wallThickness: number;
}

export interface Wall extends Point {
    type: typeof ObjectType.WALL,
    open: boolean;
    doors: Door[];
}

export interface Door {
    type: typeof ObjectType.DOOR,
    name: string;
    ratio: number;
    color: string;
}

export interface Prop {
    type: typeof  ObjectType.PROP,
    name: string;
    location: Point;
    color: string;
}