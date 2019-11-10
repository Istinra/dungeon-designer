import React, {MouseEvent} from 'react';
import {DesignerState, Point, SelectedState, ToolMode} from "../state";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {CREATE_DOOR_ACTION, CREATE_PROP_ACTION, CREATE_ROOM_ACTION, SELECT_OBJECT} from "../actions";
import "./DungeonMap.css"
import {drawBlock, drawProp, drawRoom, GRID_IN_PX} from "./DungonMapConstants";
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
            widthPx: this.props.state.map.properties.width * GRID_IN_PX,
            heightPx: this.props.state.map.properties.height * GRID_IN_PX
        };
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.modeHandlerMapping = {
            [ToolMode.SELECT]: new SelectMapModeHandler(props.onSelection),
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
        this.modeHandler.draw(this.props.state.map, this.ctx);
        requestAnimationFrame(this.draw)
    };

    private drawGrid() {
        this.ctx.fillStyle = this.props.state.map.properties.backgroundColor;
        this.ctx.fillRect(0, 0, this.state.widthPx, this.state.heightPx);
        this.ctx.strokeStyle = this.props.state.map.properties.gridLineColor;
        for (let i = 0; i <= this.props.state.map.properties.width; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * GRID_IN_PX, 0);
            this.ctx.lineTo(i * GRID_IN_PX, this.state.heightPx);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.props.state.map.properties.height; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * GRID_IN_PX);
            this.ctx.lineTo(this.state.widthPx, i * GRID_IN_PX);
            this.ctx.stroke();
        }
    }

    private drawRooms() {
        for (let room of this.props.state.map.rooms) {
            this.ctx.strokeStyle = room.color;
            this.ctx.fillStyle = room.color;
            drawRoom(room.points, room.wallThickness, this.ctx, room.name);
        }
    }

    private drawDoors(): void {
        for (let door of this.props.state.map.doors) {
            this.ctx.strokeStyle = door.color;
            this.ctx.fillStyle = door.color;
            drawBlock(door.from, door.to, door.normalVec, this.ctx, door.name);
        }
    }

    private drawProps(): void {
        for (let prop of this.props.state.map.props) {
            this.ctx.strokeStyle = prop.color;
            this.ctx.fillStyle = prop.color;
            drawProp(prop.location, this.ctx, prop.name);
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        let x: number = event.clientX - this.canvasRef.current.offsetLeft;
        let y: number = event.clientY - this.canvasRef.current.offsetTop;
        this.modeHandler.onMouseMove(this.props.state.map, {x: x, y: y});
    };

    private onMapClicked = () => {
        this.modeHandler.onMapClicked(this.props.state.map);
    };


    componentDidUpdate(prevProps: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>,
                       prevState: Readonly<{}>, snapshot?: any): void {
        this.modeHandler = this.modeHandlerMapping[this.props.state.toolMode];
        if (prevProps.state.map.properties.width !== this.props.state.map.properties.width ||
            prevProps.state.map.properties.height !== this.props.state.map.properties.height) {
            this.setState({
                widthPx: this.props.state.map.properties.width * GRID_IN_PX,
                heightPx: this.props.state.map.properties.height * GRID_IN_PX
            })
        }
    }

    render() {
        return <div className="DungeonMap">
            <canvas ref={this.canvasRef}
                    width={this.state.widthPx + "px"} height={this.state.heightPx + "px"}
                    onMouseMove={this.onMouseMove} onClick={this.onMapClicked}/>
        </div>
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
            dispatch({type: SELECT_OBJECT, payload: selected})

    };
}

export default connect(mapStateToProps, mapStateToDispatch)(DungeonMap);