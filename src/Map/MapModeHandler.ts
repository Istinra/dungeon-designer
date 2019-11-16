import {MapState, Point, SelectedState} from "../state";

export interface MapModeHandler {

    onMouseMove(state: MapState, point: Point, scale: number): void;

    onMapClicked(state: MapState, selected: SelectedState): void;

    draw(state: MapState, selected: SelectedState, ctx: CanvasRenderingContext2D, scale: number): void;

    onMouseDown?(state: MapState, selected: SelectedState): void;

    onMouseOut?(): void;
}
