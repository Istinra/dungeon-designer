import {MapModeHandler} from "./MapModeHandler";
import {MapState, Point} from "../state";
import {drawProp} from "./DungonMapConstants";

export class PropMapModeHandler implements MapModeHandler {

    private mousePos: Point;

    constructor(private propCreated: (location: Point) => void) {
    }

    onMouseMove(state: MapState, point: Point, scale: number): void {
        this.mousePos = {
            x: point.x / scale,
            y: point.y / scale
        };
    }

    onMapClicked(state: MapState): void {
        this.propCreated(this.mousePos);
    }

    draw(state: MapState, ctx: CanvasRenderingContext2D, scale: number): void {
        if (this.mousePos) {
            ctx.strokeStyle = "#00FFFF";
            ctx.fillStyle = "#00FFFF";
            drawProp(this.mousePos, ctx, scale);
        }
    }

}