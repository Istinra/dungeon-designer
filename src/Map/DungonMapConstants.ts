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

export function drawBlock(from: Point, to: Point, normalVec: Point, ctx: CanvasRenderingContext2D) {
    const x = normalVec.x * GRID_IN_PX;
    const y = normalVec.y * GRID_IN_PX;

    ctx.beginPath();
    ctx.moveTo(from.x * GRID_IN_PX - x, from.y * GRID_IN_PX - y);
    ctx.lineTo(from.x * GRID_IN_PX + x, from.y * GRID_IN_PX + y);
    ctx.lineTo(to.x * GRID_IN_PX + x, to.y * GRID_IN_PX + y);
    ctx.lineTo(to.x * GRID_IN_PX - x, to.y * GRID_IN_PX - y);
    ctx.fill();
}

export function drawProp(location: Point, ctx: CanvasRenderingContext2D) {
    //TODO render props differently
    console.log(location);
    drawPoint(location, ctx);
}
