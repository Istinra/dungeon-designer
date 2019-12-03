import {Point, Wall} from "../state";

export default class MapRenderer {

    private ctx: CanvasRenderingContext2D;
    private state: RenderState;

    public init(ctx: CanvasRenderingContext2D, initialState: RenderState) {
        this.ctx = ctx;
        this.state = initialState;
        this.updateCanvas();
    }

    public setState(state: Partial<RenderState>) {
        this.state = {...this.state, ...state};
        this.updateCanvas();
    }

    private updateCanvas(): void {
        this.ctx.fillStyle = this.state.fillColour;
        this.ctx.strokeStyle = this.state.strokeColour;
        this.ctx.lineWidth = this.state.lineWidth;
    }

    public drawGrid(width: number, height: number) {
        this.ctx.fillRect(0, 0, width * this.state.scale, height * this.state.scale);
        for (let i = 0; i <= width; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.state.scale, 0);
            this.ctx.lineTo(i * this.state.scale, height * this.state.scale);
            this.ctx.stroke();
        }
        for (let i = 0; i <= height; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.state.scale);
            this.ctx.lineTo(width * this.state.scale, i * this.state.scale);
            this.ctx.stroke();
        }
    }

    public drawPoint(point: Point) {
        this.ctx.beginPath();
        this.ctx.arc(point.x * this.state.scale, point.y * this.state.scale, this.state.pointRadius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    public drawLine(from: Point, to: Point) {
        this.drawPoint(from);
        this.ctx.beginPath();
        this.ctx.moveTo(from.x * this.state.scale, from.y * this.state.scale);
        this.ctx.lineTo(to.x * this.state.scale, to.y * this.state.scale);
        this.ctx.stroke();
        this.drawPoint(to);
    }

    public drawRoom(points: Point[], walls: Wall[], label?: string) {
        for (let i = 0; i < points.length - 1; i++) {
            if (!walls.some(w => w.open && w.pointIndex === i)) {
                this.drawLine(points[i], points[i + 1]);
            }
        }
        if (!walls.some(w => w.open && w.pointIndex === points.length - 1)) {
            this.drawLine(points[points.length - 1], points[0]);
        }
        if (label) {
            let textPos = points[0];
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                if (point.y <= textPos.y && point.x <= textPos.x) {
                    textPos = point;
                }
            }
            this.ctx.fillText(label, textPos.x * this.state.scale, (textPos.y - 0.3) * this.state.scale);
        }
    }

    public drawJoinLine(points: Point[], endPoint: Point) {
        for (let i = 0; i < points.length - 1; i++) {
            this.drawLine(points[i], points[i + 1]);
        }
        this.drawLine(points[points.length - 1], endPoint);
    }

    public drawBlock(from: Point, to: Point, normalVec: Point, label?: string) {
        const x = normalVec.x * this.state.scale;
        const y = normalVec.y * this.state.scale;

        this.ctx.beginPath();
        this.ctx.moveTo(from.x * this.state.scale - x, from.y * this.state.scale - y);
        this.ctx.lineTo(from.x * this.state.scale + x, from.y * this.state.scale + y);
        this.ctx.lineTo(to.x * this.state.scale + x, to.y * this.state.scale + y);
        this.ctx.lineTo(to.x * this.state.scale - x, to.y * this.state.scale - y);
        this.ctx.fill();

        if (label && label !== "") {
            const leftX = from.x < to.x ? from.x : to.x;
            const bottomY = from.y > to.y ? from.y : to.y;

            const lx = leftX + 0.2 + Math.abs(normalVec.x * normalVec.y) * 150;
            const ly = bottomY - 0.3;
            this.ctx.fillText(label, lx * this.state.scale, ly * this.state.scale);
        }
    }

    public drawProp(location: Point, label?: string) {
        const gridX = Math.floor(location.x), gridY = Math.floor(location.y);

        this.ctx.beginPath();
        this.ctx.moveTo((gridX + 0.2) * this.state.scale, (gridY + 0.2) * this.state.scale);
        this.ctx.lineTo((gridX + 0.8) * this.state.scale, (gridY + 0.2) * this.state.scale);
        this.ctx.lineTo((gridX + 0.2) * this.state.scale, (gridY + 0.8) * this.state.scale);
        this.ctx.lineTo((gridX + 0.8) * this.state.scale, (gridY + 0.8) * this.state.scale);
        this.ctx.lineTo((gridX + 0.2) * this.state.scale, (gridY + 0.2) * this.state.scale);
        this.ctx.stroke();

        if (label && label !== "") {
            this.ctx.fillText(label, (gridX + 1) * this.state.scale, (gridY + 0.6) * this.state.scale);
        }

    }

}

export interface RenderState {
    scale: number;
    lineWidth: number;
    pointRadius: number;
    fillColour: string;
    strokeColour: string;
}