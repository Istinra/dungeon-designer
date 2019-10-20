import {Point} from "../state";

export const GRID_IN_PX = 40;

export function drawLine(from: Point, to: Point, ctx: CanvasRenderingContext2D) {
    drawPoint(from, ctx);
    ctx.beginPath();
    ctx.moveTo(from.x * GRID_IN_PX, from.y * GRID_IN_PX);
    ctx.lineTo(to.x * GRID_IN_PX, to.y * GRID_IN_PX);
    ctx.stroke();
    drawPoint(to, ctx);
}

export function drawPoint(point: Point, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(point.x * GRID_IN_PX, point.y * GRID_IN_PX, 5, 0, 2 * Math.PI);
    ctx.fill();
}
