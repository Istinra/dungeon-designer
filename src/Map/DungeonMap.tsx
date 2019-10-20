import React, {MouseEvent} from 'react';
import {DesignerState, Point} from "../state";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {CREATE_ROOM_ACTION} from "../actions";
import "./DungeonMap.css"
import {drawLine, GRID_IN_PX} from "./DungonMapConstants";
import {RoomMapModeHandler} from "./MapModeHandler";

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
    private modeHandler: RoomMapModeHandler;

    constructor(props: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>) {
        super(props);
        this.widthPx = this.props.width * GRID_IN_PX;
        this.heightPx = this.props.height * GRID_IN_PX;
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.modeHandler = new RoomMapModeHandler(props.roomCreated);
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
        this.modeHandler.onMouseMove(x, y);
    };

    private onMapClicked = () => {
        this.modeHandler.onMapClicked();

        //s = start, e = end, p = pointer, t = target along the line
        let sx = 1, sy = 2, ex = 3, ey = 3, px = 2, py = 2;

        let wallSlope = (sy - ey) / (sx - ex);
        let wallYIntercept = sy - wallSlope * sx;

        let perpSlope = -1 / wallSlope;
        let prepYIntercept = py - perpSlope * px;

        const tx = (wallYIntercept - prepYIntercept) / (perpSlope - wallSlope);
        const ty = perpSlope * tx + prepYIntercept;
        console.log(tx);
        console.log(ty);

        if ((tx > sx && tx > ex) || (ty > sy && ty > ey)) {
            //Not in the line!
            console.log("Point not on line, abort");
        } else {
            let vx = ex - sx;
            let vy = ey - sy;
            let vm = Math.sqrt(vx * vx + vy * vy);
            vx = vx/vm;
            vy = vy/vm;

            let fromX = tx + 0.5 * vx ;
            let fromY = ty + 0.5 * vy;
            let toX = tx - 0.5 * vx;
            let toY = ty - 0.5 * vy;
            console.log(`${fromX}, ${fromY} to ${toX}, ${toY} `);
        }
    };

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