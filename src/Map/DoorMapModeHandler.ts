import {MapState, Point} from "../state";
import {drawLine, GRID_IN_PX} from "./DungonMapConstants";
import {MapModeHandler} from "./MapModeHandler";

export class DoorMapModeHandler implements MapModeHandler {

    private distanceToWall: number;

    private pendingDoor?: { from: Point, to: Point };

    public constructor(private doorCreated: { (points: { from: Point, to: Point }): void }) {
    }

    onMapClicked(state: MapState): void {
        if (this.pendingDoor) {
            this.doorCreated(this.pendingDoor);
        }
    }

    onMouseMove(state: MapState, point: Point): void {
        point = {x: point.x / GRID_IN_PX, y: point.y / GRID_IN_PX};
        this.distanceToWall = Number.MAX_SAFE_INTEGER;
        this.pendingDoor = null;
        for (let room of state.rooms) {
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

    draw(state: MapState, ctx: CanvasRenderingContext2D): void {
        if (this.pendingDoor) {
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "yellow";
            drawLine(this.pendingDoor.from, this.pendingDoor.to, ctx);
        }
    }
}