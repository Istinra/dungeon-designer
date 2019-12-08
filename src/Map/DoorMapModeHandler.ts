import {MapState, Point, Room, SelectedState} from "../state";
import {MapModeHandler} from "./MapModeHandler";
import MapRenderer from "./MapRenderer";

export class DoorMapModeHandler implements MapModeHandler {

    private distanceToWall: number;

    private pendingDoor?: { room: number, wall: number, ratio: number };

    public constructor(private doorCreated: { (points: { room: number, wall: number, ratio: number }): void }) {
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
        for (let i = 0; i < state.rooms.length; i++) {
            let room = state.rooms[i];
            for (let j = 0; j < room.walls.length - 1; j++) {
                this.setIfClosest(room.walls[j], room.walls[j + 1], point, i, j);
            }
            this.setIfClosest(room.walls[room.walls.length - 1], room.walls[0], point, i, room.walls.length - 1);
        }
    }

    private setIfClosest(s: Point, e: Point, p: Point, roomNum: number, wallNum: number): void {

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

            const tvx = t.x - s.x, tvy = t.y - s.y;
            const tvm = Math.sqrt(tvx * tvx + tvy * tvy);

            const ratio = tvm / vm;
            const distFromStart = vm * ratio;
            const distToEnd = vm - distFromStart;

            if (distFromStart >= 0.5 && distToEnd >= 0.5) {
                this.distanceToWall = distance;
                this.pendingDoor = {room: roomNum, wall: wallNum, ratio: ratio};
            }
        }
    }

    draw(state: MapState, selected: SelectedState, renderer: MapRenderer, scale: number): void {
        if (this.pendingDoor) {
            renderer.setState({
                strokeColour: "yellow",
                fillColour: "yellow"
            });
            const room: Room = state.rooms[this.pendingDoor.room];
            const toWall = this.pendingDoor.wall + 1 < room.walls.length ? this.pendingDoor.wall + 1 : 0;
            renderer.drawDoor(room.walls[this.pendingDoor.wall], room.walls[toWall], this.pendingDoor.ratio);
        }
    }
}