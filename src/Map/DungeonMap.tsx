import React, {MouseEvent} from 'react';
import {DesignerState, ObjectType, Point, Room, SelectedState, ToolMode} from "../state";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {
    CHANGE_ZOOM_LEVEL,
    CREATE_DOOR_ACTION,
    CREATE_PROP_ACTION,
    CREATE_ROOM_ACTION,
    SELECT_OBJECT,
    UPDATE_ROOM_PROPERTIES
} from "../actions";
import "./DungeonMap.css"
import {drawBlock, drawProp, drawRoom} from "./DungonMapConstants";
import {MapModeHandler} from "./MapModeHandler";
import {RoomMapModeHandler} from "./RoomMapModeHandler";
import {DoorMapModeHandler} from "./DoorMapModeHandler";
import {SelectMapModeHandler} from "./SelectMapModeHandler";
import {PropMapModeHandler} from "./PropMapModeHandler";

interface DungeonMapStateProps {
    state: DesignerState
}

interface DungeonMapDispatchProps {
    roomCreated(points: Point[]): void;

    doorCreated(points: { from: Point, to: Point, normalVec: Point }): void;

    propCreated(location: Point): void;

    onSelection(selected: SelectedState): void;

    updateZoomLevel(newScale: number): void;

    updateRoom(roomUpdate: Room): void;
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

    constructor(props: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>) {
        super(props);
        this.state = {
            widthPx: this.props.state.map.properties.width * this.props.state.scale,
            heightPx: this.props.state.map.properties.height * this.props.state.scale
        };
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.modeHandlerMapping = {
            [ToolMode.SELECT]: new SelectMapModeHandler(props.onSelection, props.updateRoom),
            [ToolMode.DOOR]: new DoorMapModeHandler(props.doorCreated),
            [ToolMode.ROOM]: new RoomMapModeHandler(props.roomCreated),
            [ToolMode.PROP]: new PropMapModeHandler(props.propCreated)
        };
        this.modeHandler = this.modeHandlerMapping[this.props.state.toolMode];
    }

    componentDidMount(): void {
        this.ctx = this.canvasRef.current.getContext('2d');
        requestAnimationFrame(this.draw);
    }

    private draw = () => {
        this.drawGrid();
        this.drawRooms();
        this.drawDoors();
        this.drawProps();
        this.modeHandler.draw(this.props.state.map, this.props.state.selected, this.ctx, this.props.state.scale);
        requestAnimationFrame(this.draw)
    };

    private drawGrid() {
        this.ctx.fillStyle = this.props.state.map.properties.backgroundColor;
        this.ctx.fillRect(0, 0, this.state.widthPx, this.state.heightPx);
        this.ctx.strokeStyle = this.props.state.map.properties.gridLineColor;
        for (let i = 0; i <= this.props.state.map.properties.width; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.props.state.scale, 0);
            this.ctx.lineTo(i * this.props.state.scale, this.state.heightPx);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.props.state.map.properties.height; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.props.state.scale);
            this.ctx.lineTo(this.state.widthPx, i * this.props.state.scale);
            this.ctx.stroke();
        }
    }

    private drawRooms() {
        for (let room of this.props.state.map.rooms) {
            if (this.props.state.selected && this.props.state.selected.type === ObjectType.ROOM &&
                room === this.props.state.map.rooms[this.props.state.selected.index]) {
                continue;
            }
            this.ctx.strokeStyle = room.color;
            this.ctx.fillStyle = room.color;
            drawRoom(room.points, room.wallThickness, this.ctx, this.props.state.scale, room.name);
        }
    }

    private drawDoors(): void {
        for (let door of this.props.state.map.doors) {
            this.ctx.strokeStyle = door.color;
            this.ctx.fillStyle = door.color;
            drawBlock(door.from, door.to, door.normalVec, this.ctx, this.props.state.scale, door.name);
        }
    }

    private drawProps(): void {
        for (let prop of this.props.state.map.props) {
            this.ctx.strokeStyle = prop.color;
            this.ctx.fillStyle = prop.color;
            drawProp(prop.location, this.ctx, this.props.state.scale, prop.name);
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
            })
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
        roomCreated: (points: Point[]) =>
            dispatch({type: CREATE_ROOM_ACTION, payload: points}),
        doorCreated: (points: { from: Point, to: Point }) =>
            dispatch({type: CREATE_DOOR_ACTION, payload: points}),
        propCreated: (location: Point) =>
            dispatch({type: CREATE_PROP_ACTION, payload: {location: location}}),
        onSelection: (selected: SelectedState) =>
            dispatch({type: SELECT_OBJECT, payload: selected}),
        updateZoomLevel: (newScale: number) => dispatch({type: CHANGE_ZOOM_LEVEL, payload: newScale}),
        updateRoom: (roomUpdate: Room) => dispatch({type: UPDATE_ROOM_PROPERTIES, payload: roomUpdate})
    };
}

export default connect(mapStateToProps, mapStateToDispatch)(DungeonMap);