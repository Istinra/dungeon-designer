import {MapState, Point, SelectedState} from "../state";
import {MapModeHandler} from "./MapModeHandler";
import MapRenderer from "./MapRenderer";

export class RoomMapModeHandler implements MapModeHandler {

    private mouseGridPos: Point = {x: 0, y: 0};
    private activePoints: Point[] = [];

    constructor(private roomCreated: (points: Point[]) => void) {
    }

    onMapClicked(state: MapState, selected: SelectedState): void {
        if (this.activePoints.length !== 0 &&
            this.activePoints[0].x === this.mouseGridPos.x &&
            this.activePoints[0].y === this.mouseGridPos.y) {
            this.roomCreated(this.activePoints);
            this.activePoints = [];
        } else {
            this.activePoints.push(this.mouseGridPos);
        }
    }

    onMouseMove(state: MapState, point: Point, scale: number): void {
        this.mouseGridPos = {
            x: Math.round(point.x / scale),
            y: Math.round(point.y / scale)
        }
    }

    draw(state: MapState, selected: SelectedState, renderer: MapRenderer, scale: number): void {
        if (this.activePoints.length > 0) {
            renderer.setState({
                strokeColour: "green",
                fillColour: "green",
                lineWidth: 1,
                pointRadius: 2
            });
            renderer.drawJoinLine(this.activePoints, this.mouseGridPos);
        }
    }
}
