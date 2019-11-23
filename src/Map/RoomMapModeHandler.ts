import {MapState, Point, SelectedState} from "../state";
import {MapModeHandler} from "./MapModeHandler";
import MapRenderer from "./MapRenderer";

export class RoomMapModeHandler implements MapModeHandler {

    private mouseGridPos: Point = {x: 0, y: 0};
    private activePoints: Point[] = [];
    private dragStart?: Point;

    constructor(private roomCreated: (points: Point[]) => void) {
    }

    onMapClicked(state: MapState, selected: SelectedState): void {
        if (this.isDragging()) {
            this.roomCreated(this.getDragCorners());
        }  else {
            if (this.activePoints.length !== 0 &&
                this.activePoints[0].x === this.mouseGridPos.x &&
                this.activePoints[0].y === this.mouseGridPos.y) {
                this.roomCreated(this.activePoints);
                this.activePoints = [];
            } else {
                this.activePoints.push(this.mouseGridPos);
            }
        }
        this.dragStart = null;
    }

    onMouseDown(state: MapState, selected: SelectedState): void {
        if (this.activePoints.length === 0) {
            this.dragStart = this.mouseGridPos;
        }
    }

    onMouseOut(): void {
        this.dragStart = null;
    }

    onMouseMove(state: MapState, point: Point, scale: number): void {
        this.mouseGridPos = {
            x: Math.round(point.x / scale),
            y: Math.round(point.y / scale)
        }
    }

    draw(state: MapState, selected: SelectedState, renderer: MapRenderer, scale: number): void {
        if (this.isDragging()) {
            renderer.setState({
                strokeColour: "green",
                fillColour: "green",
                lineWidth: 1,
                pointRadius: 2
            });
            const dragCorners = this.getDragCorners();
            renderer.drawRoom(dragCorners);
        } else if (this.activePoints.length > 0) {
            renderer.setState({
                strokeColour: "green",
                fillColour: "green",
                lineWidth: 1,
                pointRadius: 2
            });
            renderer.drawJoinLine(this.activePoints, this.mouseGridPos);
        }
    }

    private isDragging(): boolean {
        return this.dragStart && this.dragStart.x !== this.mouseGridPos.x && this.dragStart.y !== this.mouseGridPos.y
    }

    private getDragCorners(): Point[] {
        return [
            {x: this.dragStart.x, y: this.dragStart.y},
            {x: this.mouseGridPos.x, y: this.dragStart.y},
            {x: this.mouseGridPos.x, y: this.mouseGridPos.y},
            {x: this.dragStart.x, y: this.mouseGridPos.y}
        ]
    }
}
