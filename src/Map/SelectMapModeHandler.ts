import {MapModeHandler} from "./MapModeHandler";
import {MapState, Point, SelectedState} from "../state";

export class SelectMapModeHandler implements MapModeHandler {

    constructor(private onSelection: (selected: SelectedState) => void) {
    }


    draw(state: MapState, ctx: CanvasRenderingContext2D): void {
    }

    onMapClicked(state: MapState): void {
        //TODO Intersect test
    }

    onMouseMove(state: MapState, point: Point): void {
    }


}