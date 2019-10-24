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

    private distanceToWall: number;

    private pendingDoor?: { from: Point, to: Point };

    public constructor(private roomsProvider: { (): Room[] },
                       private doorCreated: { (points: { from: Point, to: Point }): void }) {
    }

    onMapClicked(): void {
        if (this.pendingDoor) {
            this.doorCreated(this.pendingDoor);
        }
    }

    onMouseMove(point: Point): void {
        point = {x: point.x / GRID_IN_PX, y: point.y / GRID_IN_PX};
        this.distanceToWall = Number.MAX_SAFE_INTEGER;
        this.pendingDoor = null;
        const rooms = this.roomsProvider();
        for (let room of rooms) {
            for (let i = 0; i < room.points.length - 1; i++) {
                this.setIfClosest(room.points[i], room.points[i + 1], point)
            }
            this.setIfClosest(room.points[room.points.length - 1], room.points[0], point)
        }
    }

    private setIfClosest(s: Point, e: Point, p: Point): void {

        let t: Point;
        if (s.x === e.x) {
            t = {x: s.x, y: p.y};
        } else if (s.y === e.y) {
            t = {x: p.x, y: s.y};
        } else {
            const wallSlope = (s.y - e.y) / (s.x - e.x);
            const wallYIntercept = s.y - wallSlope * s.x;

            const perpSlope = -1 / wallSlope;
            const prepYIntercept = p.y - perpSlope * p.x;

            const tx = (wallYIntercept - prepYIntercept) / (perpSlope - wallSlope);
            const ty = perpSlope * tx + prepYIntercept;

            t = {x: tx, y: ty};
        }

        const dx = p.x - t.x, dy = p.y - t.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.distanceToWall && distance < 6) {

            const vx = e.x - s.x, vy = e.y - s.y;
            const vm = Math.sqrt(vx * vx + vy * vy);
            const doorSpanX = 0.5 * vx / vm;
            const doorSpanY = 0.5 * vy / vm;

            const d = {
                from: {
                    x: t.x - doorSpanX,
                    y: t.y - doorSpanY
                },
                to: {
                    x: t.x + doorSpanX,
                    y: t.y + doorSpanY
                }
            };
            if ((s.x === e.x || (s.x < e.x && s.x < d.from.x && e.x > d.to.x) || (s.x > d.from.x && e.x < d.to.x)) &&
                (s.y === e.y || (s.y < e.y && s.y < d.from.y && e.y > d.to.y) || (s.y > d.from.y && e.y < d.to.y))) {
                this.distanceToWall = distance;
                this.pendingDoor = d;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.pendingDoor) {
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "yellow";
            drawLine(this.pendingDoor.from, this.pendingDoor.to, ctx);
        }
    }
}