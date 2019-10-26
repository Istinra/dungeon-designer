import {MapState, Point} from "../state";

export interface MapModeHandler {

    onMouseMove(state: MapState, point: Point): void;

    onMapClicked(state: MapState): void;

    draw(state: MapState, ctx: CanvasRenderingContext2D): void;
}
