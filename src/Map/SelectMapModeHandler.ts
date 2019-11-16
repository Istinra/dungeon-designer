import {MapModeHandler} from "./MapModeHandler";
import {Door, MapState, ObjectType, Point, Prop, Room, SelectedState} from "../state";
import {drawRoom} from "./DungonMapConstants";

export class SelectMapModeHandler implements MapModeHandler {

    private mousePoint: Point = {x: 0, y: 0};

    private dragStart?: Point;

    constructor(private onSelection: (selected: SelectedState) => void,
                private updateRoom: (roomUpdate: Room) => void) {
    }

    draw(state: MapState, selected: SelectedState, ctx: CanvasRenderingContext2D, scale: number): void {
        if (selected.type === ObjectType.ROOM) {
            const room = state.rooms[selected.index];
            let points = room.points;
            if (this.dragStart) {
                points = this.translatePoints(points);
            }
            ctx.strokeStyle = room.color;
            ctx.fillStyle = room.color;
            drawRoom(points, room.wallThickness, ctx, scale, room.name + " (Selected)");
        }
    }

    private translatePoints(points): Point[] {
        const transform: Point = {
            x: this.mousePoint.x - this.dragStart.x,
            y: this.mousePoint.y - this.dragStart.y
        };
        points = points.map(p => ({
                x: Math.round(p.x + transform.x),
                y: Math.round(p.y + transform.y)
            }
        ));
        return points;
    }

    onMapClicked(state: MapState, selected: SelectedState): void {

        if (this.dragStart) {
            const room = state.rooms[selected.index];
            this.updateRoom({
                ...room,
                points: this.translatePoints(room.points)
            });
            this.dragStart = null;
            return;
        }

        for (let i = 0; i < state.doors.length; i++) {
            const door = state.doors[i];
            if (this.testDoor(door)) {
                this.onSelection({type: ObjectType.DOOR, index: i});
                return;
            }
        }
        for (let i = 0; i < state.props.length; i++) {
            const prop = state.props[i];
            if (this.testProp(prop)) {
                this.onSelection({type: ObjectType.PROP, index: i});
                return;
            }
        }
        for (let i = 0; i < state.rooms.length; i++) {
            const room = state.rooms[i];
            if (this.testRoom(room)) {
                this.onSelection({type: ObjectType.ROOM, index: i});
                return;
            }
        }
        this.onSelection({type: ObjectType.MAP, index: 0});
    }

    onMouseMove(state: MapState, point: Point, scale: number): void {
        this.mousePoint = {x: point.x / scale, y: point.y / scale};
    }

    onMouseDown(state: MapState, selected: SelectedState): void {
        //On mouse down record the current position + what got selected +
        if (selected.type === ObjectType.ROOM && this.testRoom(state.rooms[selected.index])) {
            this.dragStart = this.mousePoint;
        }
    }

    onMouseOut(): void {
        this.dragStart = null;
    }

    private testDoor(door: Door): boolean {
        let count = 0;

        const x = door.normalVec.x;
        const y = door.normalVec.y;

        const cornerA = {x: door.from.x - x, y: door.from.y - y};
        const cornerB = {x: door.from.x + x, y: door.from.y + y};
        const cornerC = {x: door.to.x + x, y: door.to.y + y};
        const cornerD = {x: door.to.x - x, y: door.to.y - y};

        if (this.intersectsLine(cornerA, cornerB)) {
            count++;
        }
        if (this.intersectsLine(cornerB, cornerC)) {
            count++;
        }
        if (this.intersectsLine(cornerC, cornerD)) {
            count++;
        }
        if (this.intersectsLine(cornerD, cornerA)) {
            count++;
        }

        return count % 2 === 1;
    }

    private testProp(prop: Prop): boolean {
        const gridX = Math.floor(prop.location.x), gridY = Math.floor(prop.location.y);
        return this.mousePoint.x > gridX && this.mousePoint.x < gridX + 1 &&
            this.mousePoint.y > gridY && this.mousePoint.y < gridY + 1;
    }

    private testRoom(room: Room): boolean {
        let count = 0;
        for (let i = 0; i < room.points.length - 1; i++) {
            if (this.intersectsLine(room.points[i], room.points[i + 1])) {
                count++;
            }
        }
        if (this.intersectsLine(room.points[room.points.length - 1], room.points[0])) {
            count++;
        }
        return count % 2 === 1;
    }

    private intersectsLine(from, to): boolean {
        if (from.y <= to.y) {
            if (this.mousePoint.y <= from.y || this.mousePoint.y > to.y ||
                (this.mousePoint.x >= from.x && this.mousePoint.x >= to.x)) {
                return false;
            } else if (this.mousePoint.x < from.x && this.mousePoint.x < to.x) {
                return true;
            } else {
                return (this.mousePoint.y - from.y) / (this.mousePoint.x - from.x) > (to.y - from.y) / (to.x - from.x);
            }
        } else {
            return this.intersectsLine(to, from);
        }
    }

}