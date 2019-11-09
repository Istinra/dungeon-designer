import {MapModeHandler} from "./MapModeHandler";
import {MapState, Point} from "../state";
import {drawProp, GRID_IN_PX} from "./DungonMapConstants";

export class PropMapModeHandler implements MapModeHandler {

    private mouseGridPos: Point;

    constructor(private propCreated: (location: Point) => void) {
    }

    onMouseMove(state: MapState, point: Point): void {
        this.mouseGridPos = {
            x: point.x / GRID_IN_PX,
            y: point.y / GRID_IN_PX
        };
    }

    onMapClicked(state: MapState): void {
        this.propCreated(this.mouseGridPos);
    }

    draw(state: MapState, ctx: CanvasRenderingContext2D): void {
        if (this.mouseGridPos) {
            ctx.strokeStyle = "#00FFFF";
            ctx.fillStyle = "#00FFFF";
            drawProp(this.mouseGridPos, ctx);
        }
    }

}