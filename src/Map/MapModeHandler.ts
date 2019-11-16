import {MapState, Point, SelectedState} from "../state";
import MapRenderer from "./MapRenderer";

export interface MapModeHandler {

    onMouseMove(state: MapState, point: Point, scale: number): void;

    onMapClicked(state: MapState, selected: SelectedState): void;

    draw(state: MapState, selected: SelectedState, renderer: MapRenderer, scale: number): void;

    onMouseDown?(state: MapState, selected: SelectedState): void;

    onMouseOut?(): void;
}
