import {MapModeHandler} from "./MapModeHandler";
import {MapState, ObjectType, Point, SelectedState} from "../state";
import {GRID_IN_PX} from "./DungonMapConstants";

export class SelectMapModeHandler implements MapModeHandler {

    private mousePoint: Point = {x: 0, y: 0};

    constructor(private onSelection: (selected: SelectedState) => void) {
    }

    onMouseMove(state: MapState, point: Point): void {
        this.mousePoint = {x: point.x / GRID_IN_PX, y: point.y / GRID_IN_PX};
    }

    draw(state: MapState, ctx: CanvasRenderingContext2D): void {
    }

    onMapClicked(state: MapState): void {
        for (let i = 0; i < state.rooms.length; i++) {
            const room = state.rooms[i];
            if (this.testRoom(room)) {
                this.onSelection({type: ObjectType.ROOM, index: i});
                return;
            }
        }
        this.onSelection({type: ObjectType.MAP, index: 0});
    }

    private testRoom(room): boolean {
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

    private intersectsLine(from, to) {
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