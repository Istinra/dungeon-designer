import {Point} from "../../state";

export function* pointGenerator<T extends Point>(points: T[]): IterableIterator<{ from: T, to: T, index: number }> {
    if (points.length > 1) {
        for (let i = 0; i < points.length - 1; i++) {
            yield {from: points[i], to: points[i + 1], index: i};
        }
        yield {from: points[points.length - 1], to: points[0], index: points.length - 1};
    }
}