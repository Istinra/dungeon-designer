import React, {MouseEvent} from 'react';
import {DesignerState, ObjectType, Point, Prop, Room, SelectedState, ToolMode, Wall} from "../state";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {
    CHANGE_ZOOM_LEVEL,
    CREATE_DOOR_ACTION,
    CREATE_PROP_ACTION,
    CREATE_ROOM_ACTION,
    SELECT_OBJECT,
    UPDATE_PROP_PROPERTIES,
    UPDATE_ROOM_PROPERTIES
} from "../actions";
import "./DungeonMap.css"
import {MapModeHandler} from "./MapModeHandler";
import {RoomMapModeHandler} from "./RoomMapModeHandler";
import {DoorMapModeHandler} from "./DoorMapModeHandler";
import {SelectMapModeHandler} from "./SelectMapModeHandler";
import {PropMapModeHandler} from "./PropMapModeHandler";
import MapRenderer from "./MapRenderer";

interface DungeonMapStateProps {
    state: DesignerState
}

interface DungeonMapDispatchProps {
    roomCreated(points: Wall[]): void;

    doorCreated(points: { room: number, wall: number, ratio: number }): void;

    propCreated(location: Point): void;

    onSelection(selected: SelectedState): void;

    updateZoomLevel(newScale: number): void;

    updateRoom(roomUpdate: Room): void;

    updateProp(propUpdate: Prop): void;
}

interface DungeonMapState {
    widthPx: number;
    heightPx: number;
}

class DungeonMap extends React.Component<DungeonMapStateProps & DungeonMapDispatchProps, DungeonMapState> {

    private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D;
    private modeHandler: MapModeHandler;
    private readonly modeHandlerMapping: { [key: number]: MapModeHandler };

    private readonly renderer: MapRenderer = new MapRenderer();

    constructor(props: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>) {
        super(props);
        this.state = {
            widthPx: this.props.state.map.properties.width * this.props.state.scale,
            heightPx: this.props.state.map.properties.height * this.props.state.scale
        };
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.modeHandlerMapping = {
            [ToolMode.SELECT]: new SelectMapModeHandler(props.onSelection, props.updateRoom, this.props.updateProp),
            [ToolMode.DOOR]: new DoorMapModeHandler(props.doorCreated),
            [ToolMode.ROOM]: new RoomMapModeHandler(props.roomCreated),
            [ToolMode.PROP]: new PropMapModeHandler(props.propCreated)
        };
        this.modeHandler = this.modeHandlerMapping[this.props.state.toolMode];
    }

    componentDidMount(): void {
        this.ctx = this.canvasRef.current.getContext('2d');
        this.renderer.init(this.ctx, {
            scale: this.props.state.scale,
            lineWidth: 1,
            pointRadius: 5,
            fillColour: "000",
            strokeColour: "000"
        });
        requestAnimationFrame(this.draw);
    }

    private draw = () => {
        this.drawGrid();
        this.drawRooms();
        this.drawDoors();
        this.drawProps();
        this.modeHandler.draw(this.props.state.map, this.props.state.selected, this.renderer, this.props.state.scale);
        requestAnimationFrame(this.draw)
    };

    private drawGrid() {
        this.renderer.setState({
            fillColour: this.props.state.map.properties.backgroundColor,
            strokeColour: this.props.state.map.properties.gridLineColor,
            lineWidth: 1
        });
        this.renderer.drawGrid(this.props.state.map.properties.width, this.props.state.map.properties.height);
    }

    private drawRooms() {
        for (let room of this.props.state.map.rooms) {
            if (this.props.state.toolMode === ToolMode.SELECT &&
                this.props.state.selected && this.props.state.selected.type === ObjectType.ROOM &&
                room === this.props.state.map.rooms[this.props.state.selected.roomIndex]) {
                continue;
            }
            this.renderer.setState({
                strokeColour: room.color,
                fillColour: room.color,
                lineWidth: room.wallThickness,
                pointRadius: 2
            });
            this.renderer.drawRoom(room.walls, room.name);
        }
    }

    private drawDoors(): void {
        for (let room of this.props.state.map.rooms) {
            for (let i = 0; i < room.walls.length; i++) {
                const wall = room.walls[i];
                for (let door of wall.doors) {
                    this.renderer.setState({
                        strokeColour: door.color,
                        fillColour: door.color
                    });
                    const toWall = i + 1 < room.walls.length ? i + 1 : 0;
                    this.renderer.drawDoor(wall, room.walls[toWall], door.ratio, door.name);
                }
            }
        }
    }

    private drawProps(): void {
        for (let prop of this.props.state.map.props) {
            if (this.props.state.toolMode === ToolMode.SELECT &&
                this.props.state.selected && this.props.state.selected.type === ObjectType.PROP &&
                prop === this.props.state.map.props[this.props.state.selected.index]) {
                continue;
            }
            this.renderer.setState({
                strokeColour: prop.color,
                fillColour: prop.color
            });
            this.renderer.drawProp(prop.location, prop.name);
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        let x: number = event.clientX - this.canvasRef.current.offsetLeft;
        let y: number = event.clientY - this.canvasRef.current.offsetTop;
        this.modeHandler.onMouseMove(this.props.state.map, {x: x, y: y}, this.props.state.scale);
    };

    private onMapClicked = () => {
        this.modeHandler.onMapClicked(this.props.state.map, this.props.state.selected);
    };

    private onMouseDown = () => {
        if (this.modeHandler.onMouseDown) {
            this.modeHandler.onMouseDown(this.props.state.map, this.props.state.selected);
        }
    };

    private onMouseOut = () => {
        if (this.modeHandler.onMouseOut) {
            this.modeHandler.onMouseOut();
        }
    };

    componentDidUpdate(prevProps: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>,
                       prevState: Readonly<{}>, snapshot?: any): void {
        this.modeHandler = this.modeHandlerMapping[this.props.state.toolMode];
        if (prevProps.state.map.properties.width !== this.props.state.map.properties.width ||
            prevProps.state.map.properties.height !== this.props.state.map.properties.height ||
            prevProps.state.scale !== this.props.state.scale) {
            this.setState({
                widthPx: this.props.state.map.properties.width * this.props.state.scale,
                heightPx: this.props.state.map.properties.height * this.props.state.scale
            });
            this.renderer.setState({
                scale: this.props.state.scale
            });
        }
    }

    render() {
        return <div className="DungeonMap">
            <canvas ref={this.canvasRef}
                    width={this.state.widthPx + "px"} height={this.state.heightPx + "px"}
                    onMouseMove={this.onMouseMove} onClick={this.onMapClicked}
                    onMouseDown={this.onMouseDown} onMouseOut={this.onMouseOut}/>
            <div style={{position: "fixed", bottom: 10, left: 10}}>
                Zoom Level: <br/>
                <input type="range" style={{direction: "rtl"}} onChange={this.updateZoom}
                       max="50" min="1" value={this.props.state.scale} step="5"/>
            </div>

        </div>
    }

    private updateZoom = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.updateZoomLevel(event.currentTarget.valueAsNumber);
    }
}

function mapStateToProps(state: DesignerState): DungeonMapStateProps {
    return {state: state};
}

function mapStateToDispatch(dispatch: Dispatch): DungeonMapDispatchProps {
    return {
        roomCreated: (walls: Wall[]) =>
            dispatch({type: CREATE_ROOM_ACTION, payload: walls}),
        doorCreated: (points: { room: number, wall: number, ratio: number }) =>
            dispatch({type: CREATE_DOOR_ACTION, payload: points}),
        propCreated: (location: Point) =>
            dispatch({type: CREATE_PROP_ACTION, payload: {location: location}}),
        onSelection: (selected: SelectedState) =>
            dispatch({type: SELECT_OBJECT, payload: selected}),
        updateZoomLevel: (newScale: number) => dispatch({type: CHANGE_ZOOM_LEVEL, payload: newScale}),
        updateRoom: (roomUpdate: Room) => dispatch({type: UPDATE_ROOM_PROPERTIES, payload: roomUpdate}),
        updateProp: (propUpdate: Prop) => dispatch({type: UPDATE_PROP_PROPERTIES, payload: propUpdate})
    };
}

export default connect(mapStateToProps, mapStateToDispatch)(DungeonMap);