import {MapModeHandler} from "./MapModeHandler";
import {MapState, Point, SelectedState} from "../state";
import MapRenderer from "./MapRenderer";

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

    onMapClicked(state: MapState, selected: SelectedState): void {
        this.propCreated(this.mousePos);
    }

    draw(state: MapState, selected: SelectedState, renderer: MapRenderer, scale: number): void {
        if (this.mousePos) {
            renderer.setState({
                strokeColour: "#00FFFF",
                fillColour: "#00FFFF"
            });
            renderer.drawProp(this.mousePos);
        }
    }

}