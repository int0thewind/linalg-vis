import { Shape } from './shape';
import * as math from 'mathjs';
import * as d3 from 'd3';

export class Polygon extends Shape {

    points: number[][];

    constructor(id: string, color: string, points: number[][]) {
        super('polygon', id, color);
        console.assert(points && points.length >= 2, `Your input points for the polygon ${id} is invalid.`);
        this.points = points;
    }

    transform(oldMatrix: math.Matrix, newMatrix: math.Matrix): void {
        // TODO implement this!
    }

    render(target: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
           xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): void {
        if (!document.getElementById(this.id)) {
            let pointsString = '';
            for (const point of this.points) {
                if (point.length !== 2) {
                    console.error(`Invalid point in polygon "${this.id}" detected!
                        Points should have only two parameters but yours is "${point}"\n
                        Please update the points and try again later.`);
                    return;
                }
                pointsString += `${xScale(point[0])},${yScale(point[1])} `;
            }

            const polyGroup = target.append('g')
                .attr('class', this.class)
                .attr('id', this.id);
            polyGroup.append('polygon')
                .attr('points', pointsString)
                .style('fill', this.color);
        }
    }
}
