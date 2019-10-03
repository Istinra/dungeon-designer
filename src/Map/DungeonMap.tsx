import React, {MouseEvent} from 'react';
import {DesignerState, Point} from "../state";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {CREATE_ROOM_ACTION} from "../actions";
import "./DungeonMap.css"

interface DungeonMapStateProps {
    state: DesignerState
    width: number;
    height: number;
}

interface DungeonMapDispatchProps {
    roomCreated(points: Point[]): void;
}

const gridInPx = 40;

class DungeonMap extends React.Component<DungeonMapStateProps & DungeonMapDispatchProps> {

    private readonly canvasRef: React.RefObject<HTMLCanvasElement>;
    private readonly widthPx: number;
    private readonly heightPx: number;

    private ctx: CanvasRenderingContext2D;
    private mouseGridPos: Point;
    private activePoints: Point[] = [];

    constructor(props: Readonly<DungeonMapStateProps & DungeonMapDispatchProps>) {
        super(props);
        this.widthPx = this.props.width * gridInPx;
        this.heightPx = this.props.height * gridInPx;
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    componentDidMount(): void {
        this.ctx = this.canvasRef.current.getContext('2d');
        requestAnimationFrame(this.draw);
    }

    private draw = () => {
        this.drawGrid();
        this.drawRooms();
        if (this.activePoints.length > 0) {
            this.ctx.fillStyle = "green";
            this.ctx.strokeStyle = "green";
            for (let i = 0; i < this.activePoints.length - 1; i++) {
                this.drawLine(this.activePoints[i], this.activePoints[i + 1]);
            }
            this.drawLine(this.activePoints[this.activePoints.length - 1], this.mouseGridPos);
        }
        requestAnimationFrame(this.draw)
    };

    private drawGrid() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.widthPx, this.heightPx);
        this.ctx.strokeStyle = "red";
        for (let i = 0; i <= this.props.width; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * gridInPx, 0);
            this.ctx.lineTo(i * gridInPx, this.heightPx);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.props.height; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * gridInPx);
            this.ctx.lineTo(this.widthPx, i * gridInPx);
            this.ctx.stroke();
        }
    }

    private drawRooms() {
        for (let room of this.props.state.map.rooms) {
            this.ctx.strokeStyle = room.color;
            this.ctx.fillStyle = room.color;
            for (let i = 0; i < room.points.length - 1; i++) {
                this.drawLine(room.points[i], room.points[i + 1]);
            }
            this.drawLine(room.points[room.points.length - 1], room.points[0]);
        }
    }

    private drawLine(from: Point, to: Point) {
        this.drawPoint(from);
        this.ctx.beginPath();
        this.ctx.moveTo(from.x * gridInPx, from.y * gridInPx);
        this.ctx.lineTo(to.x * gridInPx, to.y * gridInPx);
        this.ctx.stroke();
        this.drawPoint(to);
    }

    private drawPoint(point: Point) {
        this.ctx.beginPath();
        this.ctx.arc(point.x * gridInPx, point.y * gridInPx, 5, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    private onMouseMove = (event: MouseEvent) => {
        let x: number = event.clientX - this.canvasRef.current.offsetLeft;
        let y: number = event.clientY - this.canvasRef.current.offsetTop;
        this.mouseGridPos = {
            x: (x - x % gridInPx + (x % gridInPx > gridInPx / 2 ? gridInPx : 0)) / gridInPx,
            y: (y - y % gridInPx + (y % gridInPx > gridInPx / 2 ? gridInPx : 0)) / gridInPx
        }
    };

    private onMapClicked = () => {
        if (this.activePoints.length !== 0 &&
            this.activePoints[0].x === this.mouseGridPos.x &&
            this.activePoints[0].y === this.mouseGridPos.y) {
            this.props.roomCreated(this.activePoints);
            this.activePoints = [];
        } else {
            this.activePoints.push(this.mouseGridPos);
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