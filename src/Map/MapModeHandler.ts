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

        let t: Point;
        if (s.x === e.x) {
            t = {x: s.x, y: p.y};
        } else if (s.y === e.y) {
            t = {x: p.x, y: s.y};
        } else {
            let wallSlope = (s.y - e.y) / (s.x - e.x);
            let wallYIntercept = s.y - wallSlope * s.x;

            let perpSlope = -1 / wallSlope;
            let prepYIntercept = p.y - perpSlope * p.x;

            const tx = (wallYIntercept - prepYIntercept) / (perpSlope - wallSlope);
            const ty = perpSlope * tx + prepYIntercept;

            t = {x: tx, y: ty};
        }

        if ((s.x === e.x || (s.x < e.x && t.x > s.x + 0.25 && t.x < e.x - 0.25) || (t.x < s.x - 0.25 && t.x > e.x + 0.25)) &&
            (s.y === e.y || (s.y < e.y && t.y > s.y + 0.25 && t.y < e.y - 0.25) || (t.y < s.y - 0.25 && t.y > e.y + 0.25))) {
            let dx = p.x - t.x, dy = p.y - t.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (this.distanceToWall > dist) {
                this.closestRoom = room;
                this.closestWall = {s: s, e: e};
                this.doorPoint = {x: t.x, y: t.y};
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