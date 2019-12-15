import {MapModeHandler} from "./MapModeHandler";
import {Door, MapState, ObjectType, Point, Prop, Room, SelectedState, Wall} from "../state";
import MapRenderer from "./MapRenderer";
import {calculateDoorFromTo, calculateNormalVector} from "./util/MathHelper";
import {pointGenerator} from "./util/MapUtils";

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
            const room = state.rooms[selected.roomIndex];
            let points = room.walls;
            if (this.dragStart) {
                points = this.translatePoints(points);
            }
            renderer.setState({
                strokeColour: room.color,
                fillColour: room.color,
                lineWidth: room.wallThickness,
                pointRadius: 5
            });
            renderer.drawRoom(points, room.name + " (Selected)");
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

    private translatePoints(points: Wall[]): Wall[] {
        const transform: Point = {
            x: this.mousePoint.x - this.dragStart.x,
            y: this.mousePoint.y - this.dragStart.y
        };
        if (this.dragPoint > -1) {
            points = [...points];
            const p = points[this.dragPoint];
            points[this.dragPoint] = {
                ...points[this.dragPoint],
                x: Math.round(p.x + transform.x),
                y: Math.round(p.y + transform.y)
            };
        } else {
            points = points.map(p => ({
                    ...p,
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

        for (let r = 0; r < state.rooms.length; r++) {
            const room = state.rooms[r];
            for (let line of pointGenerator(room.walls)) {
                for (let d = 0; d < line.from.doors.length; d++) {
                    if (this.testDoor(line.from, line.to, line.from.doors[d])) {
                        return {type: ObjectType.DOOR, roomIndex: r, wallIndex: line.index, doorIndex: d};
                    }
                }
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
            for (let line of pointGenerator(room.walls)) {
                if (this.testWall(line.from, line.to)) {
                    return {type: ObjectType.WALL, roomIndex: i, wallIndex: line.index};
                }
            }
        }
        for (let i = 0; i < state.rooms.length; i++) {
            const room = state.rooms[i];
            if (this.testRoom(room)) {
                return {type: ObjectType.ROOM, roomIndex: i};
            }
        }
        return {type: ObjectType.MAP};
    }

    private commitDrag(selected: SelectedState, state: MapState) {
        if (selected.type === ObjectType.ROOM) {
            const room = state.rooms[selected.roomIndex];
            this.updateRoom({
                ...room,
                walls: this.translatePoints(room.walls)
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
            const selectedRoom = state.rooms[selected.roomIndex];
            this.dragPoint = selectedRoom.walls.findIndex(this.testPoint);
            if (this.dragPoint !== -1) {
                return;
            }
        }
        const newSelection: SelectedState = this.findSelection(state);
        console.log(newSelection);
        if (SelectMapModeHandler.selectionDiffers(selected, newSelection)) {
            this.onSelection(newSelection);
        }
    }

    private static selectionDiffers(a: SelectedState, b: SelectedState) {
        if (a === b) {
            return false;
        }
        if (a.type !== b.type) {
            return true;
        }
        for (let k of Object.keys(a)) {
            if (a[k] !== b[k]) {
                return true;
            }
        }
        return true;
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
        const normalVec = calculateNormalVector(from, to);
        return this.testLine(from, to, normalVec.x, normalVec.y);
    }

    private testDoor(wallFrom: Wall, wallTo: Wall, door: Door): boolean {
        const doorFromTo = calculateDoorFromTo(wallFrom, wallTo, door.ratio);
        return this.testWall(doorFromTo.from, doorFromTo.to);
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
        for (let line of pointGenerator(room.walls)) {
            if (this.intersectsLine(line.from, line.to)) {
                count++;
            }
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