import {MapState, Point, SelectedState} from "../state";
import {MapModeHandler} from "./MapModeHandler";
import MapRenderer from "./MapRenderer";

export class DoorMapModeHandler implements MapModeHandler {

    private distanceToWall: number;

    private pendingDoor?: { from: Point, to: Point, normalVec: Point };

    public constructor(private doorCreated: { (points: { from: Point, to: Point, normalVec: Point }): void }) {
    }

    onMapClicked(state: MapState, selected: SelectedState): void {
        if (this.pendingDoor) {
            this.doorCreated(this.pendingDoor);
        }
    }

    onMouseMove(state: MapState, point: Point, scale: number): void {
        point = {x: point.x / scale, y: point.y / scale};
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

        //The target point along the wall to place the door
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

        //Distance between the mouse and this wall
        const dx = p.x - t.x, dy = p.y - t.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.distanceToWall && distance < 6) {

            const vx = e.x - s.x, vy = e.y - s.y;
            const vm = Math.sqrt(vx * vx + vy * vy);
            const doorSpanX = 0.5 * vx / vm;
            const doorSpanY = 0.5 * vy / vm;

            let d = {
                from: {
                    x: t.x - doorSpanX,
                    y: t.y - doorSpanY
                },
                to: {
                    x: t.x + doorSpanX,
                    y: t.y + doorSpanY
                },
                normalVec: {
                    x: -vy / vm / 10,
                    y: vx / vm / 10
                }
            };
            if ((s.x === e.x || (s.x < e.x && s.x < d.from.x && e.x > d.to.x) || (s.x > d.from.x && e.x < d.to.x)) &&
                (s.y === e.y || (s.y < e.y && s.y < d.from.y && e.y > d.to.y) || (s.y > d.from.y && e.y < d.to.y))) {
                this.distanceToWall = distance;
                this.pendingDoor = d;
            }
        }
    }

    draw(state: MapState, selected: SelectedState, renderer: MapRenderer, scale: number): void {
        if (this.pendingDoor) {
            renderer.setState({
                strokeColour: "yellow",
                fillColour: "yellow"
            });
            renderer.drawBlock(this.pendingDoor.from, this.pendingDoor.to, this.pendingDoor.normalVec);
        }
    }
}