import {Point, Room} from "../state";
import {drawLine, GRID_IN_PX} from "./DungonMapConstants";

export interface MapModeHandler {

    onMouseMove(point: Point): void;

    onMapClicked(): void;

    draw(ctx: CanvasRenderingContext2D): void;
}

export class RoomMapModeHandler implements MapModeHandler {

    private mouseGridPos: Point = {x: 0, y: 0};
    private activePoints: Point[] = [];

    constructor(private roomCreated: { (points: Point[]): void }) {
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

    onMouseMove(point: Point): void {
        this.mouseGridPos = {
            x: (point.x - point.x % GRID_IN_PX + (point.x % GRID_IN_PX > GRID_IN_PX / 2 ? GRID_IN_PX : 0)) / GRID_IN_PX,
            y: (point.y - point.y % GRID_IN_PX + (point.y % GRID_IN_PX > GRID_IN_PX / 2 ? GRID_IN_PX : 0)) / GRID_IN_PX
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
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

export class DoorMapModeHandler implements MapModeHandler {

    private closestRoom: Room;
    private closestWall: { s: Point, e: Point };
    private doorPoint: Point;
    private distanceToWall: number;

    public constructor(private roomsProvider: { (): Room[] },
                       private doorCreated: { (points: { from: Point, to: Point }): void }) {
    }

    onMapClicked(): void {
        if (this.distanceToWall && this.closestWall && this.doorPoint) {
            this.doorCreated(this.calculateDoor());
        }
    }

    onMouseMove(point: Point): void {
        point = {x: point.x / GRID_IN_PX, y: point.y / GRID_IN_PX};
        this.distanceToWall = Number.MAX_SAFE_INTEGER;
        this.closestRoom = null;
        this.closestWall = null;
        this.doorPoint = null;
        const rooms = this.roomsProvider();
        for (let room of rooms) {
            for (let i = 0; i < room.points.length - 1; i++) {
                this.setIfClosest(room, room.points[i], room.points[i + 1], point)
            }
            this.setIfClosest(room, room.points[room.points.length - 1], room.points[0], point)
        }
    }

    private setIfClosest(room: Room, s: Point, e: Point, p: Point): void {

        let wallSlope = s.x - e.x === 0 ? 0 : (s.y - e.y) / (s.x - e.x);
        let wallYIntercept = s.y - wallSlope * s.x;

        let perpSlope = wallSlope === 0 ? 0 : -1 / wallSlope;
        let prepYIntercept = p.y - perpSlope * p.x;

        const tx = perpSlope - wallSlope === 0 ? 0 : (wallYIntercept - prepYIntercept) / (perpSlope - wallSlope);
        const ty = perpSlope * tx + prepYIntercept;

        if ((tx > s.x && tx > e.x) || (ty > s.y && ty > e.y)) {
            //Not in the line!
            // console.log("Point not on line, abort");
        } else {
            let dx = p.x - tx, dy = p.y - ty;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (this.distanceToWall > dist) {
                this.closestRoom = room;
                this.closestWall = {s: s, e: e};
                this.doorPoint = {x: tx, y: ty};
                this.distanceToWall = dist;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.closestWall) {
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "yellow";
            let {from, to} = this.calculateDoor();
            drawLine(from, to, ctx);
        }
    }

    private calculateDoor(): { from: Point, to: Point } {
        let {s, e} = this.closestWall;
        let vx = e.x - s.x;
        let vy = e.y - s.y;
        let vm = Math.sqrt(vx * vx + vy * vy);
        vx = vx / vm;
        vy = vy / vm;
        return {
            from: {
                x: this.doorPoint.x + 0.5 * vx,
                y: this.doorPoint.y + 0.5 * vy
            },
            to: {
                x: this.doorPoint.x - 0.5 * vx,
                y: this.doorPoint.y - 0.5 * vy
            }
        }
    }
}