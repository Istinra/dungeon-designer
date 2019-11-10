import {Point} from "../state";

export const GRID_IN_PX = 40;

export function drawLine(from: Point, to: Point, ctx: CanvasRenderingContext2D, lineWidth = 1) {
    ctx.lineWidth = lineWidth;
    drawPoint(from, ctx);
    ctx.beginPath();
    ctx.moveTo(from.x * GRID_IN_PX, from.y * GRID_IN_PX);
    ctx.lineTo(to.x * GRID_IN_PX, to.y * GRID_IN_PX);
    ctx.stroke();
    drawPoint(to, ctx);
    ctx.lineWidth = 1;
}

export function drawPoint(point: Point, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(point.x * GRID_IN_PX, point.y * GRID_IN_PX, 5, 0, 2 * Math.PI);
    ctx.fill();
}

export function drawRoom(points: Point[], wallThickness: number, ctx: CanvasRenderingContext2D, label?: string) {
    for (let i = 0; i < points.length - 1; i++) {
        drawLine(points[i], points[i + 1], ctx, wallThickness);
    }
    drawLine(points[points.length - 1], points[0], ctx, wallThickness);
    if (label) {
        let textPos = points[0];
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            if (point.y <= textPos.y && point.x <= textPos.x) {
                textPos = point;
            }
        }
        ctx.fillText(label, textPos.x * GRID_IN_PX, (textPos.y - 0.3) * GRID_IN_PX);
    }
}

export function drawBlock(from: Point, to: Point, normalVec: Point, ctx: CanvasRenderingContext2D, label?: string) {
    const x = normalVec.x * GRID_IN_PX;
    const y = normalVec.y * GRID_IN_PX;

    ctx.beginPath();
    ctx.moveTo(from.x * GRID_IN_PX - x, from.y * GRID_IN_PX - y);
    ctx.lineTo(from.x * GRID_IN_PX + x, from.y * GRID_IN_PX + y);
    ctx.lineTo(to.x * GRID_IN_PX + x, to.y * GRID_IN_PX + y);
    ctx.lineTo(to.x * GRID_IN_PX - x, to.y * GRID_IN_PX - y);
    ctx.fill();

    if (label && label !== "") {
        const leftX = from.x < to.x ? from.x : to.x;
        const bottomY = from.y > to.y ? from.y : to.y;

        const lx = leftX + 0.2 + Math.abs(normalVec.x * normalVec.y) * 150;
        const ly = bottomY - 0.3;
        ctx.fillText(label, lx * GRID_IN_PX, ly * GRID_IN_PX);
    }
}

export function drawProp(location: Point, ctx: CanvasRenderingContext2D, label?: string) {
    const gridX = Math.floor(location.x), gridY = Math.floor(location.y);

    ctx.beginPath();
    ctx.moveTo((gridX + 0.2) * GRID_IN_PX, (gridY + 0.2) * GRID_IN_PX);
    ctx.lineTo((gridX + 0.8) * GRID_IN_PX, (gridY + 0.2) * GRID_IN_PX);
    ctx.lineTo((gridX + 0.2) * GRID_IN_PX, (gridY + 0.8) * GRID_IN_PX);
    ctx.lineTo((gridX + 0.8) * GRID_IN_PX, (gridY + 0.8) * GRID_IN_PX);
    ctx.lineTo((gridX + 0.2) * GRID_IN_PX, (gridY + 0.2) * GRID_IN_PX);
    ctx.stroke();

    if (label && label !== "") {
        ctx.fillText(label, (gridX + 1) * GRID_IN_PX, (gridY + 0.6) * GRID_IN_PX);
    }

}
