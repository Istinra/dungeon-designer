import {MapModeHandler} from "./MapModeHandler";
import {Door, MapState, ObjectType, Point, Prop, Room, SelectedState} from "../state";
import MapRenderer from "./MapRenderer";

export class SelectMapModeHandler implements MapModeHandler {

    private mousePoint: Point = {x: 0, y: 0};

    private dragStart?: Point;
    private dragPoint?: number = -1;

    constructor(private onSelection: (selected: SelectedState) => void,
                private updateRoom: (roomUpdate: Room) => void,
                private updateProp: (propUpdate: Prop) => void) {
    }

    draw(state: MapState, selected: SelectedState, renderer: MapRenderer, scale: number): void {
        if (selected.type === ObjectType.ROOM || selected.type === ObjectType.WALL) {
            const room = state.rooms[selected.index];
            let points = room.points;
            if (this.dragStart) {
                points = this.translatePoints(points);
            }
            renderer.setState({
                strokeColour: room.color,
                fillColour: room.color,
                lineWidth: room.wallThickness,
                pointRadius: 5
            });
            renderer.drawRoom(points, room.walls, room.name + " (Selected)");
        } else if (selected.type === ObjectType.PROP) {
            const prop = state.props[selected.index];
            let location = prop.location;
            if (this.dragStart) {
                location = this.mousePoint;
            }
            renderer.setState({
                strokeColour: prop.color,
                fillColour: prop.color
            });
            renderer.drawProp(location, prop.name + " (Selected)");
        }
    }

    private translatePoints(points: Point[]): Point[] {
        const transform: Point = {
            x: this.mousePoint.x - this.dragStart.x,
            y: this.mousePoint.y - this.dragStart.y
        };
        if (this.dragPoint > -1) {
            points = [...points];
            const p = points[this.dragPoint];
            points[this.dragPoint] = {
                x: Math.round(p.x + transform.x),
                y: Math.round(p.y + transform.y)
            };
        } else {
            points = points.map(p => ({
                    x: Math.round(p.x + transform.x),
                    y: Math.round(p.y + transform.y)
                }
            ));
        }
        return points;
    }

    onMapClicked(state: MapState, selected: SelectedState): void {
        if (this.dragStart) {
            this.commitDrag(selected, state);
        }
    }

    private findSelection(state: MapState): SelectedState {
        for (let i = 0; i < state.doors.length; i++) {
            const door = state.doors[i];
            if (this.testDoor(door)) {
                return {type: ObjectType.DOOR, index: i};
            }
        }
        for (let i = 0; i < state.props.length; i++) {
            const prop = state.props[i];
            if (this.testProp(prop)) {
                return {type: ObjectType.PROP, index: i};
            }
        }
        //Consider having this only happen if the test for a given room passes
        // to avoid looping over rooms multiple times
        for (let i = 0; i < state.rooms.length; i++) {
            const room = state.rooms[i];
            for (let j = 0; j < room.points.length - 1; j++) {
                if (this.testWall(room.points[j], room.points[j + 1])) {
                    return {type: ObjectType.WALL, index: i, subIndex: j};
                }
            }
            if (this.testWall(room.points[room.points.length - 1], room.points[0])) {
                return {type: ObjectType.WALL, index: i, subIndex: room.points.length - 1};
            }
        }
        for (let i = 0; i < state.rooms.length; i++) {
            const room = state.rooms[i];
            if (this.testRoom(room)) {
                return {type: ObjectType.ROOM, index: i};
            }
        }
        return {type: ObjectType.MAP, index: 0};
    }

    private commitDrag(selected: SelectedState, state: MapState) {
        if (selected.type === ObjectType.ROOM) {
            const room = state.rooms[selected.index];
            this.updateRoom({
                ...room,
                points: this.translatePoints(room.points)
            });
        } else if (selected.type === ObjectType.PROP) {
            const prop = state.props[selected.index];
            this.updateProp({
                ...prop,
                location: this.mousePoint
            });
        }
        this.dragPoint = -1;
        this.dragStart = null;
    }

    onMouseMove(state: MapState, point: Point, scale: number): void {
        this.mousePoint = {x: point.x / scale, y: point.y / scale};
    }

    onMouseDown(state: MapState, selected: SelectedState): void {

        this.dragStart = this.mousePoint;
        if (selected.type === ObjectType.ROOM) {
            const selectedRoom = state.rooms[selected.index];
            this.dragPoint = selectedRoom.points.findIndex(this.testPoint);
            if (this.dragPoint !== -1) {
                return;
            }
        }
        const newSelection: SelectedState = this.findSelection(state);
        console.log(newSelection);
        if (selected.type !== newSelection.type ||
            selected.index !== newSelection.index ||
            selected.subIndex !== newSelection.subIndex) {
            this.onSelection(newSelection);
        }
    }

    onMouseOut(): void {
        this.dragStart = null;
        this.dragPoint = -1;
    }

    private testPoint = (p: Point) => {
        return p.x - 0.2 < this.mousePoint.x &&
            p.x + 0.2 > this.mousePoint.x &&
            p.y - 0.2 < this.mousePoint.y &&
            p.y + 0.2 > this.mousePoint.y;
    };

    private testWall(from: Point, to: Point): boolean {

        const vx = to.x - from.x, vy = to.y - from.y;
        let vm = Math.sqrt(vx * vx + vy * vy);
        if (vm === 0) {
            vm = 1;
        }

        return this.testLine(from, to, -vy / vm / 10, vx / vm / 10);
    }

    private testDoor(door: Door): boolean {
        return this.testLine(door.from, door.to, door.normalVec.x, door.normalVec.y);
    }

    private testLine(from: Point, to: Point, x: number, y: number): boolean {

        const cornerA = {x: from.x - x, y: from.y - y};
        const cornerB = {x: from.x + x, y: from.y + y};
        const cornerC = {x: to.x + x, y: to.y + y};
        const cornerD = {x: to.x - x, y: to.y - y};

        let count = 0;

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