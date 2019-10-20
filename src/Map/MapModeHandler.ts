import {Point} from "../state";
import {drawLine, GRID_IN_PX} from "./DungonMapConstants";

export interface MapModeHandler {

    onMouseMove(x: number, y: number): void;
    onMapClicked(): void;
    
    draw(ctx: CanvasRenderingContext2D): void;
}

export class RoomMapModeHandler implements MapModeHandler {

    private mouseGridPos: Point = {x: 0, y: 0};
    private activePoints: Point[] = [];

    constructor(private roomCreated: {(points: Point[]): void}) {
    }

    onMapClicked(): void {
        if (this.activePoints.length !== 0 &&
            this.activePoints[0].x === this.mouseGridPos.x &&
            this.activePoints[0].y === this.mouseGridPos.y) {
            this.roomCreated(this.activePoints);
            this.activePoints = [];
        } else {
            this.activePoints.push(this.mouseGridPos);
        }
    }

    onMouseMove(x: number, y: number): void {
        this.mouseGridPos = {
            x: (x - x % GRID_IN_PX + (x % GRID_IN_PX > GRID_IN_PX / 2 ? GRID_IN_PX : 0)) / GRID_IN_PX,
            y: (y - y % GRID_IN_PX + (y % GRID_IN_PX > GRID_IN_PX / 2 ? GRID_IN_PX : 0)) / GRID_IN_PX
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.activePoints.length > 0) {
            ctx.fillStyle = "green";
            ctx.strokeStyle = "green";
            for (let i = 0; i < this.activePoints.length - 1; i++) {
                drawLine(this.activePoints[i], this.activePoints[i + 1], ctx);
            }
            drawLine(this.activePoints[this.activePoints.length - 1], this.mouseGridPos, ctx);
        }
    }
}

// export class DoorMapModeHandler