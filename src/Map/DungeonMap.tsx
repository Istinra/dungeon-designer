import React, {MouseEvent} from 'react';
import {DesignerState, Point, ToolMode} from "../state";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {CREATE_ROOM_ACTION} from "../actions";
import "./DungeonMap.css"
import {drawLine, GRID_IN_PX} from "./DungonMapConstants";
import {DoorMapModeHandler, MapModeHandler, RoomMapModeHandler} from "./MapModeHandler";

interface DungeonMapStateProps {
    state: DesignerState
    width: number;
    height: number;
}

interface DungeonMapDispatchProps {
    roomCreated(points: Point[]): void;
}

class DungeonMap extends React.Component<DungeonMapStateProps & DungeonMapDispatchProps> {

    private readonly canvasRef: React.RefObject<HTMLCanvasElement>;
    private readonly widthPx: number;
    private readonly heightPx: number;

    private ctx: CanvasRenderingContext2D;
    private modeHandler: MapModeHandler;
    private readonly modeHandlerMapping: { [key: number]: MapModeHandler };

    constructor(props: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>) {
        super(props);
        this.widthPx = this.props.width * GRID_IN_PX;
        this.heightPx = this.props.height * GRID_IN_PX;
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.modeHandlerMapping = {
            [ToolMode.SELECT]: new RoomMapModeHandler(props.roomCreated),
            [ToolMode.DOOR]: new DoorMapModeHandler(
                () => this.props.state.map.rooms
            ),
            [ToolMode.ROOM]: new RoomMapModeHandler(props.roomCreated)
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
        this.modeHandler.draw(this.ctx);
        requestAnimationFrame(this.draw)
    };

    private drawGrid() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.widthPx, this.heightPx);
        this.ctx.strokeStyle = "red";
        for (let i = 0; i <= this.props.width; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * GRID_IN_PX, 0);
            this.ctx.lineTo(i * GRID_IN_PX, this.heightPx);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.props.height; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * GRID_IN_PX);
            this.ctx.lineTo(this.widthPx, i * GRID_IN_PX);
            this.ctx.stroke();
        }
    }

    private drawRooms() {
        for (let room of this.props.state.map.rooms) {
            this.ctx.strokeStyle = room.color;
            this.ctx.fillStyle = room.color;
            for (let i = 0; i < room.points.length - 1; i++) {
                drawLine(room.points[i], room.points[i + 1], this.ctx);
            }
            drawLine(room.points[room.points.length - 1], room.points[0], this.ctx);
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        let x: number = event.clientX - this.canvasRef.current.offsetLeft;
        let y: number = event.clientY - this.canvasRef.current.offsetTop;
        this.modeHandler.onMouseMove({x: x, y: y});
    };

    private onMapClicked = () => {
        this.modeHandler.onMapClicked();
    };


    componentDidUpdate(prevProps: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>,
                       prevState: Readonly<{}>, snapshot?: any): void {
        this.modeHandler = this.modeHandlerMapping[this.props.state.toolMode];
    }

    render() {
        return <div className="DungeonMap">
            <canvas ref={this.canvasRef}
                    width={this.widthPx + "px"} height={this.heightPx + "px"}
                    onMouseMove={this.onMouseMove} onClick={this.onMapClicked}/>
        </div>
    }
}

function mapStateToProps(state: DesignerState, ownProps): DungeonMapStateProps {
    return {
        width: ownProps.width,
        height: ownProps.height,
        state: state
    }
}

function mapStateToDispatch(dispatch: Dispatch): DungeonMapDispatchProps {
    return {
        roomCreated: (points: Point[]) =>
            dispatch({type: CREATE_ROOM_ACTION, payload: points})
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(DungeonMap);