import {Point} from "../../state";

export function calculateNormalVector(from: Point, to: Point): Point {
    const vx = to.x - from.x, vy = to.y - from.y;
    let vm = Math.sqrt(vx * vx + vy * vy);
    if (vm === 0) {
        vm = 1;
    }

    return {
        x: -vy / vm / 10,
        y: vx / vm / 10
    };
}

export function calculateDoorFromTo(wallFrom: Point, wallTo: Point, ratio: number): { from: Point, to: Point } {
    const vx = wallTo.x - wallFrom.x, vy = wallTo.y - wallFrom.y;
    const vm = Math.sqrt(vx * vx + vy * vy);

    const doorSpanX = 0.5 * vx / vm;
    const doorSpanY = 0.5 * vy / vm;

    return {
        from: {
            x: wallFrom.x + vx * ratio - doorSpanX,
            y: wallFrom.y + vy * ratio - doorSpanY,
        }, to: {
            x: wallFrom.x + vx * ratio + doorSpanX,
            y: wallFrom.y + vy * ratio + doorSpanY,
        }
    }
}