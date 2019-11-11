import {Point} from "../state";

export function drawLine(from: Point, to: Point, ctx: CanvasRenderingContext2D, scale: number, lineWidth: number = 1) {
    ctx.lineWidth = lineWidth;
    drawPoint(from, ctx, scale);
    ctx.beginPath();
    ctx.moveTo(from.x * scale, from.y * scale);
    ctx.lineTo(to.x * scale, to.y * scale);
    ctx.stroke();
    drawPoint(to, ctx, scale);
    ctx.lineWidth = 1;
}

export function drawPoint(point: Point, ctx: CanvasRenderingContext2D, scale: number) {
    ctx.beginPath();
    ctx.arc(point.x * scale, point.y * scale, 5, 0, 2 * Math.PI);
    ctx.fill();
}

export function drawRoom(points: Point[], wallThickness: number, ctx: CanvasRenderingContext2D, scale: number, label?: string) {
    for (let i = 0; i < points.length - 1; i++) {
        drawLine(points[i], points[i + 1], ctx, scale, wallThickness);
    }
    drawLine(points[points.length - 1], points[0], ctx, scale, wallThickness);
    if (label) {
        let textPos = points[0];
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            if (point.y <= textPos.y && point.x <= textPos.x) {
                textPos = point;
            }
        }
        ctx.fillText(label, textPos.x * scale, (textPos.y - 0.3) * scale);
    }
}

export function drawBlock(from: Point, to: Point, normalVec: Point, ctx: CanvasRenderingContext2D, scale: number, label?: string) {
    const x = normalVec.x * scale;
    const y = normalVec.y * scale;

    ctx.beginPath();
    ctx.moveTo(from.x * scale - x, from.y * scale - y);
    ctx.lineTo(from.x * scale + x, from.y * scale + y);
    ctx.lineTo(to.x * scale + x, to.y * scale + y);
    ctx.lineTo(to.x * scale - x, to.y * scale - y);
    ctx.fill();

    if (label && label !== "") {
        const leftX = from.x < to.x ? from.x : to.x;
        const bottomY = from.y > to.y ? from.y : to.y;

        const lx = leftX + 0.2 + Math.abs(normalVec.x * normalVec.y) * 150;
        const ly = bottomY - 0.3;
        ctx.fillText(label, lx * scale, ly * scale);
    }
}

export function drawProp(location: Point, ctx: CanvasRenderingContext2D, scale: number, label?: string) {
    const gridX = Math.floor(location.x), gridY = Math.floor(location.y);

    ctx.beginPath();
    ctx.moveTo((gridX + 0.2) * scale, (gridY + 0.2) * scale);
    ctx.lineTo((gridX + 0.8) * scale, (gridY + 0.2) * scale);
    ctx.lineTo((gridX + 0.2) * scale, (gridY + 0.8) * scale);
    ctx.lineTo((gridX + 0.8) * scale, (gridY + 0.8) * scale);
    ctx.lineTo((gridX + 0.2) * scale, (gridY + 0.2) * scale);
    ctx.stroke();

    if (label && label !== "") {
        ctx.fillText(label, (gridX + 1) * scale, (gridY + 0.6) * scale);
    }

}
