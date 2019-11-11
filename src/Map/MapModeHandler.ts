import {MapState, Point} from "../state";

export interface MapModeHandler {

    onMouseMove(state: MapState, point: Point, scale: number): void;

    onMapClicked(state: MapState): void;

    draw(state: MapState, ctx: CanvasRenderingContext2D, scale: number): void;
}
