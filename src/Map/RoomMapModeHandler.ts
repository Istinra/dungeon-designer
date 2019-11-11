import {MapState, Point} from "../state";
import {drawLine} from "./DungonMapConstants";
import {MapModeHandler} from "./MapModeHandler";

export class RoomMapModeHandler implements MapModeHandler {

    private mouseGridPos: Point = {x: 0, y: 0};
    private activePoints: Point[] = [];

    constructor(private roomCreated: (points: Point[]) => void) {
    }

    onMapClicked(state: MapState): void {
        if (this.activePoints.length !== 0 &&
            this.activePoints[0].x === this.mouseGridPos.x &&
            this.activePoints[0].y === this.mouseGridPos.y) {
            this.roomCreated(this.activePoints);
            this.activePoints = [];
        } else {
            this.activePoints.push(this.mouseGridPos);
        }
    }

    onMouseMove(state: MapState, point: Point, scale: number): void {
        this.mouseGridPos = {
            x: (point.x - point.x % scale + (point.x % scale > scale / 2 ? scale : 0)) / scale,
            y: (point.y - point.y % scale + (point.y % scale > scale / 2 ? scale : 0)) / scale
        }
    }

    draw(state: MapState, ctx: CanvasRenderingContext2D, scale: number): void {
        if (this.activePoints.length > 0) {
            ctx.fillStyle = "green";
            ctx.strokeStyle = "green";
            for (let i = 0; i < this.activePoints.length - 1; i++) {
                drawLine(this.activePoints[i], this.activePoints[i + 1], ctx, scale);
            }
            drawLine(this.activePoints[this.activePoints.length - 1], this.mouseGridPos, ctx, scale);
        }
    }
}
